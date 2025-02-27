<?php
require_once 'includes/config.php';

// SEO settings for homepage
$page_title = 'GyanGita - Divine Wisdom from Bhagavad Gita';
$page_description = 'Discover personalized guidance from the Bhagavad Gita based on your emotional state. Find peace, purpose, and clarity through ancient wisdom in modern life.';

// Add schema for the homepage
$page_scripts = [
    '/assets/js/mood-selector.js',
    '/assets/js/verse-display.js'
];

include 'includes/header.php';
include 'includes/nav.php';
?>

<!-- Hero Section -->
<section class="relative bg-gradient-to-b from-orange-50 to-orange-100 py-20">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-orange-800 mb-6">
                Find Divine Guidance for Life's Journey
            </h1>
            <p class="text-xl text-gray-700 mb-12 leading-relaxed">
                Discover relevant wisdom from the Bhagavad Gita based on your current emotional state. 
                Let ancient knowledge illuminate your path to peace, purpose, and prosperity.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#mood-section" 
                   class="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                    <i class="fas fa-heart"></i>
                    <span>Find Guidance Now</span>
                </a>
                <button onclick="shareWebsite()" 
                        class="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <i class="fab fa-whatsapp"></i>
                    <span>Share on WhatsApp</span>
                </button>
            </div>
        </div>
    </div>
    <!-- Decorative Wave -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg class="w-full h-24" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,74L1392,74C1344,74,1248,74,1152,74C1056,74,960,74,864,74C768,74,672,74,576,74C480,74,384,74,288,74C192,74,96,74,48,74L0,74Z" 
                  fill="#ffffff"/>
        </svg>
    </div>
</section>

<!-- Mood Categories Section -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Find Wisdom for Every Emotion</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-orange-50 rounded-xl p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
                <i class="fas fa-peace text-4xl text-orange-600 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Peace & Calmness</h3>
                <p class="text-gray-600">Find tranquility in moments of stress and anxiety</p>
            </div>
            
            <div class="bg-orange-50 rounded-xl p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
                <i class="fas fa-compass text-4xl text-orange-600 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Purpose & Direction</h3>
                <p class="text-gray-600">Discover clarity when feeling lost or uncertain</p>
            </div>
            
            <div class="bg-orange-50 rounded-xl p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
                <i class="fas fa-mountain text-4xl text-orange-600 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Strength & Courage</h3>
                <p class="text-gray-600">Build resilience during challenging times</p>
            </div>
            
            <div class="bg-orange-50 rounded-xl p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
                <i class="fas fa-heart text-4xl text-orange-600 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Love & Relationships</h3>
                <p class="text-gray-600">Navigate relationships with wisdom and compassion</p>
            </div>
        </div>
    </div>
</section>

<!-- Mood Selection Section -->
<section id="mood-section" class="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
    <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-xl shadow-lg p-8">
                <h2 class="text-3xl font-semibold text-gray-800 mb-6 text-center">How are you feeling today?</h2>
                <p class="text-gray-600 mb-8 text-center">
                    Select your current emotional state to receive relevant guidance from the Bhagavad Gita
                </p>
                
                <!-- Visual Mood Selector -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    <!-- Will be populated by mood-selector.js -->
                    <div class="mood-loading flex justify-center items-center col-span-full py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                </div>
                
                <!-- Show More Toggle -->
                <div class="text-center mb-6 hidden" id="show-more-container">
                    <button id="show-more-moods" class="text-orange-600 hover:text-orange-700 font-medium flex items-center mx-auto">
                        <span>Show more emotions</span>
                        <i class="fas fa-chevron-down ml-2"></i>
                    </button>
                </div>
                
                <!-- Extended Moods (Hidden by Default) -->
                <div id="extended-moods" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 hidden">
                    <!-- Will be populated by mood-selector.js -->
                </div>
                
                <!-- Traditional Dropdown (As Backup) -->
                <div class="mt-6">
                    <label for="mood-dropdown" class="block text-gray-600 mb-2 text-center">Or select from the list:</label>
                    <select id="mood-dropdown" 
                            class="w-full p-4 text-lg border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors cursor-pointer bg-white">
                        <option value="" selected disabled>Select your current state of mind...</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Verses Display Section -->
<section id="verse-display" class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-semibold text-orange-800 mb-8 text-center">Your Guiding Verses</h2>
            
            <!-- Saving Options (Initially Hidden) -->
            <div id="verse-actions" class="flex flex-wrap justify-center gap-4 mb-8 hidden">
                <button id="save-favorites" class="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors flex items-center">
                    <i class="far fa-bookmark mr-2"></i>
                    <span>Save to Favorites</span>
                </button>
                <button id="share-collection" class="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center">
                    <i class="fas fa-share-alt mr-2"></i>
                    <span>Share Collection</span>
                </button>
                <button id="create-practice" class="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center">
                    <i class="fas fa-calendar-plus mr-2"></i>
                    <span>Create Practice Plan</span>
                </button>
            </div>
            
            <!-- Display Format Toggle -->
            <div id="display-options" class="mb-8 flex justify-center gap-4 hidden">
                <button class="display-toggle bg-orange-600 text-white px-4 py-2 rounded-lg" data-view="card">Card View</button>
                <button class="display-toggle bg-gray-200 text-gray-700 px-4 py-2 rounded-lg" data-view="compact">Compact View</button>
                <button class="display-toggle bg-gray-200 text-gray-700 px-4 py-2 rounded-lg" data-view="focus">Focus Mode</button>
            </div>
            
            <!-- Verses List Container -->
            <div class="list-group space-y-6" id="verse-list"></div>
            
            <!-- Empty State Message (Initially Shown) -->
            <div id="empty-state" class="text-center py-12 bg-orange-50 rounded-xl">
                <img src="/assets/images/general/empty-state.svg" alt="Select a mood" class="mx-auto w-48 h-48 mb-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">No verses selected yet</h3>
                <p class="text-gray-600 mb-4">Choose your current emotional state above to receive personalized guidance</p>
                <a href="#mood-section" class="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Select Emotion
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-16 bg-orange-50">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose GyanGita</h2>
        <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
                <i class="fas fa-lightbulb text-3xl text-orange-500 mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">Personalized Guidance</h3>
                <p class="text-gray-600">Receive verses tailored to your current emotional state and life situation.</p>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
                <i class="fas fa-book-reader text-3xl text-orange-500 mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">Deep Insights</h3>
                <p class="text-gray-600">Access profound interpretations from renowned scholars and spiritual leaders.</p>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
                <i class="fas fa-mobile-alt text-3xl text-orange-500 mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">Daily Wisdom</h3>
                <p class="text-gray-600">Get daily verse notifications for continuous spiritual growth and reflection.</p>
            </div>
        </div>
    </div>
</section>

<!-- Testimonials Section -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">What Our Users Say</h2>
        
        <div class="max-w-5xl mx-auto">
            <div class="grid md:grid-cols-2 gap-8">
                <div class="bg-orange-50 p-6 rounded-xl">
                    <div class="flex items-center mb-4">
                        <div class="text-orange-500 mr-2">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="text-gray-500">5.0</div>
                    </div>
                    <p class="text-gray-700 mb-4 italic">
                        "GyanGita has transformed my daily routine. The personalized verses seem to address exactly what I'm going through. It's like having a spiritual guide in my pocket."
                    </p>
                    <div class="flex items-center">
                        <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="User Avatar" class="w-10 h-10 rounded-full mr-3">
                        <div>
                            <h4 class="font-medium text-gray-800">Priya Sharma</h4>
                            <p class="text-gray-500 text-sm">Yoga Instructor</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-orange-50 p-6 rounded-xl">
                    <div class="flex items-center mb-4">
                        <div class="text-orange-500 mr-2">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="text-gray-500">5.0</div>
                    </div>
                    <p class="text-gray-700 mb-4 italic">
                        "The practice features have helped me deepen my understanding of the Gita tremendously. I'm now able to internalize the teachings in a way I never could before."
                    </p>
                    <div class="flex items-center">
                        <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="User Avatar" class="w-10 h-10 rounded-full mr-3">
                        <div>
                            <h4 class="font-medium text-gray-800">Rahul Verma</h4>
                            <p class="text-gray-500 text-sm">Software Engineer</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="py-16 bg-orange-600">
    <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center text-white">
            <h2 class="text-3xl font-bold mb-6">Start Your Spiritual Journey Today</h2>
            <p class="text-xl mb-8 opacity-90">
                Let the timeless wisdom of Bhagavad Gita guide you through life's challenges
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#mood-section" 
                   class="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors inline-flex items-center justify-center space-x-2">
                    <i class="fas fa-search"></i>
                    <span>Find Verses Now</span>
                </a>
                <a href="/pages/browse.php" 
                   class="bg-orange-700 text-white px-8 py-4 rounded-lg hover:bg-orange-800 transition-colors inline-flex items-center justify-center space-x-2">
                    <i class="fas fa-book"></i>
                    <span>Browse All Chapters</span>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Verse Modal for Detailed View -->
<div id="verseModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 sticky top-0 bg-white">
            <div class="flex justify-between items-center">
                <h3 class="text-2xl font-semibold text-gray-800" id="modal-title">Verse Details</h3>
                <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
        </div>
        <div class="p-6" id="verse-details">
            <!-- Verse content will be loaded here -->
        </div>
    </div>
</div>

<!-- Schema for Article -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Find Personalized Guidance from Bhagavad Gita",
    "description": "Discover relevant wisdom from the Bhagavad Gita based on your current emotional state.",
    "image": "<?php echo SITE_URL; ?>/assets/images/general/og-image.jpg",
    "author": {
        "@type": "Person",
        "name": "Rajat Udasi"
    },
    "publisher": {
        "@type": "Organization",
        "name": "GyanGita",
        "logo": {
            "@type": "ImageObject",
            "url": "<?php echo SITE_URL; ?>/assets/images/general/logo.png"
        }
    },
    "datePublished": "2023-07-01",
    "dateModified": "<?php echo date('Y-m-d'); ?>"
}
</script>

<?php include 'includes/footer.php'; ?>