// File: js/show.js
const params = new URLSearchParams(window.location.search);
const showId = params.get('id');

document.addEventListener('DOMContentLoaded', () => {
  fetchShowDetails(showId);
  setupTheme();
});

function setupTheme() {
  const toggleBtn = document.getElementById('themeToggle');

  fetch('api/preferences.php?action=get')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.body.classList.add(data.preferences.theme + '-mode');
      }
    });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', async () => {
      const isDark = document.body.classList.contains('dark-mode');
      const newTheme = isDark ? 'light' : 'dark';
      document.body.classList.remove(isDark ? 'dark-mode' : 'light-mode');
      document.body.classList.add(newTheme + '-mode');

      const formData = new FormData();
      formData.append('action', 'set');
      formData.append('theme', newTheme);

      await fetch('api/preferences.php', {
        method: 'POST',
        body: formData
      });
    });
  }
}

function fetchShowDetails(id) {
  fetch(`api/tmdb.php?endpoint=/tv/${id}`)
    .then(res => res.json())
    .then(show => {
      renderShowDetails(show);
      loadCast(id);
      loadReviews(id);
      loadRecommendations(id);
    });
}

function renderShowDetails(show) {
  const container = document.getElementById('showDetails');

  container.innerHTML = `
    <section class="hero">
      <img src="https://image.tmdb.org/t/p/w300${show.poster_path}" alt="${show.name}" class="poster" />
      <div class="hero-text">
        <h1>${show.name}</h1>
        <p>${show.overview}</p>
        <p><strong>Status:</strong> ${show.status}</p>
        <p><strong>Seasons:</strong> ${show.number_of_seasons}</p>

        <div class="btn-group">
          <button id="favBtn" class="btn">❤️ Loading...</button>
          <button id="caughtUpBtn" class="btn btn-secondary">✅ Mark as Caught Up</button>
          <button id="resetBtn" class="btn btn-danger">🗑️ Reset Progress</button>
          <a class="btn btn-primary" href="watch.html?id=${show.id}" target="_blank">▶️ Watch Now</a>
        </div>
      </div>
    </section>

    <section id="cast"></section>
    <section id="reviews"></section>
    <section id="recommendations"></section>
    <section id="episodes"></section>
  `;

  const favBtn = document.getElementById('favBtn');
  // We need to check if the user is logged in before we can check for favorites
  fetch('api/session.php')
    .then(res => res.json())
    .then(session => {
      if (session.loggedIn) {
        fetch('api/favorites.php?action=list')
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            if (data.success) {
              const isFav = data.favorites.some(f => f.tmdb_id === show.id);
              favBtn.textContent = isFav ? '❌ Remove from Favourites' : '❤️ Add to Favourites';
              favBtn.addEventListener('click', () => toggleFavourite(show.id, show.name, show.poster_path, isFav));
            } else {
              favBtn.textContent = 'Error';
            }
          })
          .catch(error => {
            console.error('Error fetching favorites:', error);
            favBtn.textContent = 'Error';
          });
      } else {
        favBtn.textContent = '❤️ Add to Favourites';
        favBtn.addEventListener('click', () => {
          window.location.href = 'login.html';
        });
      }
    });
  document.getElementById('caughtUpBtn').addEventListener('click', () => markCaughtUp(show.id));
  document.getElementById('resetBtn').addEventListener('click', () => resetProgress(show.id));

  for (let season = 1; season <= show.number_of_seasons; season++) {
    fetch(`api/tmdb.php?endpoint=/tv/${show.id}/season/${season}`)
      .then(res => res.json())
      .then(seasonData => renderEpisodes(show.id, season, seasonData.episodes));
  }
}


function loadCast(id) {
  fetch(`api/tmdb.php?endpoint=/tv/${id}/credits`)
    .then(res => res.json())
    .then(data => {
      const castDiv = document.getElementById('cast');
      castDiv.innerHTML = '<h3>🎭 Cast</h3>' +
        '<div class="cast-list">' +
        data.cast.slice(0, 6).map(c =>
          `<div class="cast-card">${c.name}<br><small>as ${c.character}</small></div>`
        ).join('') + '</div>';
    });
}

function loadReviews(id) {
  fetch(`api/tmdb.php?endpoint=/tv/${id}/reviews`)
    .then(res => res.json())
    .then(data => {
      const reviewDiv = document.getElementById('reviews');
      if (data.results.length > 0) {
        reviewDiv.innerHTML = '<h3>📝 Reviews</h3>' +
          data.results.slice(0, 3).map(r =>
            `<div class="review">
              <strong>${r.author}</strong><p>${r.content.substring(0, 200)}...</p>
            </div>`
          ).join('');
      }
    });
}

function loadRecommendations(id) {
  fetch(`api/tmdb.php?endpoint=/tv/${id}/recommendations`)
    .then(res => res.json())
    .then(data => {
      const recDiv = document.getElementById('recommendations');
      if (data.results.length > 0) {
        recDiv.innerHTML = '<h3>🔁 Recommendations</h3>' +
          '<div class="recommendation-grid">' +
          data.results.slice(0, 6).map(show => `
            <div class="rec-card" onclick="window.location.href='show.html?id=${show.id}'">
              <img src="https://image.tmdb.org/t/p/w154${show.poster_path}" alt="${show.name}" />
              <h4>${show.name}</h4>
            </div>
          `).join('') + '</div>';
      }
    });
}

async function renderEpisodes(showId, seasonNumber, episodes) {
  const container = document.getElementById('episodes');
  const progress = await getWatchProgress(showId);
  const seasonId = `season-${showId}-${seasonNumber}`;

  let html = `
    <div class="season-block">
      <h3 onclick="toggleSeason('${seasonId}')">📂 Season ${seasonNumber} (click to expand)</h3>
      <div id="${seasonId}" class="season-body" style="display:none;">
  `;

  episodes.forEach(ep => {
    const watched = progress[seasonNumber]?.[ep.episode_number] ?? false;
    html += `
      <div class="episode-row">
        <input type="checkbox" id="ep-${seasonNumber}-${ep.episode_number}" ${watched ? 'checked' : ''}
          onchange="markEpisode(${showId}, ${seasonNumber}, ${ep.episode_number}, this.checked)">
        <label for="ep-${seasonNumber}-${ep.episode_number}">S${seasonNumber}E${ep.episode_number}: ${ep.name}</label>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML += html;
}

async function toggleFavourite(id, name, poster_path, isFav) {
  const btn = document.getElementById('favBtn');
  const action = isFav ? 'remove' : 'add';

  const formData = new FormData();
  formData.append('action', action);
  formData.append('tmdb_id', id);
  formData.append('type', 'tv');
  formData.append('title', name);
  formData.append('poster_path', poster_path);

  try {
    const response = await fetch('api/favorites.php', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    alert(result.message);

    if (result.success) {
      if (isFav) {
        btn.textContent = '❤️ Add to Favourites';
      } else {
        btn.textContent = '❌ Remove from Favourites';
      }
      location.reload();
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    alert('An error occurred. Please try again.');
  }
}

async function markCaughtUp(showId) {
  const response = await fetch(`api/tmdb.php?endpoint=/tv/${showId}`);
  const show = await response.json();
  const totalSeasons = show.number_of_seasons;
  const promises = [];

  for (let s = 1; s <= totalSeasons; s++) {
    const seasonResponse = await fetch(`api/tmdb.php?endpoint=/tv/${showId}/season/${s}`);
    const seasonData = await seasonResponse.json();
    seasonData.episodes.forEach(episode => {
      const formData = new FormData();
      formData.append('action', 'add');
      formData.append('tmdb_id', showId);
      formData.append('season', s);
      formData.append('episode', episode.episode_number);
      promises.push(
        fetch('api/watch_history.php', {
          method: 'POST',
          body: formData
        })
      );
    });
  }

  await Promise.all(promises);
  alert('Marked all episodes as watched.');
  location.reload();
}

async function resetProgress(showId) {
  const formData = new FormData();
  formData.append('action', 'reset');
  formData.append('tmdb_id', showId);

  const response = await fetch('api/watch_history.php', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  alert(result.message);

  if (result.success) {
    location.reload();
  }
}


async function getWatchProgress(showId) {
  const response = await fetch(`api/watch_history.php?action=get&tmdb_id=${showId}`);
  const data = await response.json();
  if (data.success) {
    const progress = {};
    data.history.forEach(item => {
      if (!progress[item.season]) {
        progress[item.season] = {};
      }
      progress[item.season][item.episode] = true;
    });
    return progress;
  }
  return {};
}

async function markEpisode(showId, season, episode, checked) {
  const formData = new FormData();
  formData.append('action', checked ? 'add' : 'remove_episode'); // 'remove_episode' is not implemented yet, but this is how it would work
  formData.append('tmdb_id', showId);
  formData.append('season', season);
  formData.append('episode', episode);

  const response = await fetch('api/watch_history.php', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  if (!result.success) {
    alert(result.message);
  }
}

function toggleSeason(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function setupTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.add(savedTheme + '-mode');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      document.body.classList.remove(isDark ? 'dark-mode' : 'light-mode');
      document.body.classList.add(isDark ? 'light-mode' : 'dark-mode');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
  }
}