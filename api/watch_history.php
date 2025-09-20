<?php
// api/watch_history.php

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
    $season = $_POST['season'] ?? null;
    $episode = $_POST['episode'] ?? null;

    if (empty($tmdb_id)) {
        echo json_encode(['success' => false, 'message' => 'Missing tmdb_id.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO watch_history (user_id, tmdb_id, season, episode) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiii", $user_id, $tmdb_id, $season, $episode);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Watch history updated.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update watch history.']);
    }
    $stmt->close();

} elseif ($action == 'remove_episode') {
    $tmdb_id = $_POST['tmdb_id'] ?? '';
    $season = $_POST['season'] ?? null;
    $episode = $_POST['episode'] ?? null;

    if (empty($tmdb_id) || $season === null || $episode === null) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM watch_history WHERE user_id = ? AND tmdb_id = ? AND season = ? AND episode = ?");
    $stmt->bind_param("iiii", $user_id, $tmdb_id, $season, $episode);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Episode removed from watch history.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to remove episode from watch history.']);
    }
    $stmt->close();

} elseif ($action == 'get') {
    $tmdb_id = $_GET['tmdb_id'] ?? '';

    if (empty($tmdb_id)) {
        echo json_encode(['success' => false, 'message' => 'Missing tmdb_id.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT season, episode FROM watch_history WHERE user_id = ? AND tmdb_id = ?");
    $stmt->bind_param("ii", $user_id, $tmdb_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $history = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    echo json_encode(['success' => true, 'history' => $history]);

} elseif ($action == 'reset') {
    $tmdb_id = $_POST['tmdb_id'] ?? '';

    if (empty($tmdb_id)) {
        echo json_encode(['success' => false, 'message' => 'Missing tmdb_id.']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM watch_history WHERE user_id = ? AND tmdb_id = ?");
    $stmt->bind_param("ii", $user_id, $tmdb_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Watch history reset.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to reset watch history.']);
    }
    $stmt->close();

} elseif ($action == 'update_resume') {
    $tmdb_id = $_POST['tmdb_id'] ?? '';
    $season = $_POST['season'] ?? null;
    $episode = $_POST['episode'] ?? null;

    if (empty($tmdb_id)) {
        echo json_encode(['success' => false, 'message' => 'Missing tmdb_id.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO resume_playback (user_id, tmdb_id, season, episode) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE season = VALUES(season), episode = VALUES(episode)");
    $stmt->bind_param("iiii", $user_id, $tmdb_id, $season, $episode);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Resume point updated.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update resume point.']);
    }
    $stmt->close();

} elseif ($action == 'get_resume') {
    $tmdb_id = $_GET['tmdb_id'] ?? '';

    if (empty($tmdb_id)) {
        echo json_encode(['success' => false, 'message' => 'Missing tmdb_id.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT season, episode FROM resume_playback WHERE user_id = ? AND tmdb_id = ?");
    $stmt->bind_param("ii", $user_id, $tmdb_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $resume = $result->fetch_assoc();
    $stmt->close();

    echo json_encode(['success' => true, 'resume' => $resume]);

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action.']);
}

$conn->close();
?>
