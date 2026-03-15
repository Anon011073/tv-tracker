<?php require_once 'auth_check.php'; ?><!-- File: watch.php -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Watch</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <nav>
    <button id="themeToggle" class="theme-toggle">🌙 Toggle Theme</button>
    <a href="index.php">🏠 Home</a>
    <a href="calendar.php">📅 Calendar</a>
    <a href="favourites.php">⭐ Favourites</a>
    <a href="watchlist.php">📋 Watchlist</a>
    <a href="index.php">🎬 Movies</a>
    <a href="logout.php">🚪 Logout</a>
  </nav>

  <div id="videoPlayer">
    <h2>Now Playing: <span id="movieTitle">Loading...</span></h2>
    <iframe id="iframe" scrolling="no" src="" allowfullscreen></iframe>
    <p style="color: rgb(79, 221, 221); font-weight: 500;">If there's an error or buffering, refresh or try a different source.</p>
  </div>

  <div id="episodeList"></div>

  <script src="js/theme.js"></script>
  <script src="js/watch.js"></script>
</body>
</html>
