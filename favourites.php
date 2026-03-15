<?php require_once 'auth_check.php'; ?><!-- File: favourites.php -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Favourites</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
<nav>
  <button id="themeToggle" class="theme-toggle">🌙 Toggle Theme</button>
  <a href="index.php">🏠 Home</a>
  <a href="calendar.php">📅 Calendar</a>
  <a href="favourites.php">⭐ Favourites</a>
  <a href="watchlist.php">📋 Watchlist</a>
    <a href="logout.php">🚪 Logout</a>
</nav>
  <h1>❤️ Your Favourites</h1>
  <div id="favouritesList"></div>

  <script>
    const favs = JSON.parse(localStorage.getItem('favs') || '[]');
    const container = document.getElementById('favouritesList');

    if (favs.length === 0) {
      container.innerHTML = '<p>No favourites yet!</p>';
    } else {
      favs.forEach(fav => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>${fav.name}</h3>
          <button onclick="removeFav(${fav.id})">Remove</button>
          <button onclick="location.href='show.php?id=${fav.id}'">Details</button>
        `;
        container.appendChild(div);
      });
    }

    function removeFav(id) {
      let updated = favs.filter(f => f.id !== id);
      localStorage.setItem('favs', JSON.stringify(updated));
      location.reload();
    }
  </script>
 <script src="js/theme.js"></script>
<footer class="site-footer">
  <p>© 2025 TV Tracker — Built with ❤️ for your watchlist.</p>
  <p>
    <a href="calendar.php">📅 Episode Calendar</a> |
    <a href="index.php">🏠 Back to Home</a>
  </p>
</footer>
<a href="#" class="back-to-top" title="Back to Top">⬆️ Top</a>
</body>
</html>
