<?php
header('Content-Type: application/json');
require_once 'config.php';

$employee_id = isset($_GET['id']) ? intval($_GET['id']) : 1;

// Get employee information
$query = "SELECT e.*, s.account_number, s.bank_name, s.ifsc_code, s.pan_no, s.uan_no, s.emp_code
          FROM employees e
          LEFT JOIN salary_info s ON e.id = s.employee_id
          WHERE e.id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $employee_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $employee = $result->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $employee]);
} else {
    echo json_encode(['success' => false, 'message' => 'Employee not found']);
}

$stmt->close();
$conn->close();
?>
