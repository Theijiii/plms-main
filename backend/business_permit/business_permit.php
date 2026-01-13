<?php
// business_permit_simple.php - Simplified version
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

ob_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database Connection
$conn = new mysqli('localhost', 'root', 'mypassword', 'eplms_business_permit_db');

if ($conn->connect_error) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Method not allowed. Use POST.');
    }
    
    // Generate IDs
    $applicant_id = 'APP' . date('Y') . mt_rand(10, 999);
    
    // Get only essential fields to start
    $application_date = date('Y-m-d');
    $permit_type = $_POST['permit_type'] ?? 'NEW';
    $status = 'PENDING';
    
    // Required fields
    $owner_last_name = $_POST['last_name'] ?? '';
    $owner_first_name = $_POST['first_name'] ?? '';
    $business_name = $_POST['business_name'] ?? '';
    $contact_number = $_POST['contact_number'] ?? '';
    $email_address = $_POST['email_address'] ?? '';
    $owner_type = $_POST['owner_type'] ?? '';
    $citizenship = $_POST['citizenship'] ?? '';
    $home_address = $_POST['home_address'] ?? '';
    $valid_id_type = $_POST['valid_id_type'] ?? '';
    $valid_id_number = $_POST['valid_id_number'] ?? '';
    $business_nature = $_POST['business_nature'] ?? '';
    $building_type = $_POST['building_type'] ?? '';
    $house_bldg_no = $_POST['house_bldg_no'] ?? '';
    $street = $_POST['street'] ?? '';
    $barangay = $_POST['barangay'] ?? '';
    
    // Validate required fields
    if (empty($owner_last_name) || empty($owner_first_name) || empty($business_name) || 
        empty($contact_number) || empty($email_address) || empty($owner_type) || 
        empty($citizenship) || empty($home_address) || empty($valid_id_type) || 
        empty($valid_id_number) || empty($business_nature) || empty($building_type) || 
        empty($house_bldg_no) || empty($street) || empty($barangay)) {
        throw new Exception('All required fields must be filled.');
    }
    
    // Simple SQL with only essential fields
    $sql = "INSERT INTO business_permit_applications (
        applicant_id, application_date, permit_type, status,
        owner_last_name, owner_first_name, owner_type, citizenship,
        contact_number, email_address, home_address, valid_id_type, valid_id_number,
        business_name, business_nature, building_type, house_bldg_no, street, barangay
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    // Bind only 19 parameters
    $stmt->bind_param(
        "sssssssssssssssssss",
        $applicant_id,
        $application_date,
        $permit_type,
        $status,
        $owner_last_name,
        $owner_first_name,
        $owner_type,
        $citizenship,
        $contact_number,
        $email_address,
        $home_address,
        $valid_id_type,
        $valid_id_number,
        $business_name,
        $business_nature,
        $building_type,
        $house_bldg_no,
        $street,
        $barangay
    );
    
    if ($stmt->execute()) {
        $permit_id = $conn->insert_id;
        
        ob_clean();
        echo json_encode([
            'success' => true,
            'message' => 'Application submitted successfully!',
            'permit_id' => $permit_id,
            'applicant_id' => $applicant_id
        ]);
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
exit();
?>