<?php
header('Content-Type: application/json');
require_once 'config.php';

$employee_id = isset($_GET['id']) ? intval($_GET['id']) : 1;

// Get salary configuration
$query = "SELECT * FROM salary_configuration WHERE employee_id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $employee_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $salaryConfig = $result->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $salaryConfig]);
} else {
    echo json_encode(['success' => false, 'data' => null, 'message' => 'Salary configuration not found']);
}

$stmt->close();
$conn->close();
?>
