<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

session_start();

// --- PHPMailer ---
require __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Always return JSON
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// --- MySQL database config ---
$host = 'localhost';
$dbname = 'government_services';
$user = 'root';
$pass = 'mypassword'; // Change to your MySQL password

// --- Helper functions ---
function sendResponse($success, $message, $data = null, $httpCode = 200) {
    http_response_code($httpCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit();
}

function initDatabase($host, $dbname, $user, $pass) {
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Create users table if not exists
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                role ENUM('admin','user') DEFAULT 'user',
                status ENUM('active','inactive') DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");

        // Default admin
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $stmt->execute(['admin@gsm.gov.ph']);
        if ($stmt->fetchColumn() == 0) {
            $stmt = $pdo->prepare("
                INSERT INTO users (email, password_hash, first_name, last_name, role, status) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                'admin@gsm.gov.ph',
                password_hash('admin123', PASSWORD_DEFAULT),
                'System',
                'Administrator',
                'admin',
                'active'
            ]);
        }

        return $pdo;
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        return false;
    }
}

function authenticateUser($email, $password, $pdo) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND status = 'active'");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
        return $user;
    }
    return false;
}

// --- MAIN ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) $input = $_POST;

    $pdo = initDatabase($host, $dbname, $user, $pass);
    if (!$pdo) sendResponse(false, 'Database connection failed', null, 500);

    $action = $input['action'] ?? 'login';

    switch ($action) {
        case 'login':
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';

            if (empty($email) || empty($password)) {
                sendResponse(false, 'Email and password are required', null, 400);
            }

            $user = authenticateUser($email, $password, $pdo);
            if ($user) {
                $_SESSION['pending_user'] = $user;

                $otp = rand(100000, 999999);
                $_SESSION['otp_code'] = $otp;
                $_SESSION['otp_expiry'] = time() + 180;

                $to = $user['email'];
                $subject = "Your OTP Code";
                $message = "Your One-Time Password (OTP) is: $otp";

                $mail = new PHPMailer(true);
                try {
                    $mail->isSMTP();
                    $mail->Host       = 'smtp.gmail.com';
                    $mail->SMTPAuth   = true;
                    $mail->Username   = 'your-email@gmail.com'; // Replace with your email
                    $mail->Password   = 'your-app-password';    // Replace with your app password
                    $mail->SMTPSecure = 'tls';
                    $mail->Port       = 587;

                    $mail->setFrom('noreply@gsm.gov.ph', 'GSM System');
                    $mail->addAddress($to);

                    $mail->isHTML(true);
                    $mail->Subject = $subject;
                    $mail->Body    = "<b>$message</b>";
                    $mail->AltBody = $message;

                    $mail->send();
                    sendResponse(true, "OTP sent successfully. Check your email.", ["requireOtp" => true]);
                } catch (Exception $e) {
                    sendResponse(true, "Simulated OTP: $otp", ["requireOtp" => true, "otp_debug" => $otp]);
                }
            } else {
                sendResponse(false, 'Invalid email or password', null, 401);
            }
            break;

        case 'verifyOtp':
            $otpInput = $input['otp'] ?? '';
            if (!isset($_SESSION['otp_code'])) sendResponse(false, 'No OTP session found', null, 400);
            if (time() > $_SESSION['otp_expiry']) {
                unset($_SESSION['otp_code']);
                sendResponse(false, 'OTP expired. Please log in again.', null, 400);
            }

            if ($otpInput == $_SESSION['otp_code']) {
                $user = $_SESSION['pending_user'];
                unset($_SESSION['otp_code'], $_SESSION['pending_user']);

                $_SESSION['user_id'] = $user['id'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['role'] = $user['role'];

                $redirect = ($user['role'] === 'admin') 
                    ? '/admin/dashboard'
                    : '/user/dashboard';

                sendResponse(true, 'OTP verified successfully.', ['redirect' => $redirect]);
            } else {
                sendResponse(false, 'Invalid OTP entered.', null, 401);
            }
            break;

        default:
            sendResponse(false, 'Invalid action.', null, 400);
    }
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>