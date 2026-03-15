<?php require_once 'auth_check.php'; ?><!-- File: calendar.php -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>📆 TV Tracker – Calendar</title>
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

<main>
  <div id="calendarContainer"></div>
</main>
<footer class="site-footer">
  <p>© 2025 TV Tracker — Built with ❤️ for your watchlist.</p>
  <p>
    <a href="calendar.php">📅 Episode Calendar</a> |
    <a href="index.php">🏠 Back to Home</a>
  </p>
</footer>
<script src="js/theme.js"></script>
<script src="js/calendar.js"></script>
<a href="#top" class="back-to-top">Back to Top</a>
</body>
</html>
