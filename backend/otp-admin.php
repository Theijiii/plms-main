<?php
session_start();
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
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

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

// --------------------- SEND OTP ---------------------
if ($action === 'send') {
    if (!$email) {
        echo json_encode(['success'=>false,'message'=>'Email required']);
        exit;
    }

    // Generate OTP and store in session with timestamp
    $otp = rand(100000, 999999);

    // Admin login special: map admin email to department
    if ($purpose === 'login' && isset($adminDepartments[$email])) {
        $_SESSION["otp_admin_{$email}"] = $otp;
        $_SESSION["otp_admin_time_{$email}"] = time();

        // deliver code directly to the department email (the admin logging in)
        $sent = sendOtpEmail($otp, $email, 'login');

        // Optionally notify the super admin for monitoring, but do not block on failure
        if ($sent && $email !== 'orilla.maaltheabalcos@gmail.com') {
            sendOtpEmail($otp, 'orilla.maaltheabalcos@gmail.com', 'login');
        }

        echo json_encode([
            'success' => $sent,
            'message' => $sent ? 'OTP sent to department email' : 'Failed to send OTP',
            'department' => $adminDepartments[$email]
        ]);
        exit;
    }

    // Regular user (login or register) - send OTP directly to user's email
    $_SESSION["otp_user_{$email}"] = $otp;
    $_SESSION["otp_user_time_{$email}"] = time();

    $sent = sendOtpEmail($otp, $email, $purpose);

    echo json_encode([
        'success' => $sent,
        'message' => $sent ? 'OTP sent to email' : 'Failed to send OTP',
    ]);
    exit;
}

// --------------------- VERIFY OTP (unified) ---------------------
if ($action === 'verify') {
    // Admin OTP present?
    if (isset($_SESSION["otp_admin_{$email}"])) {
        if (time() - $_SESSION["otp_admin_time_{$email}"] > 600) {
            unset($_SESSION["otp_admin_{$email}"], $_SESSION["otp_admin_time_{$email}"]);
            echo json_encode(['success'=>false,'message'=>'OTP expired']);
            exit;
        }

        if ($otpInput == $_SESSION["otp_admin_{$email}"]) {
            unset($_SESSION["otp_admin_{$email}"], $_SESSION["otp_admin_time_{$email}"]);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_email'] = $email;
            $_SESSION['admin_department'] = $adminDepartments[$email] ?? null;

            // Fetch admin name (if exists)
            $profileRes = $conn->query("SELECT first_name, last_name FROM user_profiles WHERE user_id=(SELECT id FROM users WHERE email='$email')");
            $profile = $profileRes ? $profileRes->fetch_assoc() : null;
            $adminName = $profile ? trim(($profile['first_name'] . ' ' . $profile['last_name'])) : '';

            $_SESSION['admin_name'] = $adminName;

            echo json_encode([
                'success'=>true,
                'message'=>'Admin login successful',
                'role' => 'admin',
                'email' => $email,
                'name'=>$_SESSION['admin_name'],
                'department'=>$_SESSION['admin_department']
            ]);
            exit;
        } else {
            echo json_encode(['success'=>false,'message'=>'Invalid OTP']);
            exit;
        }
    }

    // User OTP present?
    if (isset($_SESSION["otp_user_{$email}"])) {
        if (time() - $_SESSION["otp_user_time_{$email}"] > 600) {
            unset($_SESSION["otp_user_{$email}"], $_SESSION["otp_user_time_{$email}"]);
            echo json_encode(['success'=>false,'message'=>'OTP expired']);
            exit;
        }

        if ($otpInput == $_SESSION["otp_user_{$email}"]) {
            unset($_SESSION["otp_user_{$email}"], $_SESSION["otp_user_time_{$email}"]);
            // For registration purpose, frontend will call registerUser after verification.
            // For login purpose, return success with role user so frontend can complete session steps.
            echo json_encode([
                'success'=>true,
                'message'=>'OTP verified successfully',
                'role' => 'user',
                'email' => $email
            ]);
            exit;
        } else {
            echo json_encode(['success'=>false,'message'=>'Invalid OTP']);
            exit;
        }
    }

    // No OTP session found
    echo json_encode(['success'=>false,'message'=>'Request a new OTP']);
    exit;
}

// --------------------- INVALID ACTION ---------------------
echo json_encode(['success'=>false,'message'=>'Invalid action']);
exit;
?>