<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$response = ['success' => false, 'message' => '', 'data' => null];

try {
    // Get form data
    $applicant_id = $_POST['applicant_id'] ?? '';
    $application_type = $_POST['application_type'] ?? 'NEW';
    $existing_permit_number = $_POST['existing_permit_number'] ?? '';
    
    // Business Information
    $business_name = $_POST['business_name'] ?? '';
    $business_address = $_POST['business_address'] ?? '';
    $business_email = $_POST['business_email'] ?? '';
    $business_phone = $_POST['business_phone'] ?? '';
    $business_type = $_POST['business_type'] ?? '';
    $business_nature = $_POST['business_nature'] ?? '';
    
    // Owner Information
    $owner_first_name = $_POST['owner_first_name'] ?? '';
    $owner_last_name = $_POST['owner_last_name'] ?? '';
    $owner_middle_name = $_POST['owner_middle_name'] ?? '';
    $owner_address = $_POST['owner_address'] ?? '';
    $id_type = $_POST['id_type'] ?? '';
    $id_number = $_POST['id_number'] ?? '';
    $date_of_birth = $_POST['date_of_birth'] ?? '';
    $citizenship = $_POST['citizenship'] ?? 'FILIPINO';
    
    // Barangay Clearance
    $barangay_clearance_id = $_POST['barangay_clearance_id'] ?? '';
    
    // Application Type Specific
    $renewal_reason = $_POST['renewal_reason'] ?? '';
    $amendment_type = $_POST['amendment_type'] ?? '';
    $amendment_details = $_POST['amendment_details'] ?? '';
    $amendment_reason = $_POST['amendment_reason'] ?? '';
    
    // Declaration
    $applicant_signature = $_POST['applicant_signature'] ?? '';
    $declaration_agreed = isset($_POST['declaration_agreed']) ? (int)$_POST['declaration_agreed'] : 0;
    $date_submitted = $_POST['date_submitted'] ?? date('Y-m-d');
    $time_submitted = $_POST['time_submitted'] ?? date('H:i:s');
    $status = $_POST['status'] ?? 'PENDING';
    $permit_type = $_POST['permit_type'] ?? 'LIQUOR';
    
    // Validate required fields
    if (empty($applicant_id)) {
        throw new Exception('Applicant ID is required');
    }
    
    if (empty($business_name)) {
        throw new Exception('Business name is required');
    }
    
    if (empty($owner_first_name) || empty($owner_last_name)) {
        throw new Exception('Owner name is required');
    }
    
    if (empty($date_of_birth)) {
        throw new Exception('Date of birth is required');
    }
    
    // Calculate age - must be 18+
    $birthDate = new DateTime($date_of_birth);
    $today = new DateTime();
    $age = $today->diff($birthDate)->y;
    
    if ($age < 18) {
        throw new Exception('Applicant must be 18 years or older');
    }
    
    // Handle file uploads
    $upload_dir = __DIR__ . '/uploads/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $uploaded_files = [];
    $allowed_extensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
    $max_file_size = 10 * 1024 * 1024; // 10MB
    
    $file_fields = [
        'barangay_clearance_id_copy',
        'owner_valid_id',
        'renewal_permit_copy',
        'previous_permit_copy'
    ];
    
    foreach ($file_fields as $field) {
        if (isset($_FILES[$field]) && $_FILES[$field]['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES[$field];
            $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            
            // Validate file extension
            if (!in_array($file_extension, $allowed_extensions)) {
                throw new Exception("Invalid file type for $field. Allowed: " . implode(', ', $allowed_extensions));
            }
            
            // Validate file size
            if ($file['size'] > $max_file_size) {
                throw new Exception("File $field is too large. Maximum size: 10MB");
            }
            
            // Generate unique filename
            $unique_name = uniqid($applicant_id . '_' . $field . '_', true) . '.' . $file_extension;
            $file_path = $upload_dir . $unique_name;
            
            // Move uploaded file
            if (move_uploaded_file($file['tmp_name'], $file_path)) {
                $uploaded_files[$field] = 'uploads/' . $unique_name;
            } else {
                throw new Exception("Failed to upload file: $field");
            }
        }
    }
    
    // Insert into database
    $stmt = $conn->prepare("
        INSERT INTO liquor_permit_applications (
            applicant_id, application_type, existing_permit_number,
            business_name, business_address, business_email, business_phone, 
            business_type, business_nature,
            owner_first_name, owner_last_name, owner_middle_name, owner_address,
            id_type, id_number, date_of_birth, citizenship,
            barangay_clearance_id, barangay_clearance_id_copy,
            owner_valid_id, renewal_permit_copy, previous_permit_copy,
            renewal_reason, amendment_type, amendment_details, amendment_reason,
            applicant_signature, declaration_agreed,
            date_submitted, time_submitted, status, permit_type,
            created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
        )
    ");
    
    if (!$stmt) {
        throw new Exception('Database prepare failed: ' . $conn->error);
    }
    
    $barangay_clearance_id_copy = $uploaded_files['barangay_clearance_id_copy'] ?? null;
    $owner_valid_id_file = $uploaded_files['owner_valid_id'] ?? null;
    $renewal_permit_copy_file = $uploaded_files['renewal_permit_copy'] ?? null;
    $previous_permit_copy_file = $uploaded_files['previous_permit_copy'] ?? null;
    
    $stmt->bind_param(
        "sssssssssssssssssssssssssssssss",
        $applicant_id, $application_type, $existing_permit_number,
        $business_name, $business_address, $business_email, $business_phone,
        $business_type, $business_nature,
        $owner_first_name, $owner_last_name, $owner_middle_name, $owner_address,
        $id_type, $id_number, $date_of_birth, $citizenship,
        $barangay_clearance_id, $barangay_clearance_id_copy,
        $owner_valid_id_file, $renewal_permit_copy_file, $previous_permit_copy_file,
        $renewal_reason, $amendment_type, $amendment_details, $amendment_reason,
        $applicant_signature, $declaration_agreed,
        $date_submitted, $time_submitted, $status, $permit_type
    );
    
    if ($stmt->execute()) {
        $permit_id = $conn->insert_id;
        
        $response['success'] = true;
        $response['message'] = 'Liquor permit application submitted successfully!';
        $response['data'] = [
            'permit_id' => $permit_id,
            'applicant_id' => $applicant_id,
            'application_type' => $application_type,
            'business_name' => $business_name,
            'status' => $status
        ];
    } else {
        throw new Exception('Failed to insert application: ' . $stmt->error);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
    error_log("Liquor Permit Submission Error: " . $e->getMessage());
}

$conn->close();
echo json_encode($response);
?>
