<?php require_once 'auth_check.php'; ?><!-- File: schedule.php -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Upcoming Episodes</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
<nav>
<button id="themeToggle" class="theme-toggle">🌙 Toggle Theme</button>
  <a href="index.php">🏠 Home</a>
  <a href="schedule.php">📅 Schedule</a>
  <a href="favourites.php">⭐ Favourites</a>
  <a href="watchlist.php">📋 Watchlist</a>
    <a href="logout.php">🚪 Logout</a>
</nav>
  <h1>🗓️ Upcoming Episodes You're Not Caught Up On</h1>
  <div id="scheduleList"></div>

  <script>
    const favs = JSON.parse(localStorage.getItem('favs') || '[]');
    const caughtUp = JSON.parse(localStorage.getItem('caughtUp') || '{}');
    const container = document.getElementById('scheduleList');

    favs.forEach(fav => {
      fetch(`api/tmdb.php?endpoint=/tv/${fav.id}`)
        .then(res => res.json())
        .then(show => {
          if (show.status === 'Returning Series' && show.next_episode_to_air) {
            const next = show.next_episode_to_air;
            const nextAir = new Date(next.air_date);
            const lastSeen = new Date(caughtUp[fav.id] || '1900-01-01');

            if (nextAir > lastSeen) {
              const div = document.createElement('div');
              div.innerHTML = `
                <h3>${show.name}</h3>
                <p>Next: S${next.season_number}E${next.episode_number} - ${next.name}</p>
                <p>Airs on: ${next.air_date}</p>
                <a href="show.php?id=${show.id}">📄 View Show</a>
              `;
              container.appendChild(div);
            }
          }
        });
    });
  </script>
  <script src="js/theme.js"></script>

</body>
</html>
