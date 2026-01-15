<?php
// fetch_single.php - Fetch single business permit application
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database Connection
$conn = new mysqli('localhost', 'root', 'mypassword', 'eplms_business_permit_db');

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

try {
    if (!isset($_GET['permit_id'])) {
        throw new Exception('Permit ID is required');
    }

$permit_id = $_GET['permit_id'] ?? 0;

// Use permit_id in your SQL query
$sql = "SELECT * FROM business_permit_applications WHERE permit_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $permit_id);
$stmt->execute();
    if (!$stmt->execute()) {
        throw new Exception("Failed to fetch application: " . $stmt->error);
    }

    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("Application not found");
    }

    $application = $result->fetch_assoc();
    $stmt->close();

    // Fetch documents
    $docSql = "SELECT * FROM application_documents WHERE permit_id = ? ORDER BY document_type";
    $docStmt = $conn->prepare($docSql);
    $docStmt->bind_param("i", $permit_id);
    $docStmt->execute();
    $docResult = $docStmt->get_result();
    
    $documents = [];
    while ($doc = $docResult->fetch_assoc()) {
        $documents[] = $doc;
    }
    $docStmt->close();

    // Add documents to application data
    $application['documents'] = $documents;

    echo json_encode([
        'success' => true,
        'data' => $application
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>