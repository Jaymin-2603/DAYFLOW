<?php
// signup.php - HR creates new employee account
header('Content-Type: application/json');

include 'config.php';

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get form data
$firstName = isset($_POST['firstName']) ? trim($_POST['firstName']) : '';
$lastName = isset($_POST['lastName']) ? trim($_POST['lastName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$mobile = isset($_POST['mobile']) ? trim($_POST['mobile']) : '';
$dateOfJoining = isset($_POST['dateOfJoining']) ? $_POST['dateOfJoining'] : '';
$department = isset($_POST['department']) ? trim($_POST['department']) : '';
$jobPosition = isset($_POST['jobPosition']) ? trim($_POST['jobPosition']) : '';
$manager = isset($_POST['manager']) ? trim($_POST['manager']) : '';
$company = isset($_POST['company']) ? trim($_POST['company']) : '';
$loginId = isset($_POST['loginId']) ? trim($_POST['loginId']) : '';
$defaultPassword = isset($_POST['defaultPassword']) ? $_POST['defaultPassword'] : '';

// Validate input
if (empty($firstName) || empty($lastName) || empty($email) || empty($mobile) || 
    empty($dateOfJoining) || empty($department) || empty($jobPosition) || empty($loginId)) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Check if login_id already exists
$checkQuery = "SELECT id FROM users WHERE login_id = ?";
$checkStmt = $conn->prepare($checkQuery);
if (!$checkStmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$checkStmt->bind_param('s', $loginId);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    $checkStmt->close();
    echo json_encode(['success' => false, 'message' => 'Login ID already exists']);
    exit;
}
$checkStmt->close();

// Check if email already exists
$checkEmailQuery = "SELECT id FROM users WHERE email = ?";
$checkEmailStmt = $conn->prepare($checkEmailQuery);
if (!$checkEmailStmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$checkEmailStmt->bind_param('s', $email);
$checkEmailStmt->execute();
$checkEmailResult = $checkEmailStmt->get_result();

if ($checkEmailResult->num_rows > 0) {
    $checkEmailStmt->close();
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}
$checkEmailStmt->close();

// Start transaction
$conn->begin_transaction();

try {
    // 1. Insert employee record
    $fullName = $firstName . ' ' . $lastName;
    $empQuery = "INSERT INTO employees (name, job_position, email, mobile, company, department, manager, date_of_joining) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $empStmt = $conn->prepare($empQuery);
    
    if (!$empStmt) {
        throw new Exception('Database error: ' . $conn->error);
    }
    
    $empStmt->bind_param('ssssssss', $fullName, $jobPosition, $email, $mobile, $company, $department, $manager, $dateOfJoining);
    $empStmt->execute();
    $employeeId = $empStmt->insert_id;
    $empStmt->close();
    
    // 2. Hash default password
    $passwordHash = password_hash($defaultPassword, PASSWORD_BCRYPT, ['cost' => 10]);
    
    // 3. Insert user record
    $userQuery = "INSERT INTO users (login_id, email, password_hash, role, employee_id, first_login) 
                  VALUES (?, ?, ?, 'employee', ?, TRUE)";
    $userStmt = $conn->prepare($userQuery);
    
    if (!$userStmt) {
        throw new Exception('Database error: ' . $conn->error);
    }
    
    $userStmt->bind_param('sssi', $loginId, $email, $passwordHash, $employeeId);
    $userStmt->execute();
    $userStmt->close();
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Employee added successfully',
        'employeeId' => $employeeId,
        'loginId' => $loginId
    ]);
    
} catch (Exception $e) {
    // Rollback transaction
    $conn->rollback();
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$conn->close();
?>
