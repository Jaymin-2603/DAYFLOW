<?php
header('Content-Type: application/json');
require_once 'config.php';

$admin_id = isset($_GET['id']) ? intval($_GET['id']) : 1;

// Get admin information
$query = "SELECT id, name, role, email, mobile, organization, department, admin_since, 
          date_of_birth, address, nationality, personal_email, gender, marital_status, 
          alt_phone, login_id, last_login
          FROM admins
          WHERE id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $admin_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $admin]);
} else {
    echo json_encode(['success' => false, 'message' => 'Admin not found']);
}

$stmt->close();
$conn->close();
?>
