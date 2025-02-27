<?php
require_once '../includes/config.php';

// Check for chapter and verse parameters
$chapter = isset($_GET['chapter']) ? intval($_GET['chapter']) : null;
$verse = isset($_GET['verse']) ? intval($_GET['verse']) : null;

// Set page variables based on parameters
if ($chapter && $verse) {
    // Single verse view
    $verse_data = getVerse($chapter, $verse);
    $page_title = "Chapter $chapter, Verse $verse - Bhagavad Gita | GyanGita";
    $page_description = "Explore Bhagavad Gita Chapter $chapter, Verse $verse with Sanskrit text, transliteration, and multiple translations. Find divine wisdom and guidance.";
    $page_mode = 'verse';
} elseif ($chapter) {
    // Chapter view
    $chapter_info = getChapterInfo($chapter);
    $page_title = "Chapter $chapter: " . ($chapter_info['name'] ?? 'Bhagavad Gita') . " | GyanGita";
    $page_description = "Explore Bhagavad Gita Chapter $chapter with detailed verses, translations, and spiritual insights. Discover the wisdom of Krishna's teachings.";
    $page_mode = 'chapter';
} else {
    // Chapters overview
    $page_title = "Browse Bhagavad Gita Chapters | GyanGita";
    $page_description = "Explore all 18 chapters of Bhagavad Gita with their names, summaries, and key teachings. Navigate the divine dialogue between Krishna and Arjuna.";
    $page_mode = 'chapters';
}

// Include scripts
$page_scripts = [
    '/assets/js/verse-display.js'
];

include '../includes/header.php';
include '../includes/nav.php';
?>

<!-- Main Content -->
<main class="container mx-auto px-4 py-12" id="main-content">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-orange-800 mb-8 text-center">
            Browse Bhagavad Gita
        </h1>
        
        <!-- Navigation Breadcrumb -->
        <div class="flex items-center space-x-2 mb-8 text-gray-600">
            <a href="/pages/browse.php" class="hover:text-orange-600 transition-colors">Chapters</a>
            
            <?php if ($chapter): ?>
            <span><i class="fas fa-chevron-right text-sm"></i></span>
            <a href="/pages/browse.php?chapter=<?php echo $chapter; ?>" class="<?php echo $page_mode === 'chapter' ? 'text-orange-600 font-medium' : 'hover:text-orange-600 transition-colors'; ?>">
                Chapter <?php echo $chapter; ?>
            </a>
            <?php endif; ?>
            
            <?php if ($verse): ?>
            <span><i class="fas fa-chevron-right text-sm"></i></span>
            <span class="text-orange-600 font-medium">Verse <?php echo $verse; ?></span>
            <?php endif; ?>
        </div>

        <?php if ($page_mode === 'chapters'): ?>
        <!-- Chapters Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            <?php for($i = 1; $i <= 18; $i++): 
                $chapter_data = getChapterInfo($i);
                $chapter_name = isset($chapter_data['name']) ? $chapter_data['name'] : "Chapter $i";
                $verse_count = getVerseCount($i);
            ?>
            <a href="/pages/browse.php?chapter=<?php echo $i; ?>" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center">
                <div class="text-3xl text-orange-600 mb-2"><?php echo $i; ?></div>
                <div class="font-semibold text-gray-800 mb-1"><?php echo sanitize_output($chapter_name); ?></div>
                <div class="text-gray-500 text-sm"><?php echo $verse_count; ?> verses</div>
            </a>
            <?php endfor; ?>
        </div>
        
        <!-- Chapter Overview -->
        <div class="bg-white rounded-xl shadow-md p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">About Bhagavad Gita</h2>
            <p class="text-gray-700 mb-4">
                The Bhagavad Gita, often referred to as the Gita, is a 700-verse Hindu scripture that is part of the Indian epic Mahabharata. It is a sacred text that contains the direct message of God.
            </p>
            <p class="text-gray-700 mb-4">
                The Gita is set in a narrative framework of a dialogue between Pandava prince Arjuna and his guide and charioteer Krishna, who is the Supreme Personality of Godhead. Facing the duty as a warrior to fight the Dharma Yudhha or righteous war between Pandavas and Kauravas, Arjuna is counseled by Krishna to fulfill his Kshatriya (warrior) duty as a warrior.
            </p>
            <p class="text-gray-700">
                The Bhagavad Gita presents a synthesis of Hindu ideas about dharma, theistic bhakti, and the yogic ideals of moksha. The text covers jnana, bhakti, karma, and raja yogas, incorporating ideas from the Samkhya-Yoga philosophy.
            </p>
        </div>
        
        <?php elseif ($page_mode === 'chapter'): ?>
        <!-- Chapter Info -->
        <div class="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 class="text-2xl font-semibold text-orange-800 mb-4">
                Chapter <?php echo $chapter; ?>: <?php echo isset($chapter_info['name']) ? sanitize_output($chapter_info['name']) : ""; ?>
            </h2>
            <?php if (isset($chapter_info['meaning'])): ?>
            <p class="text-gray-700 mb-4">
                <strong>Translation:</strong> <?php echo sanitize_output($chapter_info['meaning']); ?>
            </p>
            <?php endif; ?>
            
            <?php if (isset($chapter_info['summary'])): ?>
            <div class="mb-6">
                <h3 class="text-lg font-medium text-gray-800 mb-2">Chapter Summary</h3>
                <p class="text-gray-700"><?php echo sanitize_output($chapter_info['summary']); ?></p>
            </div>
            <?php endif; ?>
            
            <div>
                <h3 class="text-lg font-medium text-gray-800 mb-2">Verses in this Chapter</h3>
                <p class="text-gray-700">
                    Total: <span class="font-medium"><?php echo getVerseCount($chapter); ?> verses</span>
                </p>
            </div>
        </div>
        
        <!-- Verses Grid -->
        <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
            <?php 
            $verse_count = getVerseCount($chapter);
            for($i = 1; $i <= $verse_count; $i++): 
            ?>
            <a href="/pages/browse.php?chapter=<?php echo $chapter; ?>&verse=<?php echo $i; ?>" 
               class="bg-white rounded-lg shadow-md p-4 hover:bg-orange-50 hover:shadow-lg transition-colors text-center">
                <div class="text-lg text-orange-600"><?php echo $i; ?></div>
            </a>
            <?php endfor; ?>
        </div>
        
        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center">
            <?php if ($chapter > 1): ?>
            <a href="/pages/browse.php?chapter=<?php echo $chapter - 1; ?>" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <i class="fas fa-chevron-left mr-2"></i>
                <span>Previous Chapter</span>
            </a>
            <?php else: ?>
            <div></div>
            <?php endif; ?>
            
            <?php if ($chapter < 18): ?>
            <a href="/pages/browse.php?chapter=<?php echo $chapter + 1; ?>" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <span>Next Chapter</span>
                <i class="fas fa-chevron-right ml-2"></i>
            </a>
            <?php else: ?>
            <div></div>
            <?php endif; ?>
        </div>
        
        <?php elseif ($page_mode === 'verse'): ?>
        <!-- Single Verse Display -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-8">
                <h2 class="text-2xl font-semibold text-orange-800 mb-6">
                    Chapter <?php echo $chapter; ?>, Verse <?php echo $verse; ?>
                </h2>
                
                <!-- Sanskrit & Transliteration -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-800 mb-3">Sanskrit</h3>
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <?php if (isset($verse_data['slok'])): ?>
                        <p class="text-gray-800 font-sanskrit text-xl mb-4 leading-relaxed"><?php echo sanitize_output($verse_data['slok']); ?></p>
                        <?php endif; ?>
                        
                        <?php if (isset($verse_data['transliteration'])): ?>
                        <div class="border-t border-orange-200 pt-4">
                            <h4 class="text-md font-medium text-gray-700 mb-2">Transliteration</h4>
                            <p class="text-gray-600"><?php echo sanitize_output($verse_data['transliteration']); ?></p>
                        </div>
                        <?php endif; ?>
                        
                        <!-- Audio Player -->
                        <div class="mt-4 pt-4 border-t border-orange-200">
                            <button id="play-audio-btn" class="flex items-center text-orange-700 hover:text-orange-800 transition-colors">
                                <i class="fas fa-play-circle text-2xl mr-2"></i>
                                <span>Listen to Recitation</span>
                            </button>
                            <div id="audio-player" class="hidden mt-4">
                                <audio controls class="w-full">
                                    <source src="/assets/audio/verses/ch<?php echo $chapter; ?>_v<?php echo $verse; ?>.mp3" type="audio/mpeg">
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Translations -->
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-lg font-medium text-gray-800">Translations & Commentary</h3>
                        <div class="flex text-sm">
                            <button id="all-translations" class="px-3 py-1 bg-orange-100 text-orange-800 rounded-l-lg hover:bg-orange-200 transition-colors">All</button>
                            <button id="concise-translations" class="px-3 py-1 bg-gray-100 text-gray-800 rounded-r-lg hover:bg-gray-200 transition-colors">Concise</button>
                        </div>
                    </div>
                    
                    <div class="space-y-6" id="translations-container">
                        <?php
                        $translations = [];
                        if (isset($verse_data['tej']) && isset($verse_data['tej']['ht'])) {
                            $translations[] = [
                                'author' => 'Swami Tejomayananda',
                                'text' => $verse_data['tej']['ht'],
                                'type' => 'primary'
                            ];
                        }
                        if (isset($verse_data['siva']) && isset($verse_data['siva']['et'])) {
                            $translations[] = [
                                'author' => 'Swami Sivananda',
                                'text' => $verse_data['siva']['et'],
                                'type' => 'primary'
                            ];
                        }
                        if (isset($verse_data['purohit']) && isset($verse_data['purohit']['et'])) {
                            $translations[] = [
                                'author' => 'Shri Purohit Swami',
                                'text' => $verse_data['purohit']['et'],
                                'type' => 'extended'
                            ];
                        }
                        if (isset($verse_data['chinmay']) && isset($verse_data['chinmay']['hc'])) {
                            $translations[] = [
                                'author' => 'Swami Chinmayananda',
                                'text' => $verse_data['chinmay']['hc'],
                                'type' => 'extended'
                            ];
                        }
                        if (isset($verse_data['san']) && isset($verse_data['san']['et'])) {
                            $translations[] = [
                                'author' => 'Dr.S.Sankaranarayan',
                                'text' => $verse_data['san']['et'],
                                'type' => 'extended'
                            ];
                        }
                        if (isset($verse_data['gambir']) && isset($verse_data['gambir']['et'])) {
                            $translations[] = [
                                'author' => 'Swami Gambirananda',
                                'text' => $verse_data['gambir']['et'],
                                'type' => 'extended'
                            ];
                        }
                        
                        // Display translations
                        foreach ($translations as $translation):
                            $class = $translation['type'] === 'extended' ? 'extended-translation' : '';
                        ?>
                        <div class="bg-orange-50 p-4 rounded-lg <?php echo $class; ?>">
                            <p class="font-medium text-orange-800 mb-2"><?php echo sanitize_output($translation['author']); ?></p>
                            <p class="text-gray-700"><?php echo sanitize_output($translation['text']); ?></p>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="flex flex-wrap justify-center gap-4 pt-6 border-t border-gray-200">
                    <button id="bookmark-verse" class="px-6 py-3 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors flex items-center space-x-2">
                        <i class="far fa-bookmark"></i>
                        <span>Save to Favorites</span>
                    </button>
                    
                    <a href="/pages/practice.php?chapter=<?php echo $chapter; ?>&verse=<?php echo $verse; ?>" class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                        <i class="fas fa-om"></i>
                        <span>Practice This Verse</span>
                    </a>
                    
                    <button id="share-verse" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <i class="fas fa-share-alt"></i>
                        <span>Share Verse</span>
                    </button>
                </div>
            </div>
            
            <!-- Navigation -->
            <div class="bg-gray-50 p-4 border-t border-gray-200">
                <div class="flex justify-between items-center">
                    <?php if ($verse > 1): ?>
                    <a href="/pages/browse.php?chapter=<?php echo $chapter; ?>&verse=<?php echo $verse - 1; ?>" class="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                        <i class="fas fa-chevron-left mr-2"></i>
                        <span>Previous Verse</span>
                    </a>
                    <?php else: ?>
                    <div></div>
                    <?php endif; ?>
                    
                    <?php 
                    $max_verse = getVerseCount($chapter);
                    if ($verse < $max_verse): 
                    ?>
                    <a href="/pages/browse.php?chapter=<?php echo $chapter; ?>&verse=<?php echo $verse + 1; ?>" class="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                        <span>Next Verse</span>
                        <i class="fas fa-chevron-right ml-2"></i>
                    </a>
                    <?php else: ?>
                    <div></div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <!-- Related Verses -->
        <div class="mt-12">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">You May Also Like</h2>
            <div id="related-verses" class="grid md:grid-cols-2 gap-6">
                <!-- Will be populated via JavaScript -->
                <div class="animate-pulse bg-white p-6 rounded-lg shadow-md">
                    <div class="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div class="animate-pulse bg-white p-6 rounded-lg shadow-md">
                    <div class="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        </div>
        <?php endif; ?>
    </div>
</main>

<?php if ($page_mode === 'verse'): ?>
<!-- Schema Markup for Verse -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Chapter",
    "name": "Chapter <?php echo $chapter; ?>, Verse <?php echo $verse; ?> - Bhagavad Gita",
    "position": <?php echo $chapter; ?>,
    "isPartOf": {
        "@type": "Book",
        "name": "Bhagavad Gita",
        "author": {
            "@type": "Person",
            "name": "Vyasa"
        }
    },
    "description": "<?php 
        if (isset($verse_data['siva']) && isset($verse_data['siva']['et'])) {
            echo sanitize_output(substr($verse_data['siva']['et'], 0, 150)) . '...';
        } else {
            echo "Bhagavad Gita Chapter $chapter, Verse $verse with translations and commentary.";
        }
    ?>"
}
</script>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Audio player toggle
    const playAudioBtn = document.getElementById('play-audio-btn');
    const audioPlayer = document.getElementById('audio-player');
    
    if (playAudioBtn && audioPlayer) {
        playAudioBtn.addEventListener('click', function() {
            if (audioPlayer.classList.contains('hidden')) {
                audioPlayer.classList.remove('hidden');
                
                // Try to play
                const audio = audioPlayer.querySelector('audio');
                if (audio) {
                    audio.play().catch(error => {
                        console.warn('Audio playback error:', error);
                        // Show a message
                        audioPlayer.innerHTML = `
                            <p class="text-sm text-orange-600 text-center">
                                <i class="fas fa-info-circle mr-1"></i>
                                Audio coming soon. We're working on adding recitations.
                            </p>
                        `;
                    });
                }
            } else {
                audioPlayer.classList.add('hidden');
                
                // Stop playing
                const audio = audioPlayer.querySelector('audio');
                if (audio) {
                    audio.pause();
                }
            }
        });
    }
    
    // Translation view toggle
    const allTranslationsBtn = document.getElementById('all-translations');
    const conciseTranslationsBtn = document.getElementById('concise-translations');
    const extendedTranslations = document.querySelectorAll('.extended-translation');
    
    if (allTranslationsBtn && conciseTranslationsBtn && extendedTranslations) {
        allTranslationsBtn.addEventListener('click', function() {
            allTranslationsBtn.classList.replace('bg-gray-100', 'bg-orange-100');
            allTranslationsBtn.classList.replace('text-gray-800', 'text-orange-800');
            conciseTranslationsBtn.classList.replace('bg-orange-100', 'bg-gray-100');
            conciseTranslationsBtn.classList.replace('text-orange-800', 'text-gray-800');
            
            extendedTranslations.forEach(el => el.style.display = 'block');
        });
        
        conciseTranslationsBtn.addEventListener('click', function() {
            conciseTranslationsBtn.classList.replace('bg-gray-100', 'bg-orange-100');
            conciseTranslationsBtn.classList.replace('text-gray-800', 'text-orange-800');
            allTranslationsBtn.classList.replace('bg-orange-100', 'bg-gray-100');
            allTranslationsBtn.classList.replace('text-orange-800', 'text-gray-800');
            
            extendedTranslations.forEach(el => el.style.display = 'none');
        });
    }
    
    // Bookmark functionality
    const bookmarkBtn = document.getElementById('bookmark-verse');
    if (bookmarkBtn) {
        const chapter = <?php echo $chapter; ?>;
        const verse = <?php echo $verse; ?>;
        
        // Check if already bookmarked
        if (isFavoriteVerse(chapter, verse)) {
            bookmarkBtn.innerHTML = `
                <i class="fas fa-bookmark"></i>
                <span>Saved to Favorites</span>
            `;
            bookmarkBtn.classList.replace('bg-orange-100', 'bg-orange-200');
        }
        
        bookmarkBtn.addEventListener('click', function() {
            toggleFavorite(chapter, verse);
            
            if (isFavoriteVerse(chapter, verse)) {
                this.innerHTML = `
                    <i class="fas fa-bookmark"></i>
                    <span>Saved to Favorites</span>
                `;
                this.classList.replace('bg-orange-100', 'bg-orange-200');
            } else {
                this.innerHTML = `
                    <i class="far fa-bookmark"></i>
                    <span>Save to Favorites</span>
                `;
                this.classList.replace('bg-orange-200', 'bg-orange-100');
            }
        });
    }
    
    // Share functionality
    const shareBtn = document.getElementById('share-verse');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            shareVerse(<?php echo $chapter; ?>, <?php echo $verse; ?>);
        });
    }
    
    // Load related verses
    loadRelatedVerses(<?php echo $chapter; ?>, <?php echo $verse; ?>);
});

// Load related verses
function loadRelatedVerses(chapter, verse) {
    const relatedVersesContainer = document.getElementById('related-verses');
    if (!relatedVersesContainer) return;
    
    // In a real implementation, this would be an API call to get related verses
    // For demo, we'll use random verses from the same chapter
    setTimeout(() => {
        const maxVerse = <?php echo getVerseCount($chapter); ?>;
        const relatedVerses = [];
        
        // Get 2 random verses from the same chapter (excluding current verse)
        while (relatedVerses.length < 2 && maxVerse > 1) {
            const randomVerse = Math.floor(Math.random() * maxVerse) + 1;
            if (randomVerse !== verse && !relatedVerses.includes(randomVerse)) {
                relatedVerses.push(randomVerse);
            }
        }
        
        // If couldn't find 2 random verses, add from next chapter
        if (relatedVerses.length < 2 && chapter < 18) {
            relatedVerses.push({
                chapter: chapter + 1,
                verse: 1
            });
        }
        
        // Create HTML
        let html = '';
        
        relatedVerses.forEach(relatedVerse => {
            const verseNum = typeof relatedVerse === 'object' ? relatedVerse.verse : relatedVerse;
            const chapterNum = typeof relatedVerse === 'object' ? relatedVerse.chapter : chapter;
            
            html += `
                <a href="/pages/browse.php?chapter=${chapterNum}&verse=${verseNum}" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 class="text-lg font-medium text-orange-800 mb-2">Chapter ${chapterNum}, Verse ${verseNum}</h3>
                    <p class="text-gray-600">Click to explore this verse and its translations</p>
                </a>
            `;
        });
        
        relatedVersesContainer.innerHTML = html;
    }, 1000);
}
</script>
<?php endif; ?>

<?php include '../includes/footer.php'; ?>