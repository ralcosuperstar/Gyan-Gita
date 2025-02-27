<?php
// General Settings
define('SITE_TITLE', 'GyanGita - Divine Wisdom from Bhagavad Gita');
define('SITE_DESCRIPTION', 'Discover relevant wisdom from the Bhagavad Gita based on your emotional state. Find peace, purpose, and clarity through ancient wisdom.');
define('SITE_URL', 'https://gyangita.com');
define('API_BASE_URL', 'https://vedicscriptures.github.io');

// Cache Settings
define('CACHE_ENABLED', true);
define('CACHE_DURATION', 86400); // 24 hours in seconds
define('CACHE_DIR', $_SERVER['DOCUMENT_ROOT'] . '/cache/');

// SEO Settings
$meta_keywords = 'bhagavad gita, gita wisdom, spiritual guidance, hindu scripture, krishna teachings, emotional guidance, spiritual peace, indian philosophy';

// Create cache directory if it doesn't exist
if (CACHE_ENABLED && !is_dir(CACHE_DIR)) {
    mkdir(CACHE_DIR, 0755, true);
}

// API Functionality
function fetchFromAPI($endpoint) {
    $cache_file = CACHE_DIR . md5($endpoint) . '.json';
    
    // Return cached content if available and valid
    if (CACHE_ENABLED && file_exists($cache_file) && (time() - filemtime($cache_file) < CACHE_DURATION)) {
        return json_decode(file_get_contents($cache_file), true);
    }
    
    // Otherwise fetch from API
    $response = file_get_contents(API_BASE_URL . $endpoint);
    $data = json_decode($response, true);
    
    // Cache the response
    if (CACHE_ENABLED && !empty($data)) {
        file_put_contents($cache_file, $response);
    }
    
    return $data;
}

// Get verse by chapter and verse number
function getVerse($chapter, $verse) {
    return fetchFromAPI("/slok/$chapter/$verse");
}

// Get chapter info
function getChapterInfo($chapter) {
    return fetchFromAPI("/chapter/$chapter");
}

// Get total verses in chapter
function getVerseCount($chapter) {
    $verse_counts = [
        1 => 47, 2 => 72, 3 => 43, 4 => 42, 5 => 29, 6 => 47,
        7 => 30, 8 => 28, 9 => 34, 10 => 42, 11 => 55, 12 => 20,
        13 => 35, 14 => 27, 15 => 20, 16 => 24, 17 => 28, 18 => 78
    ];
    
    return isset($verse_counts[$chapter]) ? $verse_counts[$chapter] : 0;
}

// Load mood data
function getMoodData() {
    $json_file = $_SERVER['DOCUMENT_ROOT'] . '/assets/js/moods.json';
    if (file_exists($json_file)) {
        return json_decode(file_get_contents($json_file), true);
    }
    return [];
}

// Sanitize output for security
function sanitize_output($output) {
    return htmlspecialchars($output, ENT_QUOTES, 'UTF-8');
}

// Generate canonical URL
function canonical_url() {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $uri = $_SERVER['REQUEST_URI'];
    return $protocol . '://' . $host . $uri;
}
?>