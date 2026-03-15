-- Database Schema for TV Tracker
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
);

-- Default admin account (admin / password123)
INSERT OR IGNORE INTO users (username, password) VALUES ('admin', '$2y$10$/BAUK178XV6JcP.tbWwraOF7nuEIGrLZbGnJNsBJdxY/oGhYeF6tu');
