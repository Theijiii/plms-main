<?php
session_start([
    'cookie_lifetime' => 86400,
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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// --------------------- HELPER FUNCTIONS ---------------------
function sendOtpEmail($otp, $toEmail, $purpose = 'login') {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'eplmsgoserveph@gmail.com';
        $mail->Password = 'dqwe prrq fhbt kyiq';
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

function getDepartmentFromEmail($email) {
    $adminDepartments = [
        'superadmin@eplms.com'     => 'super',
        'businessadmin@eplms.com'  => 'business',
        'buildingadmin@eplms.com'  => 'building',
        'barangaystaff@eplms.com'  => 'barangay',
        'transportadmin@eplms.com' => 'transport',
        'admin@eplms.com'          => 'super',
    ];
    
    return $adminDepartments[$email] ?? null;
}

// --------------------- INPUT ---------------------
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents("php://input"), true) ?? [];
$email = $input['email'] ?? '';
$purpose = $input['purpose'] ?? 'login';
$otpInput = $input['otp'] ?? '';

// --------------------- SEND OTP ---------------------
if ($action === 'send') {
    if (!$email) {
        echo json_encode(['success'=>false,'message'=>'Email required']);
        exit;
    }

    $otp = rand(100000, 999999);
    $department = getDepartmentFromEmail($email);
    
    // Store OTP in session
    $_SESSION["otp_{$email}"] = (string)$otp;
    $_SESSION["otp_time_{$email}"] = time();
    $_SESSION["otp_purpose_{$email}"] = $purpose;
    
    $sent = sendOtpEmail($otp, $email, $purpose);

    // Send copy to supervisor if admin email (except specific email)
    if ($department && $email !== 'orilla.maaltheabalcos@gmail.com') {
        sendOtpEmail($otp, 'orilla.maaltheabalcos@gmail.com', $purpose);
    }

echo json_encode([
    'success' => true,
    'message' => 'OTP verified successfully',
    'role' => $isAdmin ? 'admin' : 'user',
    'email' => $email,
    'name' => $name,
    'token' => $token,
    'user_id' => $user['id'],
    'isAdmin' => $isAdmin,
    'department' => $isAdmin ? ($adminDepartments[$email] ?? null) : null // MAKE SURE THIS IS INCLUDED
]);
    exit;
}

// --------------------- VERIFY OTP ---------------------
if ($action === 'verify') {
    if (!$email || !$otpInput) {
        echo json_encode(['success'=>false,'message'=>'Email and OTP required']);
        exit;
    }

    // Check OTP in session
    if (!isset($_SESSION["otp_{$email}"])) {
        echo json_encode(['success'=>false,'message'=>'Request a new OTP']);
        exit;
    }

    // Check expiration
    $otpTime = $_SESSION["otp_time_{$email}"] ?? 0;
    if (time() - $otpTime > 600) {
        unset($_SESSION["otp_{$email}"], $_SESSION["otp_time_{$email}"]);
        echo json_encode(['success'=>false,'message'=>'OTP expired']);
        exit;
    }

    // Verify OTP
    $otpSession = $_SESSION["otp_{$email}"];
    if ($otpInput != $otpSession) {
        echo json_encode(['success'=>false,'message'=>'Invalid OTP']);
        exit;
    }

    // OTP valid - remove from session
    unset($_SESSION["otp_{$email}"], $_SESSION["otp_time_{$email}"]);

    // Check if user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success'=>false,'message'=>'User not found']);
        exit;
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();

    // Get profile information
    $stmt = $conn->prepare("SELECT first_name, last_name FROM user_profiles WHERE user_id = ?");
    $stmt->bind_param("i", $user['id']);
    $stmt->execute();
    $profileResult = $stmt->get_result();
    $profile = $profileResult->fetch_assoc();
    $name = $profile ? trim(($profile['first_name'] ?? '') . ' ' . ($profile['last_name'] ?? '')) : '';
    $stmt->close();

    // Determine role and department
    $department = getDepartmentFromEmail($email);
    $isAdmin = !is_null($department);
    $role = $isAdmin ? 'admin' : 'user';

    // Generate session token
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+8 hours'));
    
    $stmt = $conn->prepare("INSERT INTO login_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user['id'], $token, $expiresAt);
    $stmt->execute();
    $stmt->close();

    // Set session variables
    if ($isAdmin) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_email'] = $email;
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_department'] = $department;
        $_SESSION['admin_name'] = $name;
    } else {
        $_SESSION['user_logged_in'] = true;
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $email;
        $_SESSION['user_name'] = $name;
    }

    $_SESSION['logged_in'] = true;
    $_SESSION['email'] = $email;
    $_SESSION['user_id'] = $user['id'];

    // Prepare response with all necessary data
    $response = [
        'success' => true,
        'message' => 'OTP verified successfully',
        'role' => $role,
        'email' => $email,
        'name' => $name,
        'token' => $token,
        'user_id' => $user['id'],
        'isAdmin' => $isAdmin
    ];

    if ($isAdmin) {
        $response['department'] = $department;
    }

    echo json_encode($response);
    exit;
}

// --------------------- CHECK SESSION ---------------------
if ($action === 'check') {
    $token = $_GET['token'] ?? '';
    
    if (empty($token)) {
        echo json_encode(['authenticated' => false]);
        exit;
    }
    
    // Check token in database
    $stmt = $conn->prepare("SELECT user_id, expires_at FROM login_sessions WHERE session_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['authenticated' => false]);
        exit;
    }
    
    $session = $result->fetch_assoc();
    $stmt->close();
    
    // Check if token expired
    if (strtotime($session['expires_at']) < time()) {
        // Remove expired token
        $stmt = $conn->prepare("DELETE FROM login_sessions WHERE session_token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $stmt->close();
        
        echo json_encode(['authenticated' => false]);
        exit;
    }
    
    // Get user info
    $userId = $session['user_id'];
    $stmt = $conn->prepare("SELECT email FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $userResult = $stmt->get_result();
    $user = $userResult->fetch_assoc();
    $stmt->close();
    
    if (!$user) {
        echo json_encode(['authenticated' => false]);
        exit;
    }
    
    $email = $user['email'];
    $department = getDepartmentFromEmail($email);
    $isAdmin = !is_null($department);
    
    echo json_encode([
        'authenticated' => true,
        'role' => $isAdmin ? 'admin' : 'user',
        'department' => $department,
        'email' => $email,
        'user_id' => $userId
    ]);
    exit;
}

// --------------------- LOGOUT ---------------------
if ($action === 'logout') {
    $token = $input['token'] ?? '';
    
    if (!empty($token)) {
        $stmt = $conn->prepare("DELETE FROM login_sessions WHERE session_token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $stmt->close();
    }
    
    // Clear session
    session_destroy();
    
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    exit;
}

echo json_encode(['success'=>false,'message'=>'Invalid action']);
exit;