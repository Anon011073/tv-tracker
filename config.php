<?php
// config.php

// Note to user:
// Please set the following environment variables:
// DB_HOST, DB_USER, DB_PASS, DB_NAME
// For example, in your shell profile (e.g., .bashrc, .zshrc):
// export DB_HOST="localhost"
// export DB_USER="root"
// export DB_PASS="password"
// export DB_NAME="movie_app"
//
// Alternatively, you can create a .env file in the root directory with these variables.
// Make sure to add .env to your .gitignore file.

// Database configuration
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: 'password');
define('DB_NAME', getenv('DB_NAME') ?: 'movie_app');

// TMDB API Key
define('TMDB_API_KEY', 'b6b677eb7d4ec17f700e3d4dfc31d005');

?>
