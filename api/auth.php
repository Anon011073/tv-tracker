<?php
// api/auth.php

require_once 'db.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? '';

if ($action == 'register') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $email = $_POST['email'] ?? '';

    if (empty($username) || empty($password) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Please fill all fields.']);
        exit;
    }

    // Check if username or email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Username or email already exists.']);
        $stmt->close();
        exit;
    }
    $stmt->close();

    // Hash the password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $password_hash, $email);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registration successful.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed.']);
    }
    $stmt->close();
} elseif ($action == 'login') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Please fill all fields.']);
        exit;
    }

    // Fetch user from database
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($user_id, $password_hash);

    if ($stmt->num_rows > 0) {
        $stmt->fetch();
        if (password_verify($password, $password_hash)) {
            session_start();
            $_SESSION['user_id'] = $user_id;
            $_SESSION['username'] = $username;
            echo json_encode(['success' => true, 'message' => 'Login successful.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid password.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
    }
    $stmt->close();
} elseif ($action == 'logout') {
    session_start();
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action.']);
}

$conn->close();
?>
