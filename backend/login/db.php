<?php
// --------------------- CORS ---------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// --------------------- Database Connection ---------------------
$host = "localhost";
$db   = "eplms_user_management"; // Change to your DB name
$user = "root";                  // Change if needed
$pass = "mypassword";            // Change if needed

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

// Set charset to UTF-8
$conn->set_charset("utf8");

// Optional: display all mysqli errors for debugging
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
?>
