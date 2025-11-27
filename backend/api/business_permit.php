<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ob_start();

// ✅ Show errors for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ❌ --- Removed all CORS Configuration ---

// ✅ --- Database ---
$targetDb = 'business_permit_system';
include '../../connection.php';

if (!isset($databases[$targetDb])) {
    echo json_encode(["success" => false, "message" => "Database config not found for $targetDb"]);
    exit;
}

$host = "localhost";
$user = $databases[$targetDb];
$password = "mypassword";
$dbname = $targetDb;

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB Connection failed: " . $conn->connect_error]);
    exit;
}

// --- Helper Functions ---
function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function handleFileUpload($fileField, $uploadDir) {
    if (isset($_FILES[$fileField]) && $_FILES[$fileField]['error'] === UPLOAD_ERR_OK) {
        $fileTmp = $_FILES[$fileField]['tmp_name'];
        $fileName = time() . "_" . basename($_FILES[$fileField]['name']);
        if (move_uploaded_file($fileTmp, $uploadDir . $fileName)) {
            return $fileName;
        }
    }
    return null;
}

// --- Upload folder ---
$uploadDir = __DIR__ . "/uploads/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// --- File upload handling ---
$fileFields = [
    'owner_valid_id_file', 'id_picture', 'owner_scanned_id',
    'barangay_clearance', 'registration_doc', 'bir_certificate',
    'lease_or_title', 'fsic', 'sanitary_permit', 'zoning_clearance',
    'occupancy_permit', 'official_receipt_file'
];

$uploadedFiles = [];
foreach ($fileFields as $field) {
    $uploadedFile = handleFileUpload($field, $uploadDir);
    if ($uploadedFile) {
        $uploadedFiles[$field] = $uploadedFile;
    }
}

// --- Process form fields ---
$formData = [];
foreach ($_POST as $key => $val) {
    if ($val === 'true' || $val === 'false') {
        $formData[$key] = $val === 'true' ? 1 : 0;
    } elseif (is_numeric($val)) {
        $formData[$key] = $val;
    } elseif ($val === '') {
        $formData[$key] = null;
    } else {
        $formData[$key] = sanitize($val);
    }
}

// Handle operation times with AM/PM
if (!empty($formData['operation_from_time']) && !empty($formData['operation_from_ampm'])) {
    $formData['operation_from_time'] = $formData['operation_from_time'] . ' ' . $formData['operation_from_ampm'];
}
if (!empty($formData['operation_to_time']) && !empty($formData['operation_to_ampm'])) {
    $formData['operation_to_time'] = $formData['operation_to_time'] . ' ' . $formData['operation_to_ampm'];
}

// Add uploaded files to form data
foreach ($uploadedFiles as $key => $filename) {
    $formData[$key] = $filename;
}

// Timestamps
$formData['date_submitted'] = date('Y-m-d H:i:s');
$formData['date_updated'] = date('Y-m-d H:i:s');

// --- Insert into database ---
$table = "business_permits";

// Generate columns and placeholders
$columns = array_keys($formData);
$placeholders = array_fill(0, count($columns), '?');
$values = array_values($formData);

$sql = "INSERT INTO $table (" . implode(",", $columns) . ") VALUES (" . implode(",", $placeholders) . ")";

try {
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // Bind parameters
    $types = '';
    $params = [];
    foreach ($values as $value) {
        if (is_int($value)) $types .= 'i';
        elseif (is_float($value)) $types .= 'd';
        else $types .= 's';
        $params[] = $value;
    }

    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        $applicationId = $conn->insert_id;
        echo json_encode([
            "success" => true,
            "message" => "Business permit application submitted successfully.",
            "application_id" => $applicationId
        ]);
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    error_log("Business Permit Submission Error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Submission failed: " . $e->getMessage()
    ]);
}

$conn->close();
ob_end_flush();
exit;
?>
