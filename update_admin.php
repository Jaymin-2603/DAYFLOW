<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $admin_id = intval($data['admin_id']);
    
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $mobile = $data['mobile'] ?? '';
    $organization = $data['organization'] ?? '';
    $department = $data['department'] ?? '';
    $admin_since = $data['admin_since'] ?? '';
    $date_of_birth = $data['date_of_birth'] ?? '';
    $address = $data['address'] ?? '';
    $nationality = $data['nationality'] ?? '';
    $personal_email = $data['personal_email'] ?? '';
    $gender = $data['gender'] ?? '';
    $marital_status = $data['marital_status'] ?? '';
    $alt_phone = $data['alt_phone'] ?? '';

    $query = "UPDATE admins SET 
              name = ?, email = ?, mobile = ?, organization = ?, 
              department = ?, admin_since = ?, date_of_birth = ?, 
              address = ?, nationality = ?, personal_email = ?, 
              gender = ?, marital_status = ?, alt_phone = ?
              WHERE id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssssssssssssi", 
        $name, $email, $mobile, $organization, 
        $department, $admin_since, $date_of_birth, 
        $address, $nationality, $personal_email, 
        $gender, $marital_status, $alt_phone, $admin_id
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Admin profile updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating admin profile']);
    }

    $stmt->close();
    $conn->close();
}
?>
