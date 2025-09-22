// File: js/show.js
const params = new URLSearchParams(window.location.search);
const showId = params.get('id');

document.addEventListener('DOMContentLoaded', () => {
  fetchShowDetails(showId);
  setupTheme();
});

function setupTheme() {
  // Theme is set by default in the HTML, this function is no longer needed
  // but we keep it to avoid breaking other parts of the code that call it.
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
    <div class="grid">
      <div class="poster-container">
        <img src="https://image.tmdb.org/t/p/w300${show.poster_path}" alt="${show.name}" class="poster" />
        <div class="grid">
            <button id="favBtn">❤️ Add to Favourites</button>
            <a role="button" href="watch.html?id=${show.id}" target="_blank">▶️ Watch Now</a>
        </div>
        <button id="caughtUpBtn" class="secondary">✅ Mark as Caught Up</button>
        <button id="resetBtn" class="contrast">🗑️ Reset Progress</button>
      </div>
      <div class="hero-text">
        <h1>${show.name}</h1>
        <p><strong>Status:</strong> ${show.status}</p>
        <p><strong>Seasons:</strong> ${show.number_of_seasons}</p>
        <p>${show.overview}</p>
      </div>
    </div>

    <section id="cast"></section>
    <section id="reviews"></section>
    <section id="recommendations"></section>
    <section id="episodes"></section>
  `;

  // Note: The backend is broken, so the button functionality is left as-is for visual review.
  const favBtn = document.getElementById('favBtn');
  favBtn.addEventListener('click', () => alert('This functionality is under development.'));
  document.getElementById('caughtUpBtn').addEventListener('click', () => alert('This functionality is under development.'));
  document.getElementById('resetBtn').addEventListener('click', () => alert('This functionality is under development.'));

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
          '<div class="grid">' +
          data.results.slice(0, 6).map(show => `
            <div class="card" onclick="window.location.href='show.html?id=${show.id}'" style="cursor: pointer;">
              <img src="https://image.tmdb.org/t/p/w200${show.poster_path}" alt="${show.name}" />
              <h4>${show.name}</h4>
            </div>
          `).join('') + '</div>';
      }
    });
}

function renderEpisodes(showId, seasonNumber, episodes) {
  const container = document.getElementById('episodes');
  const progress = getWatchProgress(showId);
  const seasonId = `season-${showId}-${seasonNumber}`;

  let html = `
    <div class="season-block">
      <h3 onclick="toggleSeason('${seasonId}')">📂 Season ${seasonNumber} (click to expand)</h3>
      <div id="${seasonId}" class="season-body" style="display:none;">
  `;

  episodes.forEach((ep, idx) => {
    const watched = progress[seasonNumber]?.[idx] ?? false;
    html += `
      <div class="episode-row">
        <input type="checkbox" id="ep-${seasonNumber}-${idx}" ${watched ? 'checked' : ''}
          onchange="markEpisode(${showId}, ${seasonNumber}, ${idx}, this.checked)">
        <label for="ep-${seasonNumber}-${idx}">S${seasonNumber}E${ep.episode_number}: ${ep.name}</label>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML += html;
}

function getWatchProgress(showId) {
  // Dummy function for visual review
  return {};
}

function markEpisode(showId, season, index, checked) {
    // Dummy function for visual review
    console.log(`Marking episode: ${showId}, S${season}E${index}, Watched: ${checked}`);
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