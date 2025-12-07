<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ob_start();

// ✅ Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ --- Database Connection ---
$targetDb = 'eplms_barangay_permit_db';
include '../../connection.php';

// Check if connection is successful
if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// ✅ --- Helper Function ---
function sanitize($data) {
    if ($data === null || $data === '') return '';
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// ✅ --- Upload Folder ---
$uploadDir = __DIR__ . "/uploads/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// ✅ --- Debug: Log received data ---
error_log("=== BARANGAY PERMIT FORM DATA RECEIVED ===");
error_log("POST data: " . print_r($_POST, true));
error_log("FILES data: " . print_r($_FILES, true));

// ✅ --- Allowed File Fields ---
$fileFields = [
    'valid_id_file',
    'proof_of_residence_file',
    'receipt_file',
    'signature_file',
    'photo_fingerprint_file'
];

$uploadedFiles = [];
foreach ($fileFields as $f) {
    if (isset($_FILES[$f]) && $_FILES[$f]['error'] === UPLOAD_ERR_OK) {
        $fileTmp = $_FILES[$f]['tmp_name'];
        $fileName = time() . "_" . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($_FILES[$f]['name']));

        // ✅ Validate file type
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
        $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExtensions)) {
            echo json_encode(["success" => false, "message" => "Invalid file type for $f. Allowed: jpg, jpeg, png, pdf, doc, docx"]);
            exit();
        }

        // ✅ Validate file size (5MB max)
        if ($_FILES[$f]['size'] > 5 * 1024 * 1024) {
            echo json_encode(["success" => false, "message" => "File too large for $f. Maximum size is 5MB"]);
            exit();
        }

        // ✅ Move file to uploads folder
        if (move_uploaded_file($fileTmp, $uploadDir . $fileName)) {
            $uploadedFiles[$f] = $fileName;
        } else {
            error_log("Failed to move uploaded file: $fileName");
        }
    }
}

// ✅ --- Process Form Fields ---
$formData = [];

// Process all POST fields
foreach ($_POST as $key => $val) {
    if ($val === '1' || $val === '0') {
        $formData[$key] = intval($val);
    } else if ($val === 'true' || $val === 'false') {
        $formData[$key] = $val === 'true' ? 1 : 0;
    } else {
        $formData[$key] = sanitize($val);
    }
}

// ✅ Set default values for missing fields
$defaults = [
    'application_date' => date('Y-m-d'),
    'status' => 'pending',
    'clearance_fee' => 0.00,
    'receipt_number' => '',
    'applicant_signature' => '',
    'middle_name' => '',
    'suffix' => '',
    'email' => '',
    'zip_code' => '',
    'duration' => ''
];

foreach ($defaults as $key => $value) {
    if (!isset($formData[$key]) || $formData[$key] === '') {
        $formData[$key] = $value;
    }
}

// ✅ Handle user_id separately (must be integer)
$formData['user_id'] = isset($formData['user_id']) && $formData['user_id'] !== '' 
    ? intval($formData['user_id']) 
    : 0;

// ✅ Build attachments JSON from uploaded files
$attachments = [];
foreach ($fileFields as $field) {
    if (isset($uploadedFiles[$field])) {
        $attachments[$field] = $uploadedFiles[$field];
    } else {
        $attachments[$field] = '';
    }
}
$formData['attachments'] = json_encode($attachments, JSON_UNESCAPED_SLASHES);

// ✅ Set applicant_signature from signature_file if available
if (isset($uploadedFiles['signature_file'])) {
    $formData['applicant_signature'] = $uploadedFiles['signature_file'];
}

// ✅ --- Debug: Log processed data ---
error_log("Processed form data: " . print_r($formData, true));

// ✅ --- Insert Into Database ---
$table = "barangay_permit";

// Prepare SQL query with all required fields
$sql = "INSERT INTO $table SET 
        user_id = ?,
        application_date = ?,
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        suffix = ?,
        birthdate = ?,
        mobile_number = ?,
        email = ?,
        gender = ?,
        civil_status = ?,
        nationality = ?,
        house_no = ?,
        street = ?,
        barangay = ?,
        city_municipality = ?,
        province = ?,
        zip_code = ?,
        purpose = ?,
        duration = ?,
        id_type = ?,
        id_number = ?,
        attachments = ?,
        clearance_fee = ?,
        receipt_number = ?,
        applicant_signature = ?,
        status = ?,
        created_at = NOW(),
        updated_at = NOW()";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Database prepare error: " . $conn->error);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $conn->error
    ]);
    exit();
}

// Bind parameters
$stmt->bind_param(
    "isssssssssssssssssssssssdsss",
    $formData['user_id'],
    $formData['application_date'],
    $formData['first_name'],
    $formData['middle_name'],
    $formData['last_name'],
    $formData['suffix'],
    $formData['birthdate'],
    $formData['mobile_number'],
    $formData['email'],
    $formData['gender'],
    $formData['civil_status'],
    $formData['nationality'],
    $formData['house_no'],
    $formData['street'],
    $formData['barangay'],
    $formData['city_municipality'],
    $formData['province'],
    $formData['zip_code'],
    $formData['purpose'],
    $formData['duration'],
    $formData['id_type'],
    $formData['id_number'],
    $formData['attachments'],
    $formData['clearance_fee'],
    $formData['receipt_number'],
    $formData['applicant_signature'],
    $formData['status']
);

if ($stmt->execute()) {
    $permit_id = $stmt->insert_id;
    $reference_number = "BRGY-CLR-" . date('Ymd') . "-" . str_pad($permit_id, 6, '0', STR_PAD_LEFT);
    
    echo json_encode([
        "success" => true,
        "message" => "Barangay clearance application submitted successfully.",
        "permit_id" => $permit_id,
        "reference_number" => $reference_number
    ]);
} else {
    error_log("Database execute error: " . $stmt->error);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
ob_end_flush();
exit;
?>
