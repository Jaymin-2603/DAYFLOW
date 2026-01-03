<?php
// login.php - User Authentication
header('Content-Type: application/json');

include 'config.php';

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get form data
$loginId = isset($_POST['loginId']) ? trim($_POST['loginId']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

// Validate input
if (empty($loginId) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Login ID/Email and password are required']);
    exit;
}

// Prepare query - check both login_id and email
$query = "SELECT id, login_id, email, password_hash, role, first_login, employee_id FROM users WHERE (login_id = ? OR email = ?) LIMIT 1";
$stmt = $conn->prepare($query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param('ss', $loginId, $loginId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Invalid credentials
    echo json_encode(['success' => false, 'message' => 'Invalid Login ID/Email or Password']);
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

// Verify password (using password_verify for bcrypt)
if (!password_verify($password, $user['password_hash'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid Login ID/Email or Password']);
    exit;
}

// Get employee name for display
$userName = 'User';
if ($user['employee_id']) {
    $empQuery = "SELECT name FROM employees WHERE id = ?";
    $empStmt = $conn->prepare($empQuery);
    if ($empStmt) {
        $empStmt->bind_param('i', $user['employee_id']);
        $empStmt->execute();
        $empResult = $empStmt->get_result();
        if ($empResult->num_rows > 0) {
            $emp = $empResult->fetch_assoc();
            $userName = $emp['name'];
        }
        $empStmt->close();
    }
}

// Start session
session_start();
$_SESSION['user_id'] = $user['id'];
$_SESSION['login_id'] = $user['login_id'];
$_SESSION['email'] = $user['email'];
$_SESSION['role'] = $user['role'];

// Check if first login
$needsPasswordChange = $user['first_login'] == 1;

// Response
$response = [
    'success' => true,
    'userId' => $user['id'],
    'userName' => $userName,
    'userEmail' => $user['email'],
    'userRole' => $user['role'],
    'needs_password_change' => $needsPasswordChange
];

echo json_encode($response);
$conn->close();
?>
