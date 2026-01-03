<?php
// session_check.php - Check if user is logged in
header('Content-Type: application/json');

session_start();

if (isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
    echo json_encode([
        'loggedIn' => true,
        'userId' => $_SESSION['user_id'],
        'loginId' => $_SESSION['login_id'] ?? null,
        'email' => $_SESSION['email'] ?? null,
        'role' => $_SESSION['role'] ?? null
    ]);
} else {
    echo json_encode([
        'loggedIn' => false
    ]);
}
?>
