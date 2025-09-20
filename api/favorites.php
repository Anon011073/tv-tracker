<?php
// api/favorites.php

require_once 'db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';

if ($action == 'add') {
    $tmdb_id = $_POST['tmdb_id'] ?? '';
    $type = $_POST['type'] ?? '';
    $title = $_POST['title'] ?? '';
    $poster_path = $_POST['poster_path'] ?? '';

    if (empty($tmdb_id) || empty($type) || empty($title)) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO favorites (user_id, tmdb_id, type, title, poster_path) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iisss", $user_id, $tmdb_id, $type, $title, $poster_path);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Added to favorites.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add to favorites.']);
    }
    $stmt->close();

} elseif ($action == 'remove') {
    $tmdb_id = $_POST['tmdb_id'] ?? '';

    if (empty($tmdb_id)) {
        echo json_encode(['success' => false, 'message' => 'Missing tmdb_id.']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM favorites WHERE user_id = ? AND tmdb_id = ?");
    $stmt->bind_param("ii", $user_id, $tmdb_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Removed from favorites.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to remove from favorites.']);
    }
    $stmt->close();

} elseif ($action == 'list') {
    $stmt = $conn->prepare("SELECT tmdb_id, type, title, poster_path FROM favorites WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $favorites = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    echo json_encode(['success' => true, 'favorites' => $favorites]);

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action.']);
}

$conn->close();
?>
