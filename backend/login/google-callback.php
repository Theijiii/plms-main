<?php
session_start([
    'cookie_lifetime' => 86400,
    'read_and_close'  => false,
]);

require_once __DIR__ . '/db.php';

// --------------------- CORS ---------------------
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://e-plms.goserveph.com'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// --------------------- GOOGLE OAUTH CONFIG ---------------------
// Load from environment variables or config file
$clientId = getenv('GOOGLE_CLIENT_ID') ?: '';
$clientSecret = getenv('GOOGLE_CLIENT_SECRET') ?: '';
$redirectUri = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . "/auth/google/callback";

// Fallback to config file if environment variables not set
if (empty($clientId) || empty($clientSecret)) {
    $configFile = __DIR__ . '/google-config.php';
    if (file_exists($configFile)) {
        require_once $configFile;
    }
}

// --------------------- HANDLE CALLBACK ---------------------
$input = json_decode(file_get_contents("php://input"), true) ?? [];
$code = $input['code'] ?? $_GET['code'] ?? '';

if (empty($code)) {
    echo json_encode(['success' => false, 'message' => 'No authorization code provided']);
    exit;
}

try {
    // Exchange authorization code for access token
    $tokenUrl = 'https://oauth2.googleapis.com/token';
    $tokenData = [
        'code' => $code,
        'client_id' => $clientId,
        'client_secret' => $clientSecret,
        'redirect_uri' => $redirectUri,
        'grant_type' => 'authorization_code'
    ];

    $ch = curl_init($tokenUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($tokenData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
    
    $tokenResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        error_log("Google token exchange failed: " . $tokenResponse);
        echo json_encode(['success' => false, 'message' => 'Failed to exchange authorization code']);
        exit;
    }

    $tokenData = json_decode($tokenResponse, true);
    $accessToken = $tokenData['access_token'] ?? null;

    if (!$accessToken) {
        echo json_encode(['success' => false, 'message' => 'No access token received']);
        exit;
    }

    // Get user info from Google
    $userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    $ch = curl_init($userInfoUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $accessToken"]);
    
    $userInfoResponse = curl_exec($ch);
    curl_close($ch);

    $userInfo = json_decode($userInfoResponse, true);
    
    if (!isset($userInfo['email'])) {
        echo json_encode(['success' => false, 'message' => 'Failed to retrieve user information']);
        exit;
    }

    $email = $conn->real_escape_string($userInfo['email']);
    $googleId = $conn->real_escape_string($userInfo['id'] ?? '');
    $firstName = $conn->real_escape_string($userInfo['given_name'] ?? '');
    $lastName = $conn->real_escape_string($userInfo['family_name'] ?? '');
    $picture = $conn->real_escape_string($userInfo['picture'] ?? '');

    // Check if user exists
    $stmt = $conn->prepare("SELECT id, status FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if ($user) {
        // User exists - log them in
        $userId = $user['id'];
        
        if ($user['status'] !== 'active') {
            // Activate Google users automatically
            $conn->query("UPDATE users SET status = 'active' WHERE id = '$userId'");
        }

        // Update Google ID if not set
        $conn->query("UPDATE users SET google_id = '$googleId' WHERE id = '$userId' AND (google_id IS NULL OR google_id = '')");

    } else {
        // User doesn't exist - register them
        
        // Generate a random password for Google users (they won't use it)
        $randomPassword = bin2hex(random_bytes(16));
        $passwordHash = password_hash($randomPassword, PASSWORD_DEFAULT);
        
        // Insert user
        $stmt = $conn->prepare("INSERT INTO users (email, password_hash, google_id, status) VALUES (?, ?, ?, 'active')");
        $stmt->bind_param("sss", $email, $passwordHash, $googleId);
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to create user: " . $stmt->error);
        }
        
        $userId = $stmt->insert_id;
        $stmt->close();
        
        // Create user profile
        $stmt = $conn->prepare("INSERT INTO user_profiles (user_id, first_name, last_name, profile_picture) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $userId, $firstName, $lastName, $picture);
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to create profile: " . $stmt->error);
        }
        $stmt->close();
        
        // Create default address entry
        $conn->query("INSERT INTO user_addresses (user_id, barangay, city_municipality, province, region) 
                      VALUES ('$userId', '', '', '', '')");
    }

    // Generate session token
    $token = bin2hex(random_bytes(16));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
    $stmt = $conn->prepare("INSERT INTO login_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $userId, $token, $expiresAt);
    $stmt->execute();
    $stmt->close();

    // Set session variables
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_logged_in'] = true;

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Google authentication successful',
        'token' => $token,
        'user_id' => $userId,
        'email' => $email,
        'first_name' => $firstName,
        'last_name' => $lastName,
        'is_new_user' => !$user
    ]);

} catch (Exception $e) {
    error_log("Google OAuth error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Authentication failed: ' . $e->getMessage()
    ]);
}

exit;
