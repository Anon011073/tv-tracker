document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('newest-episodes-container');
  if (!container) return;

  fetch('api/tmdb.php?endpoint=/tv/on_the_air')
    .then(res => res.json())
    .then(data => {
      if (data && data.results) {
        const episodesByDay = {};

        const promises = data.results.map(show => {
          return fetch(`api/tmdb.php?endpoint=/tv/${show.id}`)
            .then(res => res.json())
            .then(showDetails => {
              if (showDetails && showDetails.last_episode_to_air) {
                const episode = showDetails.last_episode_to_air;
                const airDate = new Date(episode.air_date);
                const today = new Date();
                const diffTime = today - airDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 7) { // Only show episodes from the last 7 days
                  return fetch(`api/tmdb.php?endpoint=/tv/${show.id}/season/${episode.season_number}/episode/${episode.episode_number}/external_ids`)
                    .then(res => res.json())
                    .then(externalIds => {
                      if (externalIds && externalIds.imdb_id) {
                        const airDateStr = airDate.toDateString();
                        if (!episodesByDay[airDateStr]) {
                          episodesByDay[airDateStr] = [];
                        }
                        episodesByDay[airDateStr].push({
                          show_id: show.id,
                          season_number: episode.season_number,
                          episode_number: episode.episode_number,
                          name: episode.name,
                          still_path: episode.still_path,
                          show_name: show.name
                        });
                      }
                    });
                }
              }
            });
        });

        Promise.all(promises).then(() => {
          const sortedDays = Object.keys(episodesByDay).sort((a, b) => new Date(b) - new Date(a));

          for (const day of sortedDays) {
            const dayContainer = document.createElement('div');
            dayContainer.className = 'day-container';

            const heading = document.createElement('h2');
            heading.textContent = day;
            dayContainer.appendChild(heading);

            const grid = document.createElement('div');
            grid.className = 'show-grid';
            dayContainer.appendChild(grid);

            episodesByDay[day].forEach(episode => {
              const card = document.createElement('div');
              card.className = 'card';
              card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200${episode.still_path}" alt="${episode.name}" />
                <h3>${episode.show_name}</h3>
                <p>${episode.name}</p>
                <p>Season ${episode.season_number}, Episode ${episode.episode_number}</p>
                <a href="watch.html?id=${episode.show_id}&s=${episode.season_number}&e=${episode.episode_number}" class="btn">Watch Now</a>
              `;
              grid.appendChild(card);
            });

            container.appendChild(dayContainer);
          }
        });
      }
    })
    .catch(err => console.error('Error loading newest episodes:', err));
});
