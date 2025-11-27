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
$targetDb = 'eplms_franchise_applications';
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
error_log("=== FORM DATA RECEIVED ===");
error_log("POST data: " . print_r($_POST, true));
error_log("FILES data: " . print_r($_FILES, true));

// ✅ --- Allowed File Fields ---
$fileFields = [
    'proof_of_residency', 'barangay_clearance', 'toda_endorsement', 'lto_or_cr',
    'insurance_certificate', 'drivers_license', 'emission_test', 'id_picture',
    'official_receipt', 'affidavit_of_ownership', 'police_clearance',
    'tricycle_body_number_picture', 'toda_president_cert',
    'franchise_fee_receipt', 'sticker_id_fee_receipt', 'inspection_fee_receipt'
];

$uploadedFiles = [];
foreach ($fileFields as $f) {
    if (isset($_FILES[$f]) && $_FILES[$f]['error'] === UPLOAD_ERR_OK) {
        $fileTmp = $_FILES[$f]['tmp_name'];
        $fileName = time() . "_" . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($_FILES[$f]['name']));

        // ✅ Validate file type
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
        $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExtensions)) {
            echo json_encode(["success" => false, "message" => "Invalid file type for $f"]);
            exit();
        }

        // ✅ Move file to uploads folder
        if (move_uploaded_file($fileTmp, $uploadDir . $fileName)) {
            $uploadedFiles[$f] = $fileName;
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

// ✅ Add uploaded file data as JSON
if (!empty($uploadedFiles)) {
    $formData['file_attachments'] = json_encode($uploadedFiles, JSON_UNESCAPED_SLASHES);
} else {
    $formData['file_attachments'] = '[]';
}

// ✅ Add submission date if missing
if (empty($formData['date_submitted'])) {
    $formData['date_submitted'] = date("Y-m-d H:i:s");
}

// ✅ Remove any unused fields
unset($formData['attachments']);

// ✅ --- Debug: Log processed data ---
error_log("Processed form data: " . print_r($formData, true));

// ✅ --- Insert Into Database ---
$table = "franchise_applications";

// Build the SQL query safely
$columns = [];
$values = [];
$placeholders = [];

foreach ($formData as $key => $value) {
    $columns[] = "`$key`";
    $values[] = $conn->real_escape_string($value);
    $placeholders[] = "'" . $conn->real_escape_string($value) . "'";
}

$columnsStr = implode(", ", $columns);
$valuesStr = implode(", ", $placeholders);

$sql = "INSERT INTO $table ($columnsStr) VALUES ($valuesStr)";

error_log("SQL Query: " . $sql);

if ($conn->query($sql)) {
    $application_id = $conn->insert_id;
    echo json_encode([
        "success" => true, 
        "message" => "Application submitted successfully.",
        "application_id" => $application_id
    ]);
} else {
    error_log("Database error: " . $conn->error);
    echo json_encode([
        "success" => false, 
        "message" => "Database error: " . $conn->error,
        "sql_error" => $conn->error
    ]);
}

// ✅ Close connection
$conn->close();
ob_end_flush();
exit;
?>
