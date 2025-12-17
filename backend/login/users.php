<?php
session_start();
require_once __DIR__ . '/db.php';

$allowedOrigins = [
    'http://localhost',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header("Access-Control-Allow-Origin: http://localhost");
}
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// --------------------- INPUT ---------------------
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents("php://input"), true) ?? [];

// --------------------- REGISTER ---------------------
if ($action === 'register') {
    $email = $conn->real_escape_string($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $firstName = $conn->real_escape_string($input['firstName'] ?? '');
    $lastName = $conn->real_escape_string($input['lastName'] ?? '');
    $middleName = $conn->real_escape_string($input['middleName'] ?? '');
    $suffix = $conn->real_escape_string($input['suffix'] ?? '');
    $birthdate = $input['birthdate'] ?? null;
    $mobile = $conn->real_escape_string($input['mobile_number'] ?? '');
    $houseNumber = $conn->real_escape_string($input['house_number'] ?? '');
    $street = $conn->real_escape_string($input['street'] ?? '');
    $barangay = $conn->real_escape_string($input['barangay'] ?? '');
    $city = $conn->real_escape_string($input['city_municipality'] ?? 'Default City');
    $province = $conn->real_escape_string($input['province'] ?? 'Default Province');
    $region = $conn->real_escape_string($input['region'] ?? 'Default Region');
    $zip = $conn->real_escape_string($input['zip_code'] ?? null);

    // Check if email exists
    $check = $conn->query("SELECT id FROM users WHERE email='$email'");
    if ($check->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit;
    }

    // Insert user
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $conn->query("INSERT INTO users (email, password_hash, status) VALUES ('$email', '$passwordHash', 'active')");
    $userId = $conn->insert_id;

    // Insert profile
    $conn->query("INSERT INTO user_profiles (user_id, first_name, last_name, middle_name, suffix, birthdate, mobile_number)
                  VALUES ('$userId', '$firstName', '$lastName', '$middleName', '$suffix', '$birthdate', '$mobile')");

    // Insert address
    $conn->query("INSERT INTO user_addresses (user_id, house_number, street, barangay, city_municipality, province, region, zip_code)
                  VALUES ('$userId', '$houseNumber', '$street', '$barangay', '$city', '$province', '$region', '$zip')");

    // Set session variables after successful registration
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_logged_in'] = true;

    echo json_encode(['success' => true, 'message' => 'Registration successful', 'user_id' => $userId]);
    exit;
}

// --------------------- LOGIN ---------------------
if ($action === 'login') {
    $email = $conn->real_escape_string($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Email and password required']);
        exit;
    }

    // Fetch user
    $result = $conn->query("SELECT id, password_hash, status FROM users WHERE email='$email'");
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    $user = $result->fetch_assoc();
    if ($user['status'] !== 'active') {
        echo json_encode(['success' => false, 'message' => 'Account not active']);
        exit;
    }

    // Verify password
    if (!password_verify($password, $user['password_hash'])) {
        echo json_encode(['success' => false, 'message' => 'Incorrect password']);
        exit;
    }

    // Generate session token
    $token = bin2hex(random_bytes(16));
    $conn->query("INSERT INTO login_sessions (user_id, session_token, expires_at) 
                  VALUES ('{$user['id']}', '$token', DATE_ADD(NOW(), INTERVAL 1 HOUR))");

    echo json_encode(['success' => true, 'message' => 'Login successful', 'token' => $token]);
    exit;
}

// --------------------- INVALID ACTION ---------------------
echo json_encode(['success' => false, 'message' => 'Invalid action']);
exit;
