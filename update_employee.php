<?php
header('Content-Type: application/json');
require_once 'config.php';

// Check if user is authenticated (assumes session-based auth)
session_start();
$userRole = isset($_SESSION['user_role']) ? strtolower($_SESSION['user_role']) : 'employee';

// Get role from request header if provided
$requestRole = isset($_SERVER['HTTP_X_USER_ROLE']) ? strtolower($_SERVER['HTTP_X_USER_ROLE']) : $userRole;

// Fields that ONLY employees can edit
$employeeEditableFields = [
    'name', 'email', 'mobile', 'personal_email',
    'date_of_birth', 'residing_address', 'nationality', 'gender', 'marital_status'
];

// Fields that ONLY HR can edit
$hrOnlyFields = [
    'job_position', 'company', 'department', 'manager', 'date_of_joining',
    'account_number', 'bank_name', 'ifsc_code', 'pan_no', 'uan_no', 'emp_code'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $employee_id = intval($data['employee_id']);
    
    // Validate permissions
    if ($requestRole === 'employee') {
        // Employee trying to modify HR-only fields
        foreach ($hrOnlyFields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                echo json_encode(['success' => false, 'message' => 'Unauthorized: You cannot modify this field']);
                http_response_code(403);
                exit;
            }
        }
        
        // Log: Employee can only update their personal info
        $allowedFields = $employeeEditableFields;
    } else {
        // HR can update all fields
        $allowedFields = array_merge($employeeEditableFields, $hrOnlyFields);
    }
    
    // Build dynamic query based on allowed fields
    $updateFields = [];
    $params = [];
    $types = '';
    
    $fieldMapping = [
        'name' => 's',
        'job_position' => 's',
        'email' => 's',
        'mobile' => 's',
        'company' => 's',
        'department' => 's',
        'manager' => 's',
        'date_of_birth' => 's',
        'residing_address' => 's',
        'nationality' => 's',
        'personal_email' => 's',
        'gender' => 's',
        'marital_status' => 's',
        'date_of_joining' => 's'
    ];
    
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updateFields[] = "$field = ?";
            $params[] = $data[$field];
            $types .= $fieldMapping[$field];
        }
    }
    
    if (empty($updateFields)) {
        echo json_encode(['success' => false, 'message' => 'No valid fields to update']);
        http_response_code(400);
        exit;
    }
    
    $params[] = $employee_id;
    $types .= 'i';
    
    $query = "UPDATE employees SET " . implode(', ', $updateFields) . " WHERE id = ?";
    
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        $message = ($requestRole === 'employee') 
            ? 'Personal information updated successfully'
            : 'Employee updated successfully';
        echo json_encode(['success' => true, 'message' => $message]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating employee']);
    }
    
    $stmt->close();
    $conn->close();
}
?>
