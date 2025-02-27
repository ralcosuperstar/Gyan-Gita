<?php
/**
 * API endpoint to save user preferences
 */

// Include configuration
require_once '../includes/config.php';

// Set headers to allow cross-origin requests (if needed)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit;
}

// Get JSON data from request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Validate user data
if (!isset($data['user_id']) || empty($data['user_id'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required parameter: user_id'
    ]);
    exit;
}

try {
    // Extract data
    $user_id = trim($data['user_id']);
    $preferences = isset($data['preferences']) ? $data['preferences'] : [];
    $theme = isset($data['theme']) ? trim($data['theme']) : 'light';
    $display_mode = isset($data['display_mode']) ? trim($data['display_mode']) : 'card';
    
    // In a real implementation, you would save these to a database
    // For this demo, we'll simulate success but won't actually persist data
    
    // Directory to store user preferences (create if it doesn't exist)
    $user_dir = $_SERVER['DOCUMENT_ROOT'] . '/user_data';
    if (!is_dir($user_dir)) {
        mkdir($user_dir, 0755, true);
    }
    
    // File to store user preferences (simulating a database)
    $user_file = $user_dir . '/' . md5($user_id) . '.json';
    
    // Prepare data to save
    $save_data = [
        'user_id' => $user_id,
        'preferences' => $preferences,
        'theme' => $theme,
        'display_mode' => $display_mode,
        'updated_at' => date('Y-m-d H:i:s')
    ];
    
    // Save to file (simulating database save)
    file_put_contents($user_file, json_encode($save_data));
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Preferences saved successfully',
        'data' => $save_data
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>