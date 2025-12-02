<?php
// -----------------------------
// HEADERS & CORS
// -----------------------------
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// -----------------------------
// DATABASE CONFIG
// -----------------------------
$host = "localhost";
$password = "mypassword"; // Shared MySQL password

// Map of databases and their users
$databases = [
    "eplms_user_management" => "root",
    "eplms_barangay_permit_db" => "root",
    // Add more databases here
];

// -----------------------------
// DETERMINE TARGET DATABASE
// -----------------------------
$targetDb = $_GET['db'] ?? "eplms_user_management";

// Validate database
if (!array_key_exists($targetDb, $databases)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Unknown database: $targetDb"
    ]);
    exit;
}

$dbUser = $databases[$targetDb];

// -----------------------------
// CONNECT TO DATABASE
// -----------------------------
$conn = new mysqli($host, $dbUser, $password, $targetDb);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

// Set charset
$conn->set_charset("utf8mb4");

// -----------------------------
// CONNECTION SUCCESS
// -----------------------------
// $conn is now available for queries in any included file
?>
