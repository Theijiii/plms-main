<?php
header('Content-Type: application/json');
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
include '../../connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['action'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$id = intval($data['id']);
$action = trim($data['action']);
$notes = isset($data['Notes']) ? trim($data['Notes']) : null; // From frontend

$valid_actions = ['Approved', 'Rejected', 'For Compliance'];
if (!in_array($action, $valid_actions)) {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
    exit;
}

try {
    if ($action === 'For Compliance') {
        // Update status and notes
        $stmt = $conn->prepare("UPDATE franchise_applications SET status=?, notes=? WHERE id=?");
        if (!$stmt) throw new Exception($conn->error);
        $stmt->bind_param("ssi", $action, $notes, $id);
    } else {
        // Update only status
        $stmt = $conn->prepare("UPDATE franchise_applications SET status=? WHERE id=?");
        if (!$stmt) throw new Exception($conn->error);
        $stmt->bind_param("si", $action, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Status updated']);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
exit;
