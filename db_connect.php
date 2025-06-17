<?php
// Database connection parameters
$host = 'localhost';           // Database host
$dbname = 'tae_database';      // Your database name
$username = 'root';            // Your database username
$password = '';                // Your database password (leave empty if none)

// Create connection using PDO for modern, secure database access
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    // Set PDO error mode to exception for better error handling
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Optional: Set default fetch mode to associative array
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    // Connection success (optional debug)
    // echo "Connected successfully";
} catch (PDOException $e) {
    // Connection failed - handle error gracefully
    die("Database connection failed: " . $e->getMessage());
}
?>
