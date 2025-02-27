<?php
require_once '../includes/config.php';

// Get chapter and verse parameters
$chapter = isset($_GET['chapter']) ? intval($_GET['chapter']) : null;
$verse = isset($_GET['verse']) ? intval($_GET['verse']) : null;
$practice_type = isset($_GET['type']) ? $_GET['type'] : 'recitation';

// Validate practice type
$valid_types = ['recitation', 'reflection', 'meditation'];
if (!in_array($practice_type, $valid_types)) {
    $practice_type = 'recitation';
}

// Set page variables
if ($chapter && $verse) {
    $verse_data = getVerse($chapter, $verse);
    $page_title = "Practice $practice_type - Chapter $chapter, Verse $verse | GyanGita";
    $page_description = "Practice $practice_type with Bhagavad Gita Chapter $chapter, Verse $verse. Deepen your understanding through guided practice.";
} else {
    $page_title = "Practice Bhagavad Gita | GyanGita";
    $page_description = "Deepen your understanding of Bhagavad Gita through guided practice sessions including recitation, reflection, and meditation.";
}

// Scripts
$page_scripts = [
    '/assets/js/practice.js'
];

include '../includes/header.php';
include '../includes/nav.php';
?>

<!-- Main Content -->
<main class="container mx-auto px-4 py-12" id="main-content">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-center text-orange-800 mb-8">
            Practice & Reflection
        </h1>
        
        <?php if (!$chapter || !$verse): ?>
        <!-- Practice Modes Selection -->
        <div class="grid md:grid-cols-3 gap-8 mb-16">
            <!-- Recitation Mode -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div class="h-48 bg-orange-100 flex items-center justify-center">
                    <i class="fas fa-microphone-alt text-6xl text-orange-500"></i>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Recitation Practice</h3>
                    <p class="text-gray-600 mb-4">Practice pronunciation and memorization of Sanskrit verses.</p>
                    <a href="/pages/browse.php" class="block w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors text-center">
                        Select Verse
                    </a>
                </div>
            </div>
            
            <!-- Reflection Mode -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div class="h-48 bg-green-100 flex items-center justify-center">
                    <i class="fas fa-brain text-6xl text-green-500"></i>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Guided Reflection</h3>
                    <p class="text-gray-600 mb-4">Reflect on verse meanings with guided prompts and journaling.</p>
                    <a href="/pages/browse.php" class="block w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-center">
                        Select Verse
                    </a>
                </div>
            </div>
            
            <!-- Meditation Mode -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div class="h-48 bg-blue-100 flex items-center justify-center">
                    <i class="fas fa-om text-6xl text-blue-500"></i>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Verse Meditation</h3>
                    <p class="text-gray-600 mb-4">Guided meditation sessions centered on key verses and themes.</p>
                    <a href="/pages/browse.php" class="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-center">
                        Select Verse
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Recommended Practice Verses -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-16">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Recommended Verses for Practice</h2>
            <div class="grid md:grid-cols-2 gap-6" id="recommended-practice-verses">
                <!-- Loading indicator -->
                <div class="md:col-span-2 flex justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
            </div>
        </div>
        
        <!-- Practice Stats -->
        <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Your Practice Journey</h2>
            
            <!-- Stats Overview -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-orange-50 p-4 rounded-lg text-center">
                    <h3 class="text-lg font-medium text-orange-800 mb-1">Days Streak</h3>
                    <p class="text-3xl font-bold text-orange-600" id="days-streak">0</p>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg text-center">
                    <h3 class="text-lg font-medium text-orange-800 mb-1">Verses Practiced</h3>
                    <p class="text-3xl font-bold text-orange-600" id="verses-practiced">0</p>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg text-center">
                    <h3 class="text-lg font-medium text-orange-800 mb-1">Practice Minutes</h3>
                    <p class="text-3xl font-bold text-orange-600" id="practice-minutes">0</p>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg text-center">
                    <h3 class="text-lg font-medium text-orange-800 mb-1">Chapters Explored</h3>
                    <p class="text-3xl font-bold text-orange-600" id="chapters-explored">0</p>
                </div>
            </div>
            
            <!-- Practice Calendar -->
            <div id="practice-calendar-container">
                <h3 class="text-lg font-medium text-gray-800 mb-4">Your Practice Calendar</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div id="practice-calendar" class="grid grid-cols-7 gap-2">
                        <!-- Calendar will be populated by JavaScript -->
                    </div>
                </div>
            </div>
        </div>
        
        <?php else: ?>
        <!-- Practice Session for Specific Verse -->
        <div class="mb-8">
            <!-- Practice Type Tabs -->
            <div class="flex border-b border-gray-200">
                <a href="/pages/practice.php?chapter=<?php echo $chapter; ?>&verse=<?php echo $verse; ?>&type=recitation" 
                   class="py-4 px-6 border-b-2 <?php echo $practice_type === 'recitation' ? 'border-orange-600 text-orange-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'; ?>">
                    <i class="fas fa-microphone-alt mr-2"></i>
                    Recitation
                </a>
                <a href="/pages/practice.php?chapter=<?php echo $chapter; ?>&verse=<?php echo $verse; ?>&type=reflection" 
                   class="py-4 px-6 border-b-2 <?php echo $practice_type === 'reflection' ? 'border-green-600 text-green-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'; ?>">
                    <i class="fas fa-brain mr-2"></i>
                    Reflection
                </a>
                <a href="/pages/practice.php?chapter=<?php echo $chapter; ?>&verse=<?php echo $verse; ?>&type=meditation" 
                   class="py-4 px-6 border-b-2 <?php echo $practice_type === 'meditation' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'; ?>">
                    <i class="fas fa-om mr-2"></i>
                    Meditation
                </a>
            </div>
        </div>
        
        <!-- Practice Content -->
        <div id="practice-content" 
             data-chapter="<?php echo $chapter; ?>" 
             data-verse="<?php echo $verse; ?>" 
             data-type="<?php echo $practice_type; ?>">
            <!-- Content will be loaded by JavaScript -->
            <div class="flex justify-center items-center p-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        </div>
        <?php endif; ?>
    </div>
</main>

<?php include '../includes/footer.php'; ?>