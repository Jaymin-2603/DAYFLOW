<?php
header('Content-Type: application/json');
require_once 'config.php';

// Check if user is authenticated (assumes session-based auth)
session_start();
$userRole = isset($_SESSION['user_role']) ? strtolower($_SESSION['user_role']) : 'employee';

// Salary info can only be modified by HR
if ($userRole !== 'hr') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized: Only HR can modify salary information']);
    http_response_code(403);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $employee_id = intval($data['employee_id']);
    
    $account_number = $data['account_number'] ?? '';
    $bank_name = $data['bank_name'] ?? '';
    $ifsc_code = $data['ifsc_code'] ?? '';
    $pan_no = $data['pan_no'] ?? '';
    $uan_no = $data['uan_no'] ?? '';
    $emp_code = $data['emp_code'] ?? '';

    // Check if salary info exists
    $check_query = "SELECT id FROM salary_info WHERE employee_id = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("i", $employee_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();

    if ($result->num_rows > 0) {
        // Update existing
        $query = "UPDATE salary_info SET 
                  account_number = ?, bank_name = ?, ifsc_code = ?, 
                  pan_no = ?, uan_no = ?, emp_code = ?
                  WHERE employee_id = ?";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssssi", 
            $account_number, $bank_name, $ifsc_code, 
            $pan_no, $uan_no, $emp_code, $employee_id
        );
    } else {
        // Insert new
        $query = "INSERT INTO salary_info (employee_id, account_number, bank_name, ifsc_code, pan_no, uan_no, emp_code)
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("issssss", 
            $employee_id, $account_number, $bank_name, $ifsc_code, 
            $pan_no, $uan_no, $emp_code
        );
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Salary info updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating salary info']);
    }

    $stmt->close();
    $check_stmt->close();
    $conn->close();
}
?>
