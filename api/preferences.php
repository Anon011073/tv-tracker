<?php
// api/preferences.php

require_once 'db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';

if ($action == 'get') {
    $stmt = $conn->prepare("SELECT theme, genre FROM user_preferences WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $preferences = $result->fetch_assoc();
    $stmt->close();

    if ($preferences) {
        echo json_encode(['success' => true, 'preferences' => $preferences]);
    } else {
        // If no preferences are found, return default values
        echo json_encode(['success' => true, 'preferences' => ['theme' => 'dark', 'genre' => '80']]);
    }

} elseif ($action == 'set') {
    $theme = $_POST['theme'] ?? null;
    $genre = $_POST['genre'] ?? null;

    // Check if preferences already exist for the user
    $stmt = $conn->prepare("SELECT id FROM user_preferences WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Update existing preferences
        $query = "UPDATE user_preferences SET";
        $params = [];
        $types = "";

        if ($theme !== null) {
            $query .= " theme = ?,";
            $params[] = $theme;
            $types .= "s";
        }
        if ($genre !== null) {
            $query .= " genre = ?,";
            $params[] = $genre;
            $types .= "s";
        }

        // Remove trailing comma
        $query = rtrim($query, ',');

        $query .= " WHERE user_id = ?";
        $params[] = $user_id;
        $types .= "i";

        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);

    } else {
        // Insert new preferences
        $stmt = $conn->prepare("INSERT INTO user_preferences (user_id, theme, genre) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $user_id, $theme, $genre);
    }
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Preferences updated.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update preferences.']);
    }
    $stmt->close();

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action.']);
}

$conn->close();
?>
