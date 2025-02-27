<?php
require_once '../includes/config.php';

// SEO settings
$page_title = "My Dashboard - GyanGita";
$page_description = "Track your spiritual journey with personalized stats, favorite verses, reading history, and practice progress.";

// Include scripts
$page_scripts = [
    '/assets/js/dashboard.js'
];

include '../includes/header.php';
include '../includes/nav.php';
?>

<!-- Main Content -->
<main class="container mx-auto px-4 py-12" id="main-content">
    <div class="max-w-6xl mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-orange-800 mb-4">My Spiritual Journey</h1>
            <p class="text-xl text-gray-600">Track your progress, access your favorites, and continue your practice</p>
        </div>
        
        <!-- Dashboard Tabs -->
        <div class="mb-8">
            <div class="border-b border-gray-200">
                <nav class="flex -mb-px overflow-x-auto pb-1">
                    <button class="tab-button active whitespace-nowrap py-4 px-6 border-b-2 border-orange-600 font-medium text-orange-600" data-tab="overview">
                        Overview
                    </button>
                    <button class="tab-button whitespace-nowrap py-4 px-6 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="favorites">
                        My Favorites
                    </button>
                    <button class="tab-button whitespace-nowrap py-4 px-6 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="history">
                        Reading History
                    </button>
                    <button class="tab-button whitespace-nowrap py-4 px-6 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="practice">
                        Practice Tracker
                    </button>
                </nav>
            </div>
        </div>
        
        <!-- Overview Tab -->
        <div id="overview-tab" class="tab-content">
            <!-- Quick Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div class="bg-white rounded-xl shadow-md p-6 text-center">
                    <div class="text-4xl font-bold text-orange-600 mb-2" id="favorites-count">0</div>
                    <div class="text-gray-600">Favorite Verses</div>
                </div>
                <div class="bg-white rounded-xl shadow-md p-6 text-center">
                    <div class="text-4xl font-bold text-orange-600 mb-2" id="verses-read">0</div>
                    <div class="text-gray-600">Verses Read</div>
                </div>
                <div class="bg-white rounded-xl shadow-md p-6 text-center">
                    <div class="text-4xl font-bold text-orange-600 mb-2" id="practice-days">0</div>
                    <div class="text-gray-600">Practice Days</div>
                </div>
                <div class="bg-white rounded-xl shadow-md p-6 text-center">
                    <div class="text-4xl font-bold text-orange-600 mb-2" id="streak-days">0</div>
                    <div class="text-gray-600">Day Streak</div>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="bg-white rounded-xl shadow-md p-6 mb-12">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
                <div id="recent-activity" class="space-y-4">
                    <!-- Will be populated by JavaScript -->
                    <div class="animate-pulse">
                        <div class="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-4 bg-gray-100 rounded w-full"></div>
                    </div>
                    <div class="animate-pulse">
                        <div class="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div class="h-4 bg-gray-100 rounded w-full"></div>
                    </div>
                    <div class="animate-pulse">
                        <div class="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-4 bg-gray-100 rounded w-full"></div>
                    </div>
                </div>
            </div>
            
            <!-- Today's Recommendation -->
            <div class="bg-white rounded-xl shadow-md p-6 mb-12">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6">Today's Recommendation</h2>
                <div id="daily-recommendation" class="space-y-4">
                    <!-- Will be populated by JavaScript -->
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
            
            <!-- Monthly Progress -->
            <div class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6">Monthly Progress</h2>
                <div id="monthly-progress">
                    <!-- Will be populated by JavaScript -->
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div class="h-40 bg-gray-100 rounded w-full"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Favorites Tab (Initially Hidden) -->
        <div id="favorites-tab" class="tab-content hidden">
            <div class="bg-white rounded-xl shadow-md p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-semibold text-gray-800">My Favorite Verses</h2>
                    <div class="flex space-x-2">
                        <button id="sort-favorites-btn" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                            <i class="fas fa-sort mr-2"></i>
                            <span>Sort</span>
                        </button>
                        <button id="share-favorites-btn" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                            <i class="fas fa-share-alt mr-2"></i>
                            <span>Share All</span>
                        </button>
                    </div>
                </div>
                
                <!-- Empty State (Initially Hidden) -->
                <div id="favorites-empty" class="text-center py-12 bg-orange-50 rounded-xl hidden">
                    <img src="/assets/images/general/empty-favorites.svg" alt="No favorites yet" class="mx-auto w-48 h-48 mb-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">No favorites saved yet</h3>
                    <p class="text-gray-600 mb-4">Bookmark verses you love to access them easily</p>
                    <a href="/pages/browse.php" class="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                        Browse Gita
                    </a>
                </div>
                
                <!-- Favorites List -->
                <div id="favorites-list" class="space-y-4">
                    <!-- Will be populated by JavaScript -->
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- History Tab (Initially Hidden) -->
        <div id="history-tab" class="tab-content hidden">
            <div class="bg-white rounded-xl shadow-md p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-semibold text-gray-800">Reading History</h2>
                    <button id="clear-history-btn" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center">
                        <i class="fas fa-trash-alt mr-2"></i>
                        <span>Clear History</span>
                    </button>
                </div>
                
                <!-- Empty State (Initially Hidden) -->
                <div id="history-empty" class="text-center py-12 bg-orange-50 rounded-xl hidden">
                    <img src="/assets/images/general/empty-history.svg" alt="No reading history" class="mx-auto w-48 h-48 mb-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">No reading history yet</h3>
                    <p class="text-gray-600 mb-4">Start exploring verses to build your history</p>
                    <a href="/pages/browse.php" class="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                        Browse Gita
                    </a>
                </div>
                
                <!-- History List -->
                <div id="history-list" class="space-y-4">
                    <!-- Will be populated by JavaScript -->
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Practice Tracker Tab (Initially Hidden) -->
        <div id="practice-tab" class="tab-content hidden">
            <div class="grid md:grid-cols-2 gap-8">
                <!-- Practice Stats -->
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Practice Statistics</h2>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-orange-50 p-4 rounded-lg text-center">
                            <h3 class="text-lg font-medium text-orange-800 mb-1">Total Practice</h3>
                            <p class="text-3xl font-bold text-orange-600" id="total-practice-minutes">0</p>
                            <p class="text-sm text-gray-600">minutes</p>
                        </div>
                        <div class="bg-orange-50 p-4 rounded-lg text-center">
                            <h3 class="text-lg font-medium text-orange-800 mb-1">Current Streak</h3>
                            <p class="text-3xl font-bold text-orange-600" id="current-streak-days">0</p>
                            <p class="text-sm text-gray-600">days</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-orange-50 p-4 rounded-lg text-center">
                            <h3 class="text-lg font-medium text-orange-800 mb-1">Verses Practiced</h3>
                            <p class="text-3xl font-bold text-orange-600" id="verses-practiced-count">0</p>
                        </div>
                        <div class="bg-orange-50 p-4 rounded-lg text-center">
                            <h3 class="text-lg font-medium text-orange-800 mb-1">Practice Sessions</h3>
                            <p class="text-3xl font-bold text-orange-600" id="practice-sessions-count">0</p>
                        </div>
                    </div>
                    
                    <h3 class="text-lg font-medium text-gray-800 mb-4">Practice by Type</h3>
                    <div id="practice-by-type" class="mb-6">
                        <!-- Will be populated by JavaScript -->
                        <div class="animate-pulse">
                            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div class="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <a href="/pages/practice.php" class="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                            Start New Practice Session
                        </a>
                    </div>
                </div>
                
                <!-- Practice Calendar -->
                <div class="bg-white rounded-xl shadow-md p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-semibold text-gray-800">Practice Calendar</h2>
                        <div class="flex space-x-2">
                            <button id="prev-month" class="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button id="next-month" class="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="text-center mb-4">
                        <h3 class="text-lg font-medium text-gray-800" id="calendar-month">
                            <!-- Will be populated by JavaScript -->
                            ...
                        </h3>
                    </div>
                    
                    <div id="practice-calendar" class="grid grid-cols-7 gap-2 mb-4">
                        <!-- Weekday headers -->
                        <div class="text-center text-xs text-gray-500">Mon</div>
                        <div class="text-center text-xs text-gray-500">Tue</div>
                        <div class="text-center text-xs text-gray-500">Wed</div>
                        <div class="text-center text-xs text-gray-500">Thu</div>
                        <div class="text-center text-xs text-gray-500">Fri</div>
                        <div class="text-center text-xs text-gray-500">Sat</div>
                        <div class="text-center text-xs text-gray-500">Sun</div>
                        
                        <!-- Calendar days will be populated by JavaScript -->
                    </div>
                    
                    <div class="flex justify-center space-x-4 text-sm">
                        <div class="flex items-center">
                            <div class="h-4 w-4 bg-gray-200 rounded-sm mr-2"></div>
                            <span>No Practice</span>
                        </div>
                        <div class="flex items-center">
                            <div class="h-4 w-4 bg-orange-300 rounded-sm mr-2"></div>
                            <span>Short Practice</span>
                        </div>
                        <div class="flex items-center">
                            <div class="h-4 w-4 bg-orange-500 rounded-sm mr-2"></div>
                            <span>Full Practice</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Recent Practice Sessions -->
            <div class="bg-white rounded-xl shadow-md p-6 mt-8">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6">Recent Practice Sessions</h2>
                
                <!-- Empty State (Initially Hidden) -->
                <div id="practice-empty" class="text-center py-12 bg-orange-50 rounded-xl hidden">
                    <img src="/assets/images/general/empty-practice.svg" alt="No practice sessions" class="mx-auto w-48 h-48 mb-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">No practice sessions yet</h3>
                    <p class="text-gray-600 mb-4">Start practicing to track your progress</p>
                    <a href="/pages/practice.php" class="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                        Begin Practice
                    </a>
                </div>
                
                <!-- Practice Sessions List -->
                <div id="practice-sessions-list" class="space-y-4">
                    <!-- Will be populated by JavaScript -->
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Sort Options Modal -->
<div id="sortModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl w-96">
        <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-800">Sort By</h3>
                <button onclick="closeSortModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="p-6 space-y-4">
            <button class="sort-option w-full text-left p-3 rounded-lg hover:bg-orange-50 transition-colors" data-sort="recent">
                <i class="fas fa-clock mr-2 text-orange-600"></i>
                <span>Recently Added</span>
            </button>
            <button class="sort-option w-full text-left p-3 rounded-lg hover:bg-orange-50 transition-colors" data-sort="chapter-asc">
                <i class="fas fa-sort-alpha-down mr-2 text-orange-600"></i>
                <span>Chapter (Ascending)</span>
            </button>
            <button class="sort-option w-full text-left p-3 rounded-lg hover:bg-orange-50 transition-colors" data-sort="chapter-desc">
                <i class="fas fa-sort-alpha-up mr-2 text-orange-600"></i>
                <span>Chapter (Descending)</span>
            </button>
        </div>
    </div>
</div>

<script>
// Initialize dashboard page
document.addEventListener('DOMContentLoaded', function() {
    // We'll implement these functions in the dashboard.js file
    initializeTabs();
    loadOverviewData();
    loadFavoritesData();
    loadHistoryData();
    loadPracticeData();
});
</script>

<?php include '../includes/footer.php'; ?>