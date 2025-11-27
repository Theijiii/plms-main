
<?php
require_once 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$allowedOrigins = [
    'http://localhost',
    'http://localhost:5173',
    'http://127.0.0.1',
    'http://127.0.0.1:5173'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: http://localhost");
}
header("Vary: Origin");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

$data = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? '';

function sendOtpEmail($email, $otp) {
    $mail = new PHPMailer(true);
    try {
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'eplmsgoserveph@gmail.com';
        $mail->Password = 'dqwe prrq fhbt kyiq';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('eplmsgoserveph@gmail.com', 'GoServePH');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Your OTP Verification Code';
        $mail->Body = "<h2>OTP Verification</h2><p>Your code: <strong>$otp</strong></p><p>Expires in 10 minutes.</p>";

        $mail->send();
        return ['success' => true, 'message' => 'OTP sent to email'];
    } catch (Exception $e) {
        $errorMsg = $mail->ErrorInfo ?: $e->getMessage();
        error_log("OTP email error ({$email}): " . $errorMsg);
        return ['success' => false, 'message' => 'Email error: ' . $errorMsg];
    }
}

if ($action === 'send') {
    $email = $data['email'] ?? '';
    $purpose = $data['purpose'] ?? 'login';
    $purpose = in_array($purpose, ['login', 'register']) ? $purpose : 'login';

    if (!$email) {
        echo json_encode(['success' => false, 'message' => 'Email required']);
        exit;
    }

    $otp = rand(100000, 999999);
    $otpKey = 'otp_' . $purpose . '_' . $email;
    $otpTimeKey = 'otp_time_' . $purpose . '_' . $email;
    $_SESSION[$otpKey] = $otp;
    $_SESSION[$otpTimeKey] = time();

    $result = sendOtpEmail($email, $otp);
    echo json_encode($result);
    exit;
}

if ($action === 'verify') {
    $email = $data['email'] ?? '';
    $userOtp = $data['otp'] ?? '';
    $purpose = $data['purpose'] ?? 'login';
    $purpose = in_array($purpose, ['login', 'register']) ? $purpose : 'login';
    $otpKey = 'otp_' . $purpose . '_' . $email;
    $otpTimeKey = 'otp_time_' . $purpose . '_' . $email;

    if (!isset($_SESSION[$otpKey])) {
        echo json_encode(['success' => false, 'message' => 'Request new OTP']);
        exit;
    }

    if (time() - $_SESSION[$otpTimeKey] > 600) {
        echo json_encode(['success' => false, 'message' => 'OTP expired']);
        exit;
    }

    if ($userOtp == $_SESSION[$otpKey]) {
        unset($_SESSION[$otpKey]);
        unset($_SESSION[$otpTimeKey]);
        echo json_encode(['success' => true, 'message' => 'OTP verified']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid OTP']);
    }
}
?>