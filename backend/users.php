<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents("php://input"), true);

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

    // Check if email already exists
    $check = $conn->query("SELECT id FROM users WHERE email='$email'");
    if ($check->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit;
    }

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Insert into users table
    $conn->query("INSERT INTO users (email, password_hash, status) VALUES ('$email', '$passwordHash', 'active')");
    $userId = $conn->insert_id;

    // Insert into user_profiles table
    $conn->query("INSERT INTO user_profiles (user_id, first_name, last_name, middle_name, suffix, birthdate, mobile_number)
                  VALUES ('$userId', '$firstName', '$lastName', '$middleName', '$suffix', '$birthdate', '$mobile')");

    // Insert into user_addresses table
    $conn->query("INSERT INTO user_addresses (user_id, house_number, street, barangay, city_municipality, province, region, zip_code)
                  VALUES ('$userId', '$houseNumber', '$street', '$barangay', '$city', '$province', '$region', '$zip')");

    echo json_encode(['success' => true, 'message' => 'Registration successful']);
    exit;
}

// --------------------- LOGIN ---------------------
if ($action === 'login') {

    $email = $conn->real_escape_string($input['email'] ?? '');
    $password = $input['password'] ?? '';

    // Find user by email
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

    if (password_verify($password, $user['password_hash'])) {
        // Generate a simple token
        $token = bin2hex(random_bytes(16));

        // Optional: store in login_sessions
        $conn->query("INSERT INTO login_sessions (user_id, session_token, expires_at) 
                      VALUES ('{$user['id']}', '$token', DATE_ADD(NOW(), INTERVAL 1 HOUR))");

        echo json_encode(['success' => true, 'message' => 'Login successful', 'token' => $token]);
        exit;
    } else {
        echo json_encode(['success' => false, 'message' => 'Incorrect password']);
        exit;
    }
}

// --------------------- INVALID ACTION ---------------------
echo json_encode(['success' => false, 'message' => 'Invalid action']);
exit;
