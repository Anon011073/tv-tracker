<?php

require_once 'config.php';

// Set the error reporting to throw exceptions for mysqli errors
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function getDbConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
        return $conn;
    } catch (mysqli_sql_exception $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        // Do not expose detailed error messages in production
        echo json_encode(['message' => 'Database connection failed. Please check server configuration.']);
        exit;
    }
}

?>
