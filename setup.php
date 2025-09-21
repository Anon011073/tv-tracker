<?php
// setup.php

require_once 'config.php';

// Connect to MySQL server
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully or already exists<br>";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

// Select the database
$conn->select_db(DB_NAME);

// SQL to create tables
$sql_users = "CREATE TABLE IF NOT EXISTS users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

$sql_favorites = "CREATE TABLE IF NOT EXISTS favorites (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(6) UNSIGNED NOT NULL,
    tmdb_id INT(10) NOT NULL,
    type VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)";

$sql_watch_history = "CREATE TABLE IF NOT EXISTS watch_history (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(6) UNSIGNED NOT NULL,
    tmdb_id INT(10) NOT NULL,
    season INT(4),
    episode INT(4),
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)";

$sql_resume_playback = "CREATE TABLE IF NOT EXISTS resume_playback (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(6) UNSIGNED NOT NULL,
    tmdb_id INT(10) NOT NULL,
    season INT(4),
    episode INT(4),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)";

$sql_user_preferences = "CREATE TABLE IF NOT EXISTS user_preferences (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(6) UNSIGNED NOT NULL,
    theme VARCHAR(10) DEFAULT 'dark',
    genre VARCHAR(10) DEFAULT '80',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)";

// Execute queries
if ($conn->query($sql_users) === TRUE) {
    echo "Table 'users' created successfully or already exists<br>";
} else {
    echo "Error creating table 'users': " . $conn->error . "<br>";
}

if ($conn->query($sql_favorites) === TRUE) {
    echo "Table 'favorites' created successfully or already exists<br>";
} else {
    echo "Error creating table 'favorites': " . $conn->error . "<br>";
}

if ($conn->query($sql_watch_history) === TRUE) {
    echo "Table 'watch_history' created successfully or already exists<br>";
} else {
    echo "Error creating table 'watch_history': " . $conn->error . "<br>";
}

if ($conn->query($sql_resume_playback) === TRUE) {
    echo "Table 'resume_playback' created successfully or already exists<br>";
} else {
    echo "Error creating table 'resume_playback': " . $conn->error . "<br>";
}

if ($conn->query($sql_user_preferences) === TRUE) {
    echo "Table 'user_preferences' created successfully or already exists<br>";
} else {
    echo "Error creating table 'user_preferences': " . $conn->error . "<br>";
}

$conn->close();
?>
