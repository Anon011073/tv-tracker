<?php
// alter_table.php

require_once 'config.php';

// Connect to MySQL server
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL to alter table
$sql = "ALTER TABLE user_preferences ADD COLUMN genre VARCHAR(10) DEFAULT '80'";

if ($conn->query($sql) === TRUE) {
    echo "Table 'user_preferences' altered successfully<br>";
} else {
    echo "Error altering table: " . $conn->error . "<br>";
}

$conn->close();
?>
