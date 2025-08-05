document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('newest-episodes-container');
  if (!container) return;

  fetch('api/tmdb.php?endpoint=/tv/latest')
    .then(res => res.json())
    .then(data => {
      if (data && data.results) {
        const episodesByDay = data.results.reduce((acc, episode) => {
          const airDate = new Date(episode.air_date).toDateString();
          if (!acc[airDate]) {
            acc[airDate] = [];
          }
          acc[airDate].push(episode);
          return acc;
        }, {});

        for (const day in episodesByDay) {
          const dayContainer = document.createElement('div');
          dayContainer.className = 'day-container';

          const heading = document.createElement('h2');
          heading.textContent = day;
          dayContainer.appendChild(heading);

          const grid = document.createElement('div');
          grid.className = 'show-grid';
          dayContainer.appendChild(grid);

          episodesByDay[day].forEach(episode => {
            fetch(`api/tmdb.php?endpoint=/tv/${episode.show_id}/season/${episode.season_number}/episode/${episode.episode_number}/external_ids`)
              .then(res => res.json())
              .then(externalIds => {
                if (externalIds && externalIds.imdb_id) {
                  const card = document.createElement('div');
                  card.className = 'card';
                  card.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w200${episode.still_path}" alt="${episode.name}" />
                    <h3>${episode.name}</h3>
                    <p>Season ${episode.season_number}, Episode ${episode.episode_number}</p>
                    <a href="watch.html?id=${episode.show_id}&s=${episode.season_number}&e=${episode.episode_number}" class="btn">Watch Now</a>
                  `;
                  grid.appendChild(card);
                }
              });
          });

          container.appendChild(dayContainer);
        }
      }
    })
    .catch(err => console.error('Error loading newest episodes:', err));
});
