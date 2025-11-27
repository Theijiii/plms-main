<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ob_start();

// ✅ Show errors for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ❌ --- CORS Configuration Removed ---

// --- Database ---
$targetDb = 'eplms_franchise_applications';
include '../../connection.php';

// Validate database config
if (!isset($databases[$targetDb])) {
    echo json_encode(["success" => false, "message" => "Database config not found for $targetDb"]);
    exit;
}


// Fetch franchise applications
$table = "franchise_applications";

// Make sure all the frontend fields exist in your table
$sql = "SELECT 
            id,
            full_name,
            contact_number,
            citizenship,
            make_brand,
            model,
            route_zone,
            toda_name,
            barangay_of_operation,
            status
        FROM $table
        ORDER BY date_submitted DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
    $conn->close();
    exit;
}

$franchises = [];
while ($row = $result->fetch_assoc()) {
    $franchises[] = [
        "id" => (int)$row['id'],
        "full_name" => $row['full_name'],
        "contact_number" => $row['contact_number'],
        "citizenship" => $row['citizenship'],
        "make_brand" => $row['make_brand'],
        "model" => $row['model'],
        "route_zone" => $row['route_zone'],
        "toda_name" => $row['toda_name'],
        "barangay_of_operation" => $row['barangay_of_operation'],
        "status" => $row['status']
    ];
}

// Return as JSON array
echo json_encode($franchises);

// Close connection
$conn->close();
exit;
?>
