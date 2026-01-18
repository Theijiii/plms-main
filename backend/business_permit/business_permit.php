<?php
session_start();


$allowedOrigins = [
    'http://localhost',
    'https://e-plms.goserveph.com/'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header("Access-Control-Allow-Origin: https://e-plms.goserveph.com/");
}
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
require_once __DIR__ . '/db.php';
$uploadDir = __DIR__ . '/uploads/';
$allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
$maxFileSize = 10 * 1024 * 1024; // 10MB

// Create uploads directory if it doesn't exist
if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        error_log("Failed to create upload directory: $uploadDir");
    }
}

// Database Connection
if ($conn->connect_error) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

function saveDocumentFile($conn, $permitId, $fileField, $documentType, $uploadDir) {
    global $allowedTypes, $maxFileSize;
    
    if (!isset($_FILES[$fileField]) || $_FILES[$fileField]['error'] !== UPLOAD_ERR_OK) {
        error_log("No file uploaded or upload error for $fileField");
        return false;
    }
    
    $file = $_FILES[$fileField];
    
    // Debug log
    error_log("Processing $documentType:");
    error_log("  - Original name: " . $file['name']);
    error_log("  - Browser MIME type: " . $file['type']);
    error_log("  - Size: " . $file['size']);
    
    // Get file extension
    $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    error_log("  - Extension: $fileExt");
    
    // Allowed extensions (more comprehensive)
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
    $allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/jpg',
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    // Check file extension
    if (!in_array($fileExt, $allowedExtensions)) {
        $errorMsg = "Invalid file extension for $documentType. Allowed: " . implode(', ', $allowedExtensions);
        error_log("  - ERROR: $errorMsg");

    }
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $actualMimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    error_log("  - Actual MIME type: $actualMimeType");
    
    if (!in_array($actualMimeType, $allowedMimeTypes)) {
        $errorMsg = "Invalid file type for $documentType. Got: $actualMimeType";
        error_log("  - WARNING: $errorMsg");
        // Uncomment to block uploads with wrong MIME types:
        // throw new Exception($errorMsg);
    }
    
    // Validate file size
    if ($file['size'] > $maxFileSize) {
        $errorMsg = "File $documentType is too large. Maximum size: 10MB";
        error_log("  - ERROR: $errorMsg");
        throw new Exception($errorMsg);
    }
    
    // Validate file is actually uploaded
    if (!is_uploaded_file($file['tmp_name'])) {
        $errorMsg = "Potential file upload attack for $documentType";
        error_log("  - ERROR: $errorMsg");
        throw new Exception($errorMsg);
    }
    
    // Generate unique filename
    $fileName = 'DOC_' . $permitId . '_' . $documentType . '_' . time() . '.' . $fileExt;
    $filePath = $uploadDir . $fileName;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        error_log("Failed to move uploaded file: $fileField to $filePath");
        // Check directory permissions
        if (!is_writable($uploadDir)) {
            error_log("Upload directory is not writable: $uploadDir");
        }
        return false;
    }
    
    error_log("  - Saved to: $filePath");
    
    // Prepare document data for insertion
    $docName = $_POST[$fileField . '_name'] ?? $file['name'];
    $docType = $documentType;
    $relativePath = 'uploads/' . $fileName;
    $fileType = $actualMimeType;
    $fileSize = $file['size'];
    
    // Insert into application_documents table
    $docSql = "INSERT INTO application_documents 
               (permit_id, document_type, document_name, file_path, file_type, file_size) 
               VALUES (?, ?, ?, ?, ?, ?)";
    
    $docStmt = $conn->prepare($docSql);
    if (!$docStmt) {
        error_log("Failed to prepare document statement: " . $conn->error);
        return false;
    }
    
    $docStmt->bind_param("issssi", $permitId, $docType, $docName, $relativePath, $fileType, $fileSize);
    
    if (!$docStmt->execute()) {
        error_log("Failed to insert document record: " . $docStmt->error);
        $docStmt->close();
        return false;
    }
    
    $docId = $conn->insert_id;
    error_log("  - Document saved to DB with ID: $docId");
    
    $docStmt->close();
    return true;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Method not allowed. Use POST.');
    }
    
    // Get POST data
    $postData = $_POST;
    
    // Debug log
    error_log("=== BUSINESS PERMIT SUBMISSION START ===");
    error_log("POST keys received: " . implode(', ', array_keys($postData)));
    error_log("FILES keys received: " . implode(', ', array_keys($_FILES)));
    
    // Generate IDs
    $applicant_id = 'BUS' . date('Y') . mt_rand(100, 999);
    $application_date = date('Y-m-d');
    $status = 'PENDING';
    
    // Map form fields to database columns
    $fieldMap = [
        // Personal Information
        'last_name' => ['db' => 'owner_last_name', 'type' => 's'],
        'first_name' => ['db' => 'owner_first_name', 'type' => 's'],
        'middle_name' => ['db' => 'owner_middle_name', 'type' => 's'],
        'owner_type' => ['db' => 'owner_type', 'type' => 's'],
        'citizenship' => ['db' => 'citizenship', 'type' => 's'],
        'corp_filipino_percent' => ['db' => 'corp_filipino_percent', 'type' => 'd'],
        'corp_foreign_percent' => ['db' => 'corp_foreign_percent', 'type' => 'd'],
        'date_of_birth' => ['db' => 'date_of_birth', 'type' => 's'],
        'contact_number' => ['db' => 'contact_number', 'type' => 's'],
        'email_address' => ['db' => 'email_address', 'type' => 's'],
        'home_address' => ['db' => 'home_address', 'type' => 's'],
        'valid_id_type' => ['db' => 'valid_id_type', 'type' => 's'],
        'valid_id_number' => ['db' => 'valid_id_number', 'type' => 's'],
        
        // Business Information
        'business_name' => ['db' => 'business_name', 'type' => 's'],
        'trade_name' => ['db' => 'trade_name', 'type' => 's'],
        'business_nature' => ['db' => 'business_nature', 'type' => 's'],
        'building_type' => ['db' => 'building_type', 'type' => 's'],
        'capital_investment' => ['db' => 'capital_investment', 'type' => 'd'],
        
        // Business Address
        'house_bldg_no' => ['db' => 'house_bldg_no', 'type' => 's'],
        'building_name' => ['db' => 'building_name', 'type' => 's'],
        'block_no' => ['db' => 'block_no', 'type' => 's'],
        'lot_no' => ['db' => 'lot_no', 'type' => 's'],
        'street' => ['db' => 'street', 'type' => 's'],
        'subdivision' => ['db' => 'subdivision', 'type' => 's'],
        'province' => ['db' => 'province', 'type' => 's'],
        'city_municipality' => ['db' => 'city_municipality', 'type' => 's'],
        'barangay' => ['db' => 'barangay', 'type' => 's'],
        'zip_code' => ['db' => 'zip_code', 'type' => 's'],
        'district' => ['db' => 'district', 'type' => 's'],
        
        // Operations
        'zoning_permit_id' => ['db' => 'zoning_permit_id', 'type' => 's'],
        'sanitation_permit_id' => ['db' => 'sanitation_permit_id', 'type' => 's'],
        'business_area' => ['db' => 'business_area', 'type' => 'd'],
        'total_floor_area' => ['db' => 'total_floor_area', 'type' => 'd'],
        'operation_time_from' => ['db' => 'operation_time_from', 'type' => 's'],
        'operation_time_to' => ['db' => 'operation_time_to', 'type' => 's'],
        'operation_type' => ['db' => 'operation_type', 'type' => 's'],
        'total_employees' => ['db' => 'total_employees', 'type' => 'i'],
        'male_employees' => ['db' => 'male_employees', 'type' => 'i'],
        'female_employees' => ['db' => 'female_employees', 'type' => 'i'],
        'employees_in_qc' => ['db' => 'employees_in_qc', 'type' => 'i'],
        'delivery_van_truck' => ['db' => 'delivery_van_truck', 'type' => 'i'],
        'delivery_motorcycle' => ['db' => 'delivery_motorcycle', 'type' => 'i'],
        'barangay_clearance_id' => ['db' => 'barangay_clearance_id', 'type' => 's'],
        
        // Declaration
        'owner_type_declaration' => ['db' => 'owner_type_declaration', 'type' => 's'],
        'owner_representative_name' => ['db' => 'owner_representative_name', 'type' => 's'],
        'date_submitted' => ['db' => 'date_submitted', 'type' => 's'],
        
        // Boolean flags for document attachments
        'has_barangay_clearance' => ['db' => 'has_barangay_clearance', 'type' => 'i'],
        'has_bir_certificate' => ['db' => 'has_bir_certificate', 'type' => 'i'],
        'has_lease_or_title' => ['db' => 'has_lease_or_title', 'type' => 'i'],
        'has_fsic' => ['db' => 'has_fsic', 'type' => 'i'],
        'has_owner_valid_id' => ['db' => 'has_owner_valid_id', 'type' => 'i'],
        'has_id_picture' => ['db' => 'has_id_picture', 'type' => 'i'],
        'has_official_receipt' => ['db' => 'has_official_receipt', 'type' => 'i'],
        'has_owner_scanned_id' => ['db' => 'has_owner_scanned_id', 'type' => 'i'],
        'has_dti_registration' => ['db' => 'has_dti_registration', 'type' => 'i'],
        'has_sec_registration' => ['db' => 'has_sec_registration', 'type' => 'i'],
        'has_representative_scanned_id' => ['db' => 'has_representative_scanned_id', 'type' => 'i'],
    ];
    
    // Build the SQL dynamically based on what we receive
    $columns = ['applicant_id', 'application_date', 'permit_type', 'status'];
    $placeholders = ['?', '?', '?', '?'];
    $values = [$applicant_id, $application_date, ($postData['permit_type'] ?? 'NEW'), $status];
    $types = 'ssss';
    
    // Add fields that exist in POST data
    foreach ($fieldMap as $formField => $config) {
        if (isset($postData[$formField]) && $postData[$formField] !== '') {
            $columns[] = $config['db'];
            $placeholders[] = '?';
            $values[] = $postData[$formField];
            $types .= $config['type'];
        }
    }
    
    // Add barangay_clearance_status based on barangay_clearance_id
    $barangay_clearance_status = isset($postData['barangay_clearance_id']) && !empty($postData['barangay_clearance_id']) ? 'ID_PROVIDED' : 'PENDING';
    $columns[] = 'barangay_clearance_status';
    $placeholders[] = '?';
    $values[] = $barangay_clearance_status;
    $types .= 's';
    
    // Debug: Log what we're inserting
    error_log("Columns to insert (" . count($columns) . "): " . implode(', ', $columns));
    error_log("Values count: " . count($values));
    error_log("Type string length: " . strlen($types));
    
    // Build SQL
    $sql = "INSERT INTO business_permit_applications (" . 
           implode(', ', $columns) . ") VALUES (" . 
           implode(', ', $placeholders) . ")";
    
    error_log("SQL Query: " . $sql);
    
    // Prepare statement
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error . " | SQL: " . $sql);
    }
    
    // Bind parameters
    if (!empty($values)) {
        $stmt->bind_param($types, ...$values);
    }
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $permit_id = $conn->insert_id;
    
    // Map file fields to document types
    $fileDocumentMap = [
        // File field name => Document type
        'bir_certificate' => 'BIR_CERTIFICATE',
        'lease_or_title' => 'LEASE_TITLE',
        'fsic' => 'FSIC',
        'owner_valid_id' => 'OWNER_VALID_ID',
        'id_picture' => 'ID_PICTURE',
        'official_receipt_file' => 'OFFICIAL_RECEIPT',
        'dti_registration' => 'DTI_REGISTRATION',
        'sec_registration' => 'SEC_REGISTRATION',
        'owner_scanned_id' => 'OWNER_SCANNED_ID',
        'representative_scanned_id' => 'REPRESENTATIVE_SCANNED_ID'
    ];
    
    // Process file uploads and save to documents table
    $uploadedDocuments = [];
    foreach ($fileDocumentMap as $fileField => $documentType) {
        if (isset($_FILES[$fileField]) && $_FILES[$fileField]['error'] === UPLOAD_ERR_OK) {
            if (saveDocumentFile($conn, $permit_id, $fileField, $documentType, $uploadDir)) {
                $uploadedDocuments[] = $documentType;
                error_log("Successfully uploaded and saved document: $documentType");
            }
        }
    }
    
    // Handle barangay clearance separately if needed
    if (isset($_FILES['barangay_clearance']) && $_FILES['barangay_clearance']['error'] === UPLOAD_ERR_OK) {
        if (saveDocumentFile($conn, $permit_id, 'barangay_clearance', 'BARANGAY_CLEARANCE', $uploadDir)) {
            $uploadedDocuments[] = 'BARANGAY_CLEARANCE';
        }
    }
    
    $stmt->close();
    
    ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Business permit application submitted successfully!',
        'permit_id' => $permit_id,
        'applicant_id' => $applicant_id,
        'status' => $status,
        'documents_uploaded' => $uploadedDocuments,
        'debug' => [
            'columns_inserted' => count($columns),
            'values_inserted' => count($values),
            'documents_count' => count($uploadedDocuments)
        ]
    ]);
    
} catch (Exception $e) {
    ob_clean();
    error_log("EXCEPTION: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}

$conn->close();
exit();
?>