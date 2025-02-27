<?php
/**
 * API endpoint to get verses by mood or emotional state
 */

// Include configuration
require_once '../includes/config.php';

// Set headers to allow cross-origin requests (if needed)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Get request parameters
$mood = isset($_GET['mood']) ? trim($_GET['mood']) : null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 5; // Default to 5 verses
$user_id = isset($_GET['user_id']) ? trim($_GET['user_id']) : null; // For personalized recommendations

// Validate parameters
if (!$mood) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required parameter: mood'
    ]);
    exit;
}

try {
    // Get mood data
    $moods_data = getMoodData();
    
    // Find the requested mood
    $mood_found = false;
    $verses = [];
    
    foreach ($moods_data['moods'] as $mood_item) {
        if (strtolower($mood_item['name']) === strtolower($mood)) {
            $mood_found = true;
            $verses = $mood_item['verses'];
            break;
        }
    }
    
    // If mood not found
    if (!$mood_found) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => "Mood not found: $mood"
        ]);
        exit;
    }
    
    // Limit results if needed
    if (count($verses) > $limit) {
        $verses = array_slice($verses, 0, $limit);
    }
    
    // Fetch full verse data for each reference
    $full_verses = [];
    foreach ($verses as $verse) {
        $chapter = isset($verse['chapter']) ? $verse['chapter'] : null;
        $verse_num = isset($verse['text']) ? $verse['text'] : null;
        
        if ($chapter && $verse_num) {
            $verse_data = getVerse($chapter, $verse_num);
            
            if (!empty($verse_data)) {
                $verse_data['meta'] = [
                    'chapter' => $chapter,
                    'verse' => $verse_num,
                    'theme' => isset($verse['theme']) ? $verse['theme'] : null
                ];
                
                $full_verses[] = $verse_data;
            }
        }
    }
    
    // Apply personalization if user_id provided (in a real implementation)
    if ($user_id) {
        // This is a placeholder for actual personalization logic
        // In a real implementation, you would fetch user preferences and history
        // and adjust recommendations accordingly
        usort($full_verses, function($a, $b) {
            // Example: randomize order slightly for personalization
            return mt_rand(-1, 1); 
        });
    }
    
    // Return verse data
    echo json_encode([
        'status' => 'success',
        'mood' => $mood,
        'count' => count($full_verses),
        'verses' => $full_verses
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>