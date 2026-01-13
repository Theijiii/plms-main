<?php
session_start();

$allowedOrigins = [
    'http://localhost',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header("Access-Control-Allow-Origin: http://localhost");
}
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Destroy PHP session
session_destroy();

// Clear session cookie
setcookie('PHPSESSID', '', time() - 3600, '/');

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);
?>