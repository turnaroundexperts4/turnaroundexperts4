<?php
require_once 'db_connect.php'; // Include the database connection script

try {
    // Prepare and execute the SQL query
    $stmt = $pdo->query("SELECT id, name, email, company, created_at FROM users");
    $users = $stmt->fetchAll(); // Fetch all results

    // Set the content type to JSON
    header('Content-Type: application/json');
    echo json_encode($users); // Output the results as JSON
} catch (PDOException $e) {
    // Handle any errors
    echo json_encode(['error' => $e->getMessage()]);
}
?>
