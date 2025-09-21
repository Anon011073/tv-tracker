document.addEventListener('DOMContentLoaded', () => {
  loadCalendar();
});

function loadCalendar() {
  const favs = JSON.parse(localStorage.getItem('favs') || '[]');
  const container = document.getElementById('calendarContainer');
  container.innerHTML = '<p>📡 Loading upcoming episodes...</p>';

  const promises = favs.map(show =>
    fetch(`api/tmdb.php?endpoint=/tv/${show.id}`)
      .then(res => res.json())
      .then(data => {
        const nextEp = data.next_episode_to_air;
        if (!nextEp) return null;
        return {
          name: show.name,
          episode: `S${nextEp.season_number}E${nextEp.episode_number} - ${nextEp.name}`,
          air_date: nextEp.air_date,
          showId: show.id
        };
      })
  );

  Promise.all(promises).then(episodes => {
    const filtered = episodes.filter(e => e);
    renderCalendar(filtered);
  });
}

function renderCalendar(episodes) {
  const container = document.getElementById('calendarContainer');
  if (!episodes.length) {
    container.innerHTML = '<p>No upcoming episodes found for your tracked shows.</p>';
    return;
  }

  // Group episodes by air_date
  const eventsByDate = {};
  episodes.forEach(ep => {
    if (!eventsByDate[ep.air_date]) eventsByDate[ep.air_date] = [];
    eventsByDate[ep.air_date].push(ep);
  });

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();

  let html = '<h2>Upcoming Episodes</h2>';

  sortedDates.forEach(dateStr => {
    const eps = eventsByDate[dateStr];
    const date = new Date(dateStr + 'T00:00:00'); // Ensure correct date parsing
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    let inner = `<h3>${dayName}, ${monthDay}</h3>`;
    eps.forEach(ep => {
      inner += `
        <p>
          <a href="show.html?id=${ep.showId}">
            <strong>${ep.name}</strong><br>
            <small>${ep.episode}</small>
          </a>
        </p>
      `;
    });
    html += `<div class="calendar-day">${inner}</div>`;
  });

  container.innerHTML = html;
}
