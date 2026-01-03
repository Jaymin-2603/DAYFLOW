<?php
// change_first_password.php - Change password on first login
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
$newPassword = isset($_POST['newPassword']) ? $_POST['newPassword'] : '';

// Validate input
if (empty($userId) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'User ID and password are required']);
    exit;
}

if (strlen($newPassword) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
    exit;
}

// Hash the new password
$passwordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);

// Update password and set first_login to false
$query = "UPDATE users SET password_hash = ?, first_login = FALSE WHERE id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param('si', $passwordHash, $userId);
$result = $stmt->execute();
$stmt->close();

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update password']);
}

$conn->close();
?>
