<?php
header('Content-Type: application/json');
require_once 'config.php';

// Check if user is authenticated and is HR
session_start();
$userRole = isset($_SESSION['user_role']) ? strtolower($_SESSION['user_role']) : 'employee';

// Only HR can save salary configuration
if ($userRole !== 'hr') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized: Only HR can configure salary']);
    http_response_code(403);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $employee_id = intval($data['employee_id']);
    
    $monthly_wage = floatval($data['monthly_wage'] ?? 0);
    $yearly_wage = floatval($data['yearly_wage'] ?? 0);
    $working_days = intval($data['working_days'] ?? 5);
    $break_time = floatval($data['break_time'] ?? 0);
    $basic_salary = floatval($data['basic_salary'] ?? 0);
    $basic_salary_type = $data['basic_salary_type'] ?? 'fixed';
    $hra = floatval($data['hra'] ?? 0);
    $hra_type = $data['hra_type'] ?? 'fixed';
    $standard_allowance = floatval($data['standard_allowance'] ?? 0);
    $standard_allowance_type = $data['standard_allowance_type'] ?? 'fixed';
    $performance_bonus = floatval($data['performance_bonus'] ?? 0);
    $performance_bonus_type = $data['performance_bonus_type'] ?? 'fixed';
    $leave_travel_allowance = floatval($data['leave_travel_allowance'] ?? 0);
    $leave_travel_type = $data['leave_travel_type'] ?? 'fixed';
    $fixed_allowance = floatval($data['fixed_allowance'] ?? 0);
    $fixed_allowance_type = $data['fixed_allowance_type'] ?? 'fixed';
    $pf_employee_percent = floatval($data['pf_employee_percent'] ?? 0);
    $pf_employer_percent = floatval($data['pf_employer_percent'] ?? 0);
    $professional_tax = floatval($data['professional_tax'] ?? 0);
    $income_tax_percent = floatval($data['income_tax_percent'] ?? 0);
    $gross_salary = floatval($data['gross_salary'] ?? 0);
    $net_salary = floatval($data['net_salary'] ?? 0);

    // Check if salary config exists
    $check_query = "SELECT id FROM salary_configuration WHERE employee_id = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("i", $employee_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();

    if ($result->num_rows > 0) {
        // Update existing
        $query = "UPDATE salary_configuration SET 
                  monthly_wage = ?, yearly_wage = ?, working_days = ?, break_time = ?,
                  basic_salary = ?, basic_salary_type = ?, hra = ?, hra_type = ?,
                  standard_allowance = ?, standard_allowance_type = ?,
                  performance_bonus = ?, performance_bonus_type = ?,
                  leave_travel_allowance = ?, leave_travel_type = ?,
                  fixed_allowance = ?, fixed_allowance_type = ?,
                  pf_employee_percent = ?, pf_employer_percent = ?,
                  professional_tax = ?, income_tax_percent = ?,
                  gross_salary = ?, net_salary = ?, updated_at = NOW()
                  WHERE employee_id = ?";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ddiiddsddsddsddsddddddi", 
            $monthly_wage, $yearly_wage, $working_days, $break_time,
            $basic_salary, $basic_salary_type, $hra, $hra_type,
            $standard_allowance, $standard_allowance_type,
            $performance_bonus, $performance_bonus_type,
            $leave_travel_allowance, $leave_travel_type,
            $fixed_allowance, $fixed_allowance_type,
            $pf_employee_percent, $pf_employer_percent,
            $professional_tax, $income_tax_percent,
            $gross_salary, $net_salary, $employee_id
        );
    } else {
        // Insert new
        $query = "INSERT INTO salary_configuration 
                  (employee_id, monthly_wage, yearly_wage, working_days, break_time,
                   basic_salary, basic_salary_type, hra, hra_type,
                   standard_allowance, standard_allowance_type,
                   performance_bonus, performance_bonus_type,
                   leave_travel_allowance, leave_travel_type,
                   fixed_allowance, fixed_allowance_type,
                   pf_employee_percent, pf_employer_percent,
                   professional_tax, income_tax_percent,
                   gross_salary, net_salary, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iddiiddsddsddsddsddddd", 
            $employee_id, $monthly_wage, $yearly_wage, $working_days, $break_time,
            $basic_salary, $basic_salary_type, $hra, $hra_type,
            $standard_allowance, $standard_allowance_type,
            $performance_bonus, $performance_bonus_type,
            $leave_travel_allowance, $leave_travel_type,
            $fixed_allowance, $fixed_allowance_type,
            $pf_employee_percent, $pf_employer_percent,
            $professional_tax, $income_tax_percent,
            $gross_salary, $net_salary
        );
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Salary configuration saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error saving salary configuration']);
    }

    $stmt->close();
    $check_stmt->close();
    $conn->close();
}
?>
