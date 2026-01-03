<?php
// change_password.php - Change password in settings
header('Content-Type: application/json');

include 'config.php';

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get form data
$userId = isset($_POST['userId']) ? intval($_POST['userId']) : 0;
$currentPassword = isset($_POST['currentPassword']) ? $_POST['currentPassword'] : '';
$newPassword = isset($_POST['newPassword']) ? $_POST['newPassword'] : '';

// Validate input
if (empty($userId) || empty($currentPassword) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

if (strlen($newPassword) < 6) {
    echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters long']);
    exit;
}

// Get current password hash
$query = "SELECT password_hash FROM users WHERE id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param('i', $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

// Verify current password
if (!password_verify($currentPassword, $user['password_hash'])) {
    echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
    exit;
}

// Hash the new password
$newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);

// Update password
$updateQuery = "UPDATE users SET password_hash = ? WHERE id = ?";
$updateStmt = $conn->prepare($updateQuery);

if (!$updateStmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$updateStmt->bind_param('si', $newPasswordHash, $userId);
$result = $updateStmt->execute();
$updateStmt->close();

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update password']);
}

$conn->close();
?>
