<?php
header('Content-Type: application/json');
require_once 'config.php';

$admin_id = isset($_GET['admin_id']) ? intval($_GET['admin_id']) : 1;

// Get admin activity log
$query = "SELECT id, action, details, timestamp 
          FROM admin_activity_log 
          WHERE admin_id = ? 
          ORDER BY timestamp DESC 
          LIMIT 50";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $admin_id);
$stmt->execute();
$result = $stmt->get_result();

$activities = [];
while ($row = $result->fetch_assoc()) {
    $activities[] = $row;
}

if (count($activities) > 0) {
    echo json_encode(['success' => true, 'data' => $activities]);
} else {
    echo json_encode(['success' => true, 'data' => [], 'message' => 'No activities found']);
}

$stmt->close();
$conn->close();
?>
