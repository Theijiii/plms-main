<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$response = ['success' => false, 'message' => '', 'data' => null];

try {
    $permit_number = $_GET['permit_number'] ?? '';
    
    if (empty($permit_number)) {
        throw new Exception('Permit number is required');
    }
    
    // Search by permit_id or applicant_id
    $stmt = $conn->prepare("
        SELECT * FROM liquor_permit_applications 
        WHERE permit_id = ? OR applicant_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    
    $stmt->bind_param("ss", $permit_number, $permit_number);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        $response['success'] = true;
        $response['message'] = 'Permit found';
        $response['data'] = $data;
    } else {
        throw new Exception('Liquor permit not found');
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
