<?php
session_start();
header("Content-Type: application/json");

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    echo json_encode([
        'success' => true,
        'email' => $_SESSION['admin_email'] ?? '',
        'role' => 'admin'
    ]);
    exit;
}

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'email' => $_SESSION['email'] ?? '',
        'role' => 'user'
    ]);
    exit;
}

echo json_encode(['success' => false]);
exit;
