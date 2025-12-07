<?php
// Always return JSON
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include DB connection
require_once __DIR__ . '/db.php';

try {
    // Get database connection
    $conn = getDBConnection();
    
    if (!$conn || $conn->connect_error) {
        throw new Exception("Failed to connect to database: " . ($conn ? $conn->connect_error : "No connection"));
    }

    // Set charset to UTF-8
    $conn->set_charset("utf8mb4");

    // Get request data
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception("Invalid JSON data");
    }

    // Get permit ID from URL or data
    $permitId = null;
    if (isset($_GET['id'])) {
        $permitId = intval($_GET['id']);
    } elseif (isset($data['permit_id'])) {
        $permitId = intval($data['permit_id']);
    } elseif (isset($data['id'])) {
        $permitId = intval($data['id']);
    }

    if (!$permitId) {
        throw new Exception("Permit ID is required");
    }

    // Get status and optional fields
    $status = isset($data['status']) ? trim($data['status']) : null;
    $reviewComments = isset($data['review_comments']) ? trim($data['review_comments']) : null;
    $complianceRemarks = isset($data['compliance_remarks']) ? trim($data['compliance_remarks']) : null;
    $assignedOfficer = isset($data['assigned_officer']) ? trim($data['assigned_officer']) : null;

    // Validate status
    $validStatuses = ['pending', 'approved', 'rejected'];
    if ($status && !in_array(strtolower($status), $validStatuses)) {
        throw new Exception("Invalid status. Must be one of: " . implode(', ', $validStatuses));
    }

    // Check which columns exist in the table
    $checkColumns = $conn->query("SHOW COLUMNS FROM barangay_permit LIKE 'review_comments'");
    $hasReviewComments = $checkColumns && $checkColumns->num_rows > 0;
    
    $checkColumns = $conn->query("SHOW COLUMNS FROM barangay_permit LIKE 'compliance_remarks'");
    $hasComplianceRemarks = $checkColumns && $checkColumns->num_rows > 0;
    
    $checkColumns = $conn->query("SHOW COLUMNS FROM barangay_permit LIKE 'assigned_officer'");
    $hasAssignedOfficer = $checkColumns && $checkColumns->num_rows > 0;

    // Build update query
    $updates = [];
    $params = [];
    $types = '';

    if ($status) {
        $updates[] = "status = ?";
        $params[] = strtolower($status);
        $types .= 's';
    }

    if ($reviewComments !== null && $hasReviewComments) {
        $updates[] = "review_comments = ?";
        $params[] = $reviewComments;
        $types .= 's';
    }

    if ($complianceRemarks !== null && $hasComplianceRemarks) {
        $updates[] = "compliance_remarks = ?";
        $params[] = $complianceRemarks;
        $types .= 's';
    }

    if ($assignedOfficer !== null && $hasAssignedOfficer) {
        $updates[] = "assigned_officer = ?";
        $params[] = $assignedOfficer;
        $types .= 's';
    }

    if (empty($updates)) {
        throw new Exception("No fields to update");
    }

    // Always update updated_at
    $updates[] = "updated_at = NOW()";
    $params[] = $permitId;
    $types .= 'i';

    $sql = "UPDATE barangay_permit SET " . implode(', ', $updates) . " WHERE permit_id = ?";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    // Bind parameters
    $stmt->bind_param($types, ...$params);

    // Execute the query
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute query: " . $stmt->error);
    }

    // Check if any rows were affected
    if ($stmt->affected_rows === 0) {
        throw new Exception("No permit found with ID: " . $permitId);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();

    // Return success response
    echo json_encode([
        "success" => true,
        "message" => "Permit status updated successfully",
        "permit_id" => $permitId,
        "updated_fields" => array_keys(array_filter([
            'status' => $status,
            'review_comments' => $reviewComments,
            'compliance_remarks' => $complianceRemarks,
            'assigned_officer' => $assignedOfficer
        ])),
        "timestamp" => date('c')
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    // Log error
    error_log("Error in update_status.php: " . $e->getMessage());
    
    // Return error response
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "timestamp" => date('c')
    ], JSON_PRETTY_PRINT);
    
    // Ensure connection is closed even on error
    if (isset($conn) && $conn) {
        $conn->close();
    }
}
?>

