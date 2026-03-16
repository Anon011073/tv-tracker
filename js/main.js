/**
 * js/main.js - Homepage Logic
 */

let currentPage = 1;
let currentGenre = '';
let currentSort = 'first_air_date.desc'; // Default to newest aired

// Restored + Updated renderShows function (horizontal sections)
function renderShows(shows, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  shows.slice(0, 20).forEach(show => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${show.poster_path}" alt="${show.name}" />
      <h3>${show.name}</h3>
      <p>⭐ ${show.vote_average}</p>
    `;
    div.addEventListener('click', () => {
      window.location.href = `show.php?id=${show.id}`;
    });
    container.appendChild(div);
  });

  if (typeof addScrollArrows === 'function') {
    addScrollArrows(container);
  }
}

// Unified Grid Rendering
function renderGrid(shows, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  shows.forEach(show => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${show.poster_path}" alt="${show.name}" onerror="this.src='https://placehold.co/200x300?text=No+Image'"/>
      <h3>${show.name}</h3>
      <p>⭐ ${show.vote_average}</p>
    `;
    div.addEventListener('click', () => {
      window.location.href = `show.php?id=${show.id}`;
    });
    container.appendChild(div);
  });
}

function loadMainGrid(page = 1) {
  currentPage = page;
  let endpoint = `/discover/tv&page=${page}&sort_by=${currentSort}`;

  // Language filter
  const englishOnly = document.getElementById('englishOnly');
  if (englishOnly && englishOnly.checked) {
      endpoint += '&with_original_language=en';
  }

  // According to TMDB docs, you can sort discover by vote_average.desc,
  // and filter by air_date or first_air_date.
  // The user wants "newest aired tv episodes sorted by rating".
  if (currentSort === 'first_air_date.desc') {
      endpoint = `/discover/tv&page=${page}&sort_by=vote_average.desc&vote_count.gte=50&first_air_date.lte=${new Date().toISOString().split('T')[0]}`;
  }

  if (currentGenre) {
    endpoint += `&with_genres=${currentGenre}`;
  }

  fetch(`api/tmdb.php?endpoint=${endpoint}`)
    .then(res => res.json())
    .then(data => {
      renderGrid(data.results || [], 'mainGrid');
      updatePagination(data.page, data.total_pages);

      // Scroll back to top of grid
      document.getElementById('mainContent').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => console.error('Error loading main grid:', err));
}

function updatePagination(current, total) {
    const info = document.getElementById('pageInfo');
    if (info) info.textContent = `Page ${current} of ${total}`;

    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');
    if (prev) prev.disabled = current <= 1;
    if (next) next.disabled = current >= total;

    const numbers = document.getElementById('pageNumbers');
    if (!numbers) return;
    numbers.innerHTML = '';

    // Show a range of pages (e.g., current - 2 to current + 2)
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        btn.className = `page-num ${i === current ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => loadMainGrid(i);
        numbers.appendChild(btn);
    }
}

function searchShows() {
  const query = document.getElementById('searchInput').value.trim();
  const searchSection = document.getElementById('searchSection');
  const mainContent = document.getElementById('mainContent');

  if (!query) {
    searchSection.style.display = 'none';
    mainContent.style.display = 'block';
    return;
  }

  fetch(`api/tmdb.php?endpoint=/search/tv&query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      searchSection.style.display = 'block';
      mainContent.style.display = 'none';
      renderShows(data.results || [], 'searchResults');
    })
    .catch(err => console.error('Search error:', err));
}

function renderMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  movies.slice(0, 12).forEach(movie => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>📅 ${movie.release_date || 'Unknown'}</p>
    `;
    div.addEventListener('click', () => {
      window.location.href = `movie.php?id=${movie.id}`;
    });
    container.appendChild(div);
  });
  if (typeof addScrollArrows === 'function') {
    addScrollArrows(container);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const mainGrid = document.getElementById('mainGrid');
  if (mainGrid) {
    loadMainGrid();
  }

  const sortBy = document.getElementById('sortBy');
  if (sortBy) {
    sortBy.addEventListener('change', (e) => {
      currentSort = e.target.value;
      loadMainGrid(1);
    });
  }

  const englishOnly = document.getElementById('englishOnly');
  if (englishOnly) {
      englishOnly.addEventListener('change', () => {
          loadMainGrid(1);
      });
  }

  const genreItems = document.querySelectorAll('.genre-item');
  genreItems.forEach(item => {
    item.addEventListener('click', () => {
      genreItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentGenre = item.dataset.id;
      loadMainGrid(1);

      const gridTitle = document.getElementById('gridTitle');
      if (gridTitle) {
          gridTitle.textContent = currentGenre ? `${item.textContent} Shows` : 'Popular Shows';
      }
    });
  });

  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  if (prevBtn && mainGrid) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) loadMainGrid(currentPage - 1);
    });
  }

  if (nextBtn && mainGrid) {
    nextBtn.addEventListener('click', () => {
      loadMainGrid(currentPage + 1);
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(searchShows, 400);
    });
  }
});

// Backup & Restore
function exportData() {
  const data = {
    favs: JSON.parse(localStorage.getItem(getUserKey('favs')) || '[]'),
    watchProgress: JSON.parse(localStorage.getItem(getUserKey('watchProgress')) || '{}'),
    watchedMovies: JSON.parse(localStorage.getItem(getUserKey('watchedMovies')) || '[]'),
    resumeEpisodes: JSON.parse(localStorage.getItem(getUserKey('resumeEpisodes')) || '{}'),
    caughtUp: JSON.parse(localStorage.getItem(getUserKey('caughtUp')) || '{}'),
    selectedGenre: localStorage.getItem(getUserKey('selectedGenre')) || '80',
    theme: localStorage.getItem(getUserKey('theme')) || 'dark'
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tv-tracker-backup.json';
  a.click();
}

function importData() {
  const fileInput = document.getElementById('importFile');
  if (!fileInput.files.length) return alert('Please select a file first.');

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      Object.keys(data).forEach(key => {
        localStorage.setItem(getUserKey(key), typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]));
      });
      alert('Data imported successfully! Reloading...');
      location.reload();
    } catch (err) {
      alert('Invalid backup file.');
    }
  };
  reader.readAsText(fileInput.files[0]);
}
