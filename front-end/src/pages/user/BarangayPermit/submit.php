<?php
// Include the main connection file
require_once '../../../../../connection.php';

// Set specific headers for this endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    // Get form data
    $permit_type = isset($_POST['permit_type']) ? $conn->real_escape_string($_POST['permit_type']) : 'NEW';
    $application_date = isset($_POST['application_date']) ? $conn->real_escape_string($_POST['application_date']) : date('Y-m-d');
    
    // Applicant Information
    $first_name = $conn->real_escape_string($_POST['first_name'] ?? '');
    $middle_initial = $conn->real_escape_string($_POST['middle_initial'] ?? '');
    $last_name = $conn->real_escape_string($_POST['last_name'] ?? '');
    $suffix = $conn->real_escape_string($_POST['suffix'] ?? '');
    $contact_number = $conn->real_escape_string($_POST['contact_number'] ?? '');
    $email = $conn->real_escape_string($_POST['email'] ?? '');
    $birth_date = $conn->real_escape_string($_POST['birth_date'] ?? '');
    $gender = $conn->real_escape_string($_POST['gender'] ?? '');
    $civil_status = $conn->real_escape_string($_POST['civil_status'] ?? '');
    $nationality = $conn->real_escape_string($_POST['nationality'] ?? '');
    
    // Address Information
    $house_no = $conn->real_escape_string($_POST['house_no'] ?? '');
    $street = $conn->real_escape_string($_POST['street'] ?? '');
    $barangay = $conn->real_escape_string($_POST['barangay'] ?? '');
    $city_municipality = $conn->real_escape_string($_POST['city_municipality'] ?? '');
    $province = $conn->real_escape_string($_POST['province'] ?? '');
    $zip_code = $conn->real_escape_string($_POST['zip_code'] ?? '');
    
    // Clearance Details
    $purpose = $conn->real_escape_string($_POST['purpose'] ?? '');
    $duration = $conn->real_escape_string($_POST['duration'] ?? '');
    $id_type = $conn->real_escape_string($_POST['id_type'] ?? '');
    $id_number = $conn->real_escape_string($_POST['id_number'] ?? '');
    
    // Business Details
    $business_name = $conn->real_escape_string($_POST['business_name'] ?? '');
    $business_address = $conn->real_escape_string($_POST['business_address'] ?? '');
    $nature_of_business = $conn->real_escape_string($_POST['nature_of_business'] ?? '');
    $business_registration_number = $conn->real_escape_string($_POST['business_registration_number'] ?? '');
    
    // Payment Info
    $clearance_fee = isset($_POST['clearance_fee']) ? floatval($_POST['clearance_fee']) : 0;
    $receipt_number = $conn->real_escape_string($_POST['receipt_number'] ?? '');

    // Handle file uploads
    $upload_dir = '../../uploads/barangay-clearance/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $applicant_signature = '';
    $applicant_photo = '';
    $applicant_fingerprint = '';
    $attachments = [];

    // Process file uploads if any
    if (isset($_FILES['applicant_signature']) && $_FILES['applicant_signature']['error'] === UPLOAD_ERR_OK) {
        $file_extension = pathinfo($_FILES['applicant_signature']['name'], PATHINFO_EXTENSION);
        $signature_file = $upload_dir . uniqid() . '_signature.' . $file_extension;
        if (move_uploaded_file($_FILES['applicant_signature']['tmp_name'], $signature_file)) {
            $applicant_signature = $signature_file;
        }
    }

    if (isset($_FILES['applicant_photo']) && $_FILES['applicant_photo']['error'] === UPLOAD_ERR_OK) {
        $file_extension = pathinfo($_FILES['applicant_photo']['name'], PATHINFO_EXTENSION);
        $photo_file = $upload_dir . uniqid() . '_photo.' . $file_extension;
        if (move_uploaded_file($_FILES['applicant_photo']['tmp_name'], $photo_file)) {
            $applicant_photo = $photo_file;
        }
    }

    if (isset($_FILES['applicant_fingerprint']) && $_FILES['applicant_fingerprint']['error'] === UPLOAD_ERR_OK) {
        $file_extension = pathinfo($_FILES['applicant_fingerprint']['name'], PATHINFO_EXTENSION);
        $fingerprint_file = $upload_dir . uniqid() . '_fingerprint.' . $file_extension;
        if (move_uploaded_file($_FILES['applicant_fingerprint']['tmp_name'], $fingerprint_file)) {
            $applicant_fingerprint = $fingerprint_file;
        }
    }

    // Handle multiple attachments
    if (isset($_FILES['attachments'])) {
        foreach ($_FILES['attachments']['tmp_name'] as $key => $tmp_name) {
            if ($_FILES['attachments']['error'][$key] === UPLOAD_ERR_OK) {
                $file_extension = pathinfo($_FILES['attachments']['name'][$key], PATHINFO_EXTENSION);
                $attachment_file = $upload_dir . uniqid() . '_attachment_' . $key . '.' . $file_extension;
                if (move_uploaded_file($tmp_name, $attachment_file)) {
                    $attachments[] = $attachment_file;
                }
            }
        }
    }

    // Convert attachments array to JSON for storage
    $attachments_json = !empty($attachments) ? json_encode($attachments) : '[]';

    // Basic validation
    $required_fields = [
        'first_name' => 'First name',
        'last_name' => 'Last name',
        'contact_number' => 'Contact number',
        'birth_date' => 'Birth date',
        'gender' => 'Gender',
        'civil_status' => 'Civil status',
        'nationality' => 'Nationality',
        'house_no' => 'House number',
        'street' => 'Street',
        'barangay' => 'Barangay',
        'city_municipality' => 'City/Municipality',
        'province' => 'Province',
        'purpose' => 'Purpose',
        'id_type' => 'ID type',
        'id_number' => 'ID number'
    ];

    $missing_fields = [];
    foreach ($required_fields as $field => $label) {
        if (empty($$field)) {
            $missing_fields[] = $label;
        }
    }

    if (!empty($missing_fields)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please fill in all required fields: ' . implode(', ', $missing_fields)
        ]);
        exit();
    }

    // Validate email format if provided
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please provide a valid email address'
        ]);
        exit();
    }

    // Insert into database
    $sql = "INSERT INTO barangay_clearance_applications (
        permit_type, application_date, first_name, middle_initial, last_name, suffix,
        contact_number, email, birth_date, gender, civil_status, nationality,
        house_no, street, barangay, city_municipality, province, zip_code,
        purpose, duration, id_type, id_number, business_name, business_address,
        nature_of_business, business_registration_number, clearance_fee, receipt_number,
        applicant_signature, applicant_photo, applicant_fingerprint, attachments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $stmt->bind_param(
        "ssssssssssssssssssssssssssdsssss",
        $permit_type, $application_date, $first_name, $middle_initial, $last_name, $suffix,
        $contact_number, $email, $birth_date, $gender, $civil_status, $nationality,
        $house_no, $street, $barangay, $city_municipality, $province, $zip_code,
        $purpose, $duration, $id_type, $id_number, $business_name, $business_address,
        $nature_of_business, $business_registration_number, $clearance_fee, $receipt_number,
        $applicant_signature, $applicant_photo, $applicant_fingerprint, $attachments_json
    );

    if ($stmt->execute()) {
        $application_id = $stmt->insert_id;
        
        echo json_encode([
            'success' => true,
            'message' => 'Barangay Clearance application submitted successfully!',
            'application_id' => $application_id,
            'data' => [
                'name' => trim("$first_name $middle_initial $last_name $suffix"),
                'application_date' => $application_date,
                'reference_number' => 'BC-' . str_pad($application_id, 6, '0', STR_PAD_LEFT)
            ]
        ]);
    } else {
        throw new Exception('Execute failed: ' . $stmt->error);
    }

    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error submitting application: ' . $e->getMessage()
    ]);
}

// Note: The connection will be closed automatically when the script ends
?>