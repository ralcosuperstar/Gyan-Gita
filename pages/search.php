<?php
require_once '../includes/config.php';

// Get search query
$query = isset($_GET['q']) ? trim($_GET['q']) : '';

// SEO settings
$page_title = $query ? "Search results for '$query' - GyanGita" : "Search Bhagavad Gita - GyanGita";
$page_description = $query ? 
    "Explore Bhagavad Gita verses containing '$query'. Find divine wisdom and guidance related to your search query." : 
    "Search through the entire Bhagavad Gita by keywords, topics, or concepts to find relevant verses and wisdom.";

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
            Search Bhagavad Gita
        </h1>
        
        <!-- Search Form -->
        <div class="mb-12">
            <form action="/pages/search.php" method="GET" class="relative">
                <input type="text" name="q" value="<?php echo sanitize_output($query); ?>"
                       class="w-full p-4 pl-12 pr-20 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                       placeholder="Search for keywords, topics, or concepts..."
                       required>
                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-600">
                    <i class="fas fa-search"></i>
                </div>
                <button type="submit" class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Search
                </button>
            </form>
        </div>
        
        <?php if (!$query): ?>
        <!-- Search Tips -->
        <div class="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Search Tips</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-medium text-orange-800 mb-3">Suggested Topics</h3>
                    <ul class="space-y-2">
                        <li><a href="/pages/search.php?q=karma" class="text-orange-600 hover:underline">Karma (Action)</a></li>
                        <li><a href="/pages/search.php?q=dharma" class="text-orange-600 hover:underline">Dharma (Duty)</a></li>
                        <li><a href="/pages/search.php?q=bhakti" class="text-orange-600 hover:underline">Bhakti (Devotion)</a></li>
                        <li><a href="/pages/search.php?q=yoga" class="text-orange-600 hover:underline">Yoga (Union)</a></li>
                        <li><a href="/pages/search.php?q=peace" class="text-orange-600 hover:underline">Peace & Tranquility</a></li>
                        <li><a href="/pages/search.php?q=knowledge" class="text-orange-600 hover:underline">Knowledge & Wisdom</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-orange-800 mb-3">Search Effectively</h3>
                    <ul class="space-y-2 text-gray-700">
                    <li><i class="fas fa-check-circle text-green-600 mr-2"></i> Use specific keywords</li>
                        <li><i class="fas fa-check-circle text-green-600 mr-2"></i> Try both English and Sanskrit terms</li>
                        <li><i class="fas fa-check-circle text-green-600 mr-2"></i> Search for concepts (e.g., "purpose of life")</li>
                        <li><i class="fas fa-check-circle text-green-600 mr-2"></i> Include emotional states (e.g., "anxiety")</li>
                        <li><i class="fas fa-check-circle text-green-600 mr-2"></i> Use chapter and verse numbers (e.g., "2.47")</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Popular Searches -->
        <div class="bg-orange-50 rounded-xl p-6 text-center">
            <h2 class="text-xl font-medium text-gray-800 mb-4">Popular Searches</h2>
            <div class="flex flex-wrap justify-center gap-2">
                <a href="/pages/search.php?q=meditation" class="px-3 py-1 bg-white text-orange-800 rounded-full hover:bg-orange-100 transition-colors text-sm">meditation</a>
                <a href="/pages/search.php?q=purpose" class="px-3 py-1 bg-white text-orange-800 rounded-full hover:bg-orange-100 transition-colors text-sm">purpose</a>
                <a href="/pages/search.php?q=happiness" class="px-3 py-1 bg-white text-orange-800 rounded-full hover:bg-orange-100 transition-colors text-sm">happiness</a>
                <a href="/pages/search.php?q=duty" class="px-3 py-1 bg-white text-orange-800 rounded-full hover:bg-orange-100 transition-colors text-sm">duty</a>
                <a href="/pages/search.php?q=atma" class="px-3 py-1 bg-white text-orange-800 rounded-full hover:bg-orange-100 transition-colors text-sm">atma</a>
                <a href="/pages/search.php?q=love" class="px-3 py-1 bg-white text-orange-800 rounded-full hover:bg-orange-100 transition-colors text-sm">love</a>
                <a href="/pages/search.php?q=stress" class="px-3 py-1 bg-white text-orange-800 rounded-full hover:bg-orange-100 transition-colors text-sm">stress</a>
                <a href="/pages/search.php?q=attachment" class="px-3 py-1 bg-white text-orange-800 rounded-full hover:bg-orange-100 transition-colors text-sm">attachment</a>
            </div>
        </div>
        <?php else: ?>
        
        <!-- Search Results -->
        <div id="search-results">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Search Results for "<?php echo sanitize_output($query); ?>"</h2>
            
            <!-- Loading Indicator (initially shown) -->
            <div id="search-loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                <p class="text-gray-600">Searching through the wisdom of Bhagavad Gita...</p>
            </div>
            
            <!-- Results Container (initially hidden) -->
            <div id="results-container" class="hidden space-y-6">
                <!-- Will be populated via JavaScript -->
            </div>
            
            <!-- No Results Message (initially hidden) -->
            <div id="no-results" class="hidden text-center py-12 bg-orange-50 rounded-xl">
                <i class="fas fa-search text-4xl text-orange-300 mb-3"></i>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                <p class="text-gray-600 mb-4">We couldn't find any verses matching your search query.</p>
                <div class="space-y-3">
                    <p class="text-gray-600">Try:</p>
                    <ul class="text-gray-600">
                        <li>• Using different keywords</li>
                        <li>• Checking your spelling</li>
                        <li>• Using broader concepts</li>
                        <li>• Trying Sanskrit terms</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Related Searches -->
        <div id="related-searches" class="mt-12 hidden">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Related Searches</h3>
            <div class="flex flex-wrap gap-2">
                <!-- Will be populated via JavaScript -->
            </div>
        </div>
        <?php endif; ?>
    </div>
</main>

<?php if ($query): ?>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Simulate search functionality
    // In a real implementation, this would be an API call to a backend search service
    setTimeout(() => {
        const query = "<?php echo addslashes($query); ?>".toLowerCase();
        const resultsContainer = document.getElementById('results-container');
        const loadingIndicator = document.getElementById('search-loading');
        const noResultsMessage = document.getElementById('no-results');
        const relatedSearches = document.getElementById('related-searches');
        
        // Hide loading indicator
        loadingIndicator.classList.add('hidden');
        
        // Search in our predefined data (simulated for demo)
        const results = simulateSearch(query);
        
        if (results.length > 0) {
            // Show results
            resultsContainer.classList.remove('hidden');
            
            // Generate HTML for results
            let resultsHtml = '';
            results.forEach(result => {
                resultsHtml += `
                    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-lg font-medium text-orange-800">
                                <a href="/pages/browse.php?chapter=${result.chapter}&verse=${result.verse}" class="hover:underline">
                                    Chapter ${result.chapter}, Verse ${result.verse}
                                </a>
                            </h3>
                            <div class="flex space-x-2">
                                <button onclick="bookmarkResult(${result.chapter}, ${result.verse}, this)" class="p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors bookmark-btn" data-chapter="${result.chapter}" data-verse="${result.verse}">
                                    <i class="${isFavoriteVerse(result.chapter, result.verse) ? 'fas' : 'far'} fa-bookmark"></i>
                                </button>
                            </div>
                        </div>
                        <p class="text-gray-700 mb-4">${result.text}</p>
                        <div class="flex justify-between items-center">
                            <div>
                                ${result.theme ? `
                                <span class="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                    <i class="fas fa-tag mr-1"></i>
                                    ${result.theme}
                                </span>
                                ` : ''}
                            </div>
                            <a href="/pages/browse.php?chapter=${result.chapter}&verse=${result.verse}" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                Read More
                            </a>
                        </div>
                    </div>
                `;
            });
            
            resultsContainer.innerHTML = resultsHtml;
            
            // Show related searches
            generateRelatedSearches(query);
            relatedSearches.classList.remove('hidden');
        } else {
            // Show no results message
            noResultsMessage.classList.remove('hidden');
        }
    }, 1500); // Simulate loading time
});

// Function to bookmark a search result
function bookmarkResult(chapter, verse, buttonElement) {
    toggleFavorite(chapter, verse);
    
    // Update button UI
    const icon = buttonElement.querySelector('i');
    if (isFavoriteVerse(chapter, verse)) {
        icon.classList.remove('far');
        icon.classList.add('fas');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
    }
}

// Generate related searches based on the query
function generateRelatedSearches(query) {
    const relatedContainer = document.getElementById('related-searches').querySelector('div');
    if (!relatedContainer) return;
    
    // Clear container
    relatedContainer.innerHTML = '';
    
    // Define related searches based on query
    let related = [];
    
    // Simple matching for demo purposes
    if (query.includes('karma')) {
        related = ['duty', 'action', 'work', 'responsibility', 'fruits of action'];
    } else if (query.includes('peace')) {
        related = ['tranquility', 'calm mind', 'meditation', 'serenity', 'spiritual peace'];
    } else if (query.includes('knowledge')) {
        related = ['wisdom', 'jnana yoga', 'understanding', 'enlightenment', 'self-realization'];
    } else if (query.includes('love')) {
        related = ['devotion', 'bhakti', 'attachment', 'divine love', 'compassion'];
    } else {
        // Default related searches
        related = ['karma yoga', 'bhakti yoga', 'dharma', 'meditation', 'self-realization'];
    }
    
    // Add related searches to container
    related.forEach(term => {
        const link = document.createElement('a');
        link.href = `/pages/search.php?q=${encodeURIComponent(term)}`;
        link.className = 'px-3 py-1 bg-orange-50 text-orange-800 rounded-full hover:bg-orange-100 transition-colors';
        link.textContent = term;
        relatedContainer.appendChild(link);
    });
}

// Simulate search functionality (in a real app, this would be a server-side function)
function simulateSearch(query) {
    // Sample data for demonstration
    const sampleVerses = [
        {
            chapter: 2,
            verse: 47,
            text: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
            theme: "Karma Yoga"
        },
        {
            chapter: 2,
            verse: 14,
            text: "O son of Kunti, the nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons. They arise from sense perception, and one must learn to tolerate them without being disturbed.",
            theme: "Equanimity"
        },
        {
            chapter: 2,
            verse: 55,
            text: "The Supreme Personality of Godhead said: O Partha, when a man gives up all varieties of desire for sense gratification, which arise from mental concoction, and when his mind, thus purified, finds satisfaction in the self alone, then he is said to be in pure transcendental consciousness.",
            theme: "Self-Realization"
        },
        {
            chapter: 6,
            verse: 5,
            text: "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.",
            theme: "Mind Control"
        },
        {
            chapter: 9,
            verse: 22,
            text: "But those who always worship Me with exclusive devotion, meditating on My transcendental form—to them I carry what they lack, and I preserve what they have.",
            theme: "Divine Protection"
        },
        {
            chapter: 12,
            verse: 13,
            text: "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, who is tolerant, always satisfied, self-controlled, and engaged in devotional service with determination, his mind and intelligence fixed on Me—such a devotee of Mine is very dear to Me.",
            theme: "Devotee Qualities"
        },
        {
            chapter: 18,
            verse: 66,
            text: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
            theme: "Surrender"
        }
    ];
    
    // Filter verses based on query
    return sampleVerses.filter(verse => {
        const searchText = `${verse.text} ${verse.theme} chapter ${verse.chapter} verse ${verse.verse}`.toLowerCase();
        return searchText.includes(query);
    });
}
</script>
<?php endif; ?>

<?php include '../includes/footer.php'; ?>