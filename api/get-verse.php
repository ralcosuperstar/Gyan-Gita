<?php
/**
 * API endpoint to get a verse by chapter and verse number
 */

// Include configuration
require_once '../includes/config.php';

// Set headers to allow cross-origin requests (if needed)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Get request parameters
$chapter = isset($_GET['chapter']) ? intval($_GET['chapter']) : null;
$verse = isset($_GET['verse']) ? intval($_GET['verse']) : null;

// Validate parameters
if (!$chapter || !$verse) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required parameters: chapter and verse'
    ]);
    exit;
}

try {
    // Get verse data
    $verse_data = getVerse($chapter, $verse);
    
    // Check if verse exists
    if (empty($verse_data)) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => "Verse not found (Chapter $chapter, Verse $verse)"
        ]);
        exit;
    }
    
    // Add additional metadata
    $verse_data['meta'] = [
        'chapter' => $chapter,
        'verse' => $verse,
        'fetched_at' => date('Y-m-d H:i:s')
    ];
    
    // Return verse data
    echo json_encode([
        'status' => 'success',
        'data' => $verse_data
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>