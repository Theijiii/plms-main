<?php
// Start session with proper settings
session_start([
    'cookie_lifetime' => 86400, // 24 hours
    'read_and_close'  => false,
]);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// --------------------- CORS ---------------------
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

// --------------------- HELPER: SEND OTP ---------------------
function sendOtpEmail($otp, $toEmail, $purpose = 'login') {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'eplmsgoserveph@gmail.com';
        $mail->Password = 'dqwe prrq fhbt kyiq'; // app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('eplmsgoserveph@gmail.com', 'GoServePH');
        $mail->addAddress($toEmail);
        $mail->isHTML(true);

        $subject = ($purpose === 'register') ? 'Registration OTP Verification' : 'OTP Verification';
        $bodyPurpose = ($purpose === 'register') ? 'registration' : 'login';
        $mail->Subject = $subject;
        $mail->Body = "<h2>OTP Verification</h2><p>Your $bodyPurpose code: <strong>$otp</strong></p><p>Expires in 10 minutes.</p>";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("OTP email error: " . $mail->ErrorInfo);
        return false;
    }
}

// --------------------- ADMIN EMAILS ---------------------
$adminDepartments = [
    'superadmin@eplms.com'     => 'super',
    'businessadmin@eplms.com'  => 'business',
    'buildingadmin@eplms.com'  => 'building',
    'barangaystaff@eplms.com'  => 'barangay',
    'transportadmin@eplms.com' => 'transport',
    'admin@eplms.com'          => 'super',
];

// --------------------- INPUT ---------------------
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents("php://input"), true) ?? [];
$email = $input['email'] ?? '';
$purpose = $input['purpose'] ?? 'login';
$otpInput = $input['otp'] ?? '';

// Debug: Log session info
error_log("=== OTP DEBUG ===");
error_log("Session ID: " . session_id());
error_log("Session Data: " . json_encode($_SESSION));
error_log("Action: $action, Email: $email, Purpose: $purpose, OTP Input: $otpInput");
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("=== END DEBUG ===");

// --------------------- SEND OTP ---------------------
if ($action === 'send') {
    if (!$email) {
        echo json_encode(['success'=>false,'message'=>'Email required']);
        exit;
    }

    $otp = rand(100000, 999999);
    $isAdminEmail = isset($adminDepartments[$email]);
    
    // Store OTP in session with timestamp
    $_SESSION["otp_{$email}"] = (string)$otp; // Convert to string
    $_SESSION["otp_time_{$email}"] = time();
    $_SESSION["otp_purpose_{$email}"] = $purpose;
    
    error_log("OTP stored for $email: $otp");
    error_log("Current session after storing: " . json_encode($_SESSION));
    
    // Force session write
    session_write_close();
    
    $sent = sendOtpEmail($otp, $email, $purpose);

    if ($sent && $isAdminEmail && $email !== 'orilla.maaltheabalcos@gmail.com') {
        sendOtpEmail($otp, 'orilla.maaltheabalcos@gmail.com', $purpose);
    }

    echo json_encode([
        'success' => $sent,
        'message' => $sent ? 'OTP sent to email' : 'Failed to send OTP',
        'department' => $isAdminEmail ? $adminDepartments[$email] : null
    ]);
    exit;
}

// --------------------- VERIFY OTP ---------------------
if ($action === 'verify') {
    if (!$email || !$otpInput) {
        echo json_encode(['success'=>false,'message'=>'Email and OTP required']);
        exit;
    }

    // Check if OTP exists in session
    if (!isset($_SESSION["otp_{$email}"])) {
        error_log("No OTP found in session for $email");
        echo json_encode(['success'=>false,'message'=>'Request a new OTP']);
        exit;
    }

    // Check OTP expiration (10 minutes = 600 seconds)
    $otpTime = $_SESSION["otp_time_{$email}"] ?? 0;
    if (time() - $otpTime > 600) {
        error_log("OTP expired for $email");
        unset($_SESSION["otp_{$email}"], $_SESSION["otp_time_{$email}"]);
        echo json_encode(['success'=>false,'message'=>'OTP expired']);
        exit;
    }

    // Check if OTP matches
    $otpSession = $_SESSION["otp_{$email}"];
    if ($otpInput != $otpSession) {
        error_log("OTP mismatch for $email");
        echo json_encode(['success'=>false,'message'=>'Invalid OTP']);
        exit;
    }

    // OTP valid → remove from session
    unset($_SESSION["otp_{$email}"], $_SESSION["otp_time_{$email}"]);

    // Fetch user/admin ID
    $userRes = $conn->query("SELECT id FROM users WHERE email='$email'");
    $user = $userRes ? $userRes->fetch_assoc() : null;
    if (!$user) {
        echo json_encode(['success'=>false,'message'=>'User not found']);
        exit;
    }

    // Check if email is an admin email
    $isAdmin = isset($adminDepartments[$email]);

    // Generate session token
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+2 hours'));
    $stmt = $conn->prepare("INSERT INTO login_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user['id'], $token, $expiresAt);
    $stmt->execute();
    $stmt->close();

    // Fetch profile for name
    $profileRes = $conn->query("SELECT first_name, last_name FROM user_profiles WHERE user_id='{$user['id']}'");
    $profile = $profileRes ? $profileRes->fetch_assoc() : null;
    $name = $profile ? trim(($profile['first_name'] ?? '') . ' ' . ($profile['last_name'] ?? '')) : '';

    // SET SESSION VARIABLES - THIS IS CRITICAL
    if ($isAdmin) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_email'] = $email;
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_department'] = $adminDepartments[$email] ?? null;
        $_SESSION['admin_name'] = $name;
    } else {
        $_SESSION['user_logged_in'] = true;
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $email;
        $_SESSION['user_name'] = $name;
    }

    // Also set a generic session for backward compatibility
    $_SESSION['logged_in'] = true;
    $_SESSION['email'] = $email;
    $_SESSION['user_id'] = $user['id'];

    echo json_encode([
        'success'=>true,
        'message'=>'OTP verified successfully',
        'role' => $isAdmin ? 'admin' : 'user',
        'email' => $email,
        'name' => $name,
        'token' => $token,
        'user_id' => $user['id'],
        'isAdmin' => $isAdmin,
        'department' => $isAdmin ? ($adminDepartments[$email] ?? null) : null
    ]);
    exit;
}

// --------------------- INVALID ACTION ---------------------
echo json_encode(['success'=>false,'message'=>'Invalid action']);
exit;