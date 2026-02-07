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

$response = ['success' => false, 'message' => '', 'data' => []];

try {
    $status = $_GET['status'] ?? null;
    $search = $_GET['search'] ?? '';
    $sort_by = $_GET['sort_by'] ?? 'latest';
    
    // Build query
    $query = "SELECT * FROM liquor_permit_applications WHERE 1=1";
    $params = [];
    $types = '';
    
    // Filter by status
    if ($status && $status !== 'ALL') {
        $query .= " AND status = ?";
        $params[] = $status;
        $types .= 's';
    }
    
    // Search filter
    if (!empty($search)) {
        $query .= " AND (
            business_name LIKE ? OR 
            owner_first_name LIKE ? OR 
            owner_last_name LIKE ? OR
            applicant_id LIKE ? OR
            permit_id LIKE ?
        )";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types .= 'sssss';
    }
    
    // Sort
    switch ($sort_by) {
        case 'oldest':
            $query .= " ORDER BY date_submitted ASC, created_at ASC";
            break;
        case 'name_asc':
            $query .= " ORDER BY owner_last_name ASC, owner_first_name ASC";
            break;
        case 'name_desc':
            $query .= " ORDER BY owner_last_name DESC, owner_first_name DESC";
            break;
        case 'business_name_asc':
            $query .= " ORDER BY business_name ASC";
            break;
        default: // latest
            $query .= " ORDER BY date_submitted DESC, created_at DESC";
            break;
    }
    
    // Execute query
    if (!empty($params)) {
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query($query);
    }
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    // Get counts
    $counts = [
        'total' => 0,
        'pending' => 0,
        'approved' => 0,
        'rejected' => 0
    ];
    
    $countResult = $conn->query("SELECT status, COUNT(*) as count FROM liquor_permit_applications GROUP BY status");
    while ($row = $countResult->fetch_assoc()) {
        $counts['total'] += (int)$row['count'];
        $statusLower = strtolower($row['status']);
        if (isset($counts[$statusLower])) {
            $counts[$statusLower] = (int)$row['count'];
        }
    }
    
    $response['success'] = true;
    $response['message'] = 'Data fetched successfully';
    $response['data'] = $data;
    $response['counts'] = $counts;
    
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
    error_log("Liquor Permit Admin Fetch Error: " . $e->getMessage());
}

$conn->close();
echo json_encode($response);
?>
