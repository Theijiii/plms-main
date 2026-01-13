<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';
require_once '../middleware/auth.php';

$auth = new Auth();
$user_id = $auth->validateToken();

if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || $data->user_id != $user_id) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Forbidden"]);
    exit();
}

try {
    $query = "SELECT 
                p.permit_id,
                p.permit_type,
                p.application_type,
                p.business_name,
                p.owner_name,
                p.business_address,
                p.contact_number,
                p.status,
                p.fees,
                p.requirements,
                p.created_at,
                p.reviewed_at,
                p.approved_at,
                p.rejected_at,
                p.status_updated_at,
                p.compliance_notes,
                p.rejection_reason
              FROM permits p
              WHERE p.user_id = ?
              ORDER BY p.created_at DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $applications = [];
    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
    }
    
    echo json_encode([
        "success" => true,
        "applications" => $applications
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>