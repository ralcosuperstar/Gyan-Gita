<?php
// Verse card template for consistent display of verses
// Parameters:
// - $verse: Verse data from API
// - $chapter: Chapter number
// - $verse_num: Verse number
// - $display_mode: Card display mode ('full', 'compact', or 'minimal')

// Set defaults
if (!isset($display_mode)) {
    $display_mode = 'full';
}

// Extract translations
$translations = [];
if (isset($verse['tej']) && isset($verse['tej']['ht'])) {
    $translations[] = [
        'author' => 'Swami Tejomayananda',
        'text' => $verse['tej']['ht']
    ];
}
if (isset($verse['siva']) && isset($verse['siva']['et'])) {
    $translations[] = [
        'author' => 'Swami Sivananda',
        'text' => $verse['siva']['et']
    ];
}
if (isset($verse['purohit']) && isset($verse['purohit']['et'])) {
    $translations[] = [
        'author' => 'Shri Purohit Swami',
        'text' => $verse['purohit']['et']
    ];
}
?>

<div class="verse-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-orange-800">
            Chapter <span class="chapter-num"><?php echo sanitize_output($chapter); ?></span>, 
            Verse <span class="verse-num"><?php echo sanitize_output($verse_num); ?></span>
        </h3>
        <div class="flex space-x-2">
            <button class="play-audio-btn p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors" aria-label="Play audio">
                <i class="fas fa-volume-up"></i>
            </button>
            <button class="bookmark-btn p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors" aria-label="Bookmark verse">
                <i class="far fa-bookmark"></i>
            </button>
            <button class="share-btn p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors" aria-label="Share verse">
                <i class="fas fa-share-alt"></i>
            </button>
        </div>
    </div>
    <div class="space-y-4">
        <?php if ($display_mode !== 'minimal'): ?>
        <div class="bg-orange-50 rounded-lg p-4 relative">
            <p class="verse-sanskrit text-gray-800 font-sanskrit mb-2"><?php echo sanitize_output($verse['slok'] ?? ''); ?></p>
            <p class="verse-transliteration text-gray-600 text-sm"><?php echo sanitize_output($verse['transliteration'] ?? ''); ?></p>
            
            <!-- Audio Player (Hidden Initially) -->
            <div class="audio-player hidden mt-4 pt-4 border-t border-orange-200">
                <audio controls class="w-full">
                    <source src="" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
        <?php endif; ?>
        
        <div class="space-y-2">
            <?php if (!empty($translations)): ?>
                <p class="verse-translation text-gray-700"><?php echo sanitize_output($translations[0]['text']); ?></p>
                <?php if ($display_mode === 'full' && count($translations) > 1): ?>
                <div class="verse-commentary text-gray-600 italic text-sm mt-3">
                    <p><strong><?php echo sanitize_output($translations[1]['author']); ?>:</strong> <?php echo sanitize_output($translations[1]['text']); ?></p>
                </div>
                <?php endif; ?>
            <?php endif; ?>
            
            <?php if (isset($verse_theme) && $display_mode === 'full'): ?>
            <!-- Theme Tag -->
            <div class="mt-4 flex items-center">
                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    <i class="fas fa-tag mr-1"></i>
                    <span class="verse-theme"><?php echo sanitize_output($verse_theme); ?></span>
                </span>
            </div>
            <?php endif; ?>
        </div>
        
        <div class="pt-4 flex justify-between">
            <a href="/pages/browse.php?chapter=<?php echo $chapter; ?>&verse=<?php echo $verse_num; ?>" class="read-more-btn px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Read More
            </a>
            
            <?php if ($display_mode === 'full'): ?>
            <!-- Practice Button -->
            <a href="/pages/practice.php?chapter=<?php echo $chapter; ?>&verse=<?php echo $verse_num; ?>" class="practice-btn px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors flex items-center">
                <i class="fas fa-om mr-2"></i>
                <span>Practice</span>
            </a>
            <?php endif; ?>
        </div>
    </div>
</div>