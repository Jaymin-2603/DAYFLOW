<?php
// test_connection.php - Test database connection
header('Content-Type: application/json');

// Test 1: Check if config.php can be included
if (!file_exists('config.php')) {
    echo json_encode(['success' => false, 'error' => 'config.php not found']);
    exit;
}

include 'config.php';

// Test 2: Check connection
if (!isset($conn)) {
    echo json_encode(['success' => false, 'error' => 'Connection object not set']);
    exit;
}

// Test 3: Check if users table exists
$result = $conn->query("SHOW TABLES LIKE 'users'");
$usersTableExists = $result && $result->num_rows > 0;

// Test 4: Check if employees table exists
$result2 = $conn->query("SHOW TABLES LIKE 'employees'");
$employeesTableExists = $result2 && $result2->num_rows > 0;

// Test 5: Try a simple query
$testQuery = $conn->query("SELECT COUNT(*) as count FROM users");
$userCount = 0;
if ($testQuery) {
    $row = $testQuery->fetch_assoc();
    $userCount = $row['count'];
}

echo json_encode([
    'success' => true,
    'database' => 'dayflow',
    'connection_status' => 'Connected',
    'users_table_exists' => $usersTableExists,
    'employees_table_exists' => $employeesTableExists,
    'user_count' => $userCount,
    'php_version' => phpversion()
]);

$conn->close();
?>
