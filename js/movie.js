// File: js/movie.js

const TMDB_KEY = 'b6b677eb7d4ec17f700e3d4dfc31d005';
const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

if (movieId) fetchMovieDetails(movieId);

function fetchMovieDetails(id) {
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=en-US`)
    .then(res => res.json())
    .then(renderMovieDetails);
}

function renderMovieDetails(movie) {
  const container = document.getElementById('movieDetails');
  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '';

  container.innerHTML = `
    <section class="hero">
      <img src="${poster}" alt="${movie.title}" class="poster">
      <div class="hero-text">
        <h1>${movie.title}</h1>
        <p>${movie.overview}</p>
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ⭐ ${movie.vote_average}</p>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="watchMovie(${movie.id}, '${movie.title.replace(/'/g, "\'")}')">▶️ Watch Now</button>
        </div>
      </div>
    </section>
  `;
}

async function watchMovie(tmdbId, title) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_KEY}`);
  const data = await res.json();
  const imdbId = data.imdb_id;
  if (!imdbId) return alert('No IMDb ID found.');

  const formData = new FormData();
  formData.append('action', 'add');
  formData.append('tmdb_id', tmdbId);

  await fetch('api/watch_history.php', {
    method: 'POST',
    body: formData
  });

  window.location.href = `watch.html?id=${tmdbId}&type=movie`;
}

// Theme toggle
document.addEventListener('DOMContentLoaded', () => {
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
