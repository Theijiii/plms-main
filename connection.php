<?php
// MySQL host
$host = "localhost";

// Single password for all databases
$password = "mypassword";

// Map each database to its own user
$databases = [
    'eplms_business_permit_system' => 'root',
    'eplms_franchise_applications' => 'root',
    // Add more databases as needed
];

// Get the target database from GET parameter or default
$targetDb = $_GET['db'] ?? 'eplms_business_permit_system';
$targetDb = $_GET['db'] ?? 'eplms_franchise_applications';

// Check if the target database exists
if (!array_key_exists($targetDb, $databases)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Unknown database: $targetDb"]);
    exit;
}

// Get the database user
$dbUser = $databases[$targetDb];

// Create MySQLi connection
$conn = mysqli_connect($host, $dbUser, $password, $targetDb);

// Check connection
if (!$conn) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database connection failed: " . mysqli_connect_error()
    ]);
    exit;
}

// Set charset to UTF-8
mysqli_set_charset($conn, "utf8mb4");

// Set headers for JSON responses and CORS
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
