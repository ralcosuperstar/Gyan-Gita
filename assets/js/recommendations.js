/**
 * GyanGita Recommendations Engine
 * Handles personalized recommendations based on user behavior and preferences
 */

// Configuration
const API_BASE_URL = '/api';
const HISTORY_KEY = 'gyangita_history';
const FAVORITES_KEY = 'gyangita_favorites';
const PRACTICE_KEY = 'gyangita_practice';
const PREFERENCES_KEY = 'gyangita_preferences';

// State
let userPreferences = {};
let userInterests = {};
let recommendedVerses = [];

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initializeRecommendations();
});

// Initialize recommendations
function initializeRecommendations() {
    // Load user data from localStorage
    loadUserData();
    
    // Find recommendation containers
    const dailyRecommendation = document.getElementById('daily-recommendation');
    const recommendedPractice = document.getElementById('recommended-practice-verses');
    const moodRecommendation = document.getElementById('recommended-moods');
    
    // Update recommendations if containers exist
    if (dailyRecommendation) {
        updateDailyRecommendation(dailyRecommendation);
    }
    
    if (recommendedPractice) {
        updatePracticeRecommendations(recommendedPractice);
    }
    
    if (moodRecommendation) {
        updateMoodRecommendations(moodRecommendation);
    }
}

// Load user data from localStorage
function loadUserData() {
    try {
        // Get history data
        const historyJson = localStorage.getItem(HISTORY_KEY);
        const history = historyJson ? JSON.parse(historyJson) : [];
        
        // Get favorites data
        const favoritesJson = localStorage.getItem(FAVORITES_KEY);
        const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
        
        // Get practice data
        const practiceJson = localStorage.getItem(PRACTICE_KEY);
        const practice = practiceJson ? JSON.parse(practiceJson) : {
            sessions: [],
            byType: {}
        };
        
        // Get user preferences
        const preferencesJson = localStorage.getItem(PREFERENCES_KEY);
        userPreferences = preferencesJson ? JSON.parse(preferencesJson) : {
            theme: 'light',
            display: 'card',
            notifications: false
        };
        
        // Analyze user interests based on history, favorites, and practice
        analyzeUserInterests(history, favorites, practice);
        
    } catch (e) {
        console.error('Error loading user data:', e);
        // Reset to defaults
        userPreferences = {
            theme: 'light',
            display: 'card',
            notifications: false
        };
        userInterests = {};
    }
}

// Analyze user interests based on their activity
function analyzeUserInterests(history, favorites, practice) {
    // Reset interests
    userInterests = {
        chapters: {},
        themes: {},
        moods: {},
        recency: {}
    };
    
    // Process history data
    history.forEach(item => {
        // Count chapter views
        const chapterKey = `chapter_${item.chapter}`;
        userInterests.chapters[chapterKey] = (userInterests.chapters[chapterKey] || 0) + 1;
        
        // Track recency (more recent = higher weight)
        const daysDiff = Math.floor((Date.now() - item.timestamp) / (1000 * 60 * 60 * 24));
        const recencyWeight = Math.max(0, 30 - daysDiff) / 30; // 0-1 scale, higher for more recent
        userInterests.recency[`${item.chapter}_${item.verse}`] = recencyWeight;
    });
    
    // Process favorites data (higher weight than history)
    favorites.forEach(item => {
        // Count chapter favorites (double weight)
        const chapterKey = `chapter_${item.chapter}`;
        userInterests.chapters[chapterKey] = (userInterests.chapters[chapterKey] || 0) + 2;
    });
    
    // Process practice data (highest weight)
    practice.sessions.forEach(session => {
        // Count chapter practice (triple weight)
        const chapterKey = `chapter_${session.chapter}`;
        userInterests.chapters[chapterKey] = (userInterests.chapters[chapterKey] || 0) + 3;
        
        // Count practice type preference
        const typeKey = `type_${session.type}`;
        userInterests.themes[typeKey] = (userInterests.themes[typeKey] || 0) + 1;
    });
    
    // Sort interests by weight
    userInterests.topChapters = Object.keys(userInterests.chapters)
        .sort((a, b) => userInterests.chapters[b] - userInterests.chapters[a])
        .map(key => parseInt(key.replace('chapter_', '')));
        
    userInterests.topThemes = Object.keys(userInterests.themes)
        .sort((a, b) => userInterests.themes[b] - userInterests.themes[a])
        .map(key => key.replace('type_', ''));
}

// Update daily recommendation
function updateDailyRecommendation(container) {
    // Use daily verse with seed based on date to ensure consistency for the day
    const now = new Date();
    const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    
    // Generate a pseudo-random verse selection based on date
    const chapter = (dateSeed % 18) + 1; // 1-18
    const verse = (Math.floor(dateSeed / 100) % getVerseCountForChapter(chapter)) + 1;
    
    // If we have user interests, modify the selection
    if (userInterests.topChapters && userInterests.topChapters.length > 0) {
        // 30% chance to use top chapter instead
        if (Math.random() < 0.3) {
            const preferredChapter = userInterests.topChapters[0];
            const preferredVerse = (dateSeed % getVerseCountForChapter(preferredChapter)) + 1;
            
            // Use preferred chapter/verse
            fetchAndDisplayVerse(preferredChapter, preferredVerse, container);
            return;
        }
    }
    
    // Use the date-based verse
    fetchAndDisplayVerse(chapter, verse, container);
}

// Update practice recommendations
function updatePracticeRecommendations(container) {
    // Create list of verses to recommend
    let recommendedVerses = [];
    
    // Always include one verse based on date (daily verse)
    const now = new Date();
    const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const dailyChapter = (dateSeed % 18) + 1;
    const dailyVerse = (Math.floor(dateSeed / 100) % getVerseCountForChapter(dailyChapter)) + 1;
    
    recommendedVerses.push({
        chapter: dailyChapter,
        verse: dailyVerse,
        theme: "Daily practice"
    });
    
    // Include favorite verses if available
    try {
        const favoritesJson = localStorage.getItem(FAVORITES_KEY);
        const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
        
        if (favorites && favorites.length > 0) {
            // Pick a random favorite
            const randomFavorite = favorites[Math.floor(Math.random() * favorites.length)];
            recommendedVerses.push({
                chapter: randomFavorite.chapter,
                verse: randomFavorite.verse,
                theme: "From your favorites"
            });
        }
    } catch (e) {
        console.error('Error loading favorites:', e);
    }
    
    // Add more recommendations based on fixed themes
    const themeVerses = [
        { chapter: 2, verse: 47, theme: "Duty without attachment" },
        { chapter: 6, verse: 5, theme: "Self-elevation" },
        { chapter: 2, verse: 14, theme: "Tolerance of dualities" },
        { chapter: 12, verse: 13, theme: "Universal friendship" }
    ];
    
    // Add theme verses until we have at least 4 recommendations
    while (recommendedVerses.length < 4) {
        const randomIndex = Math.floor(Math.random() * themeVerses.length);
        const verse = themeVerses[randomIndex];
        
        // Check if already added
        const isDuplicate = recommendedVerses.some(v => 
            v.chapter === verse.chapter && v.verse === verse.verse
        );
        
        if (!isDuplicate) {
            recommendedVerses.push(verse);
        }
        
        // Safety check to prevent infinite loop
        if (recommendedVerses.length >= themeVerses.length) {
            break;
        }
    }
    
    // Shuffle recommendations
    recommendedVerses = shuffleArray(recommendedVerses.slice(0, 4));
    
    // Create HTML for practice recommendations
    let html = '';
    recommendedVerses.forEach(verse => {
        html += `
            <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 class="text-lg font-medium text-orange-800 mb-2">
                    Chapter ${verse.chapter}, Verse ${verse.verse}
                </h3>
                <p class="text-gray-600 mb-4">${verse.theme}</p>
                <div class="flex flex-wrap gap-2">
                    <a href="/pages/practice.php?chapter=${verse.chapter}&verse=${verse.verse}&type=recitation" 
                       class="px-3 py-1 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors text-sm flex items-center">
                        <i class="fas fa-microphone-alt mr-1"></i>
                        <span>Recitation</span>
                    </a>
                    <a href="/pages/practice.php?chapter=${verse.chapter}&verse=${verse.verse}&type=reflection" 
                       class="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm flex items-center">
                        <i class="fas fa-brain mr-1"></i>
                        <span>Reflection</span>
                    </a>
                    <a href="/pages/practice.php?chapter=${verse.chapter}&verse=${verse.verse}&type=meditation" 
                       class="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center">
                        <i class="fas fa-om mr-1"></i>
                        <span>Meditation</span>
                    </a>
                </div>
            </div>
        `;
    });
    
    // Update container
    container.innerHTML = html;
}

// Update mood recommendations
function updateMoodRecommendations(container) {
    // Top moods to recommend (can be personalized in future versions)
    const recommendedMoods = [
        { name: "Seeking Peace", icon: "peace", color: "blue" },
        { name: "Depression", icon: "cloud-rain", color: "purple" },
        { name: "Anger", icon: "fire-alt", color: "red" },
        { name: "Confusion", icon: "question-circle", color: "yellow" }
    ];
    
    let html = '';
    recommendedMoods.forEach(mood => {
        html += `
            <button class="mood-card bg-${mood.color}-100 rounded-lg p-4 text-center hover:shadow-md transition-all" 
                    data-mood="${mood.name}" onclick="selectMood('${mood.name}')">
                <i class="fas fa-${mood.icon} text-3xl text-${mood.color}-600 mb-2"></i>
                <div class="font-medium">${mood.name}</div>
            </button>
        `;
    });
    
    // Update container
    container.innerHTML = html;
}

// Fetch and display verse in container
function fetchAndDisplayVerse(chapter, verse, container) {
    // Create a loading state in the container
    container.innerHTML = `
        <div class="animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
    `;

    // Fetch the verse data
    fetch(`${API_BASE_URL}/get-verse.php?chapter=${chapter}&verse=${verse}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                const verseData = data.data;
                
                // Get the main translation
                const translation = verseData.tej?.ht || verseData.siva?.et || 'Translation not available';
                
                // Update the container with verse data
                container.innerHTML = `
                    <h3 class="text-xl font-medium text-orange-800 mb-2">
                        Chapter ${chapter}, Verse ${verse}
                    </h3>
                    <div class="bg-orange-50 rounded-lg p-4 mb-4">
                        <p class="text-gray-800 font-sanskrit">${verseData.slok || 'Sanskrit not available'}</p>
                    </div>
                    <p class="text-gray-700 mb-4">${translation}</p>
                    <div class="flex space-x-3">
                        <a href="/pages/browse.php?chapter=${chapter}&verse=${verse}" 
                           class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            Read Full Verse
                        </a>
                        <a href="/pages/practice.php?chapter=${chapter}&verse=${verse}" 
                           class="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors flex items-center">
                            <i class="fas fa-om mr-2"></i>
                            <span>Practice</span>
                        </a>
                    </div>
                `;
            } else {
                throw new Error(data.message || 'Failed to load verse');
            }
        })
        .catch(error => {
            console.error('Error fetching verse:', error);
            
            // Show error in container
            container.innerHTML = `
                <div class="bg-red-50 p-4 rounded-lg text-red-500">
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    Failed to load verse. Please try again later.
                </div>
            `;
        });
}

// Get verse count for chapter (hardcoded for simplicity)
function getVerseCountForChapter(chapter) {
    const verseCounts = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78];
    return verseCounts[chapter - 1] || 30; // Default to 30 if chapter not found
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Track mood selection for analytics
function trackMoodSelection(mood) {
    // Get existing mood tracking data
    let moodTracking = {};
    try {
        const trackingJson = localStorage.getItem('gyangita_mood_tracking');
        moodTracking = trackingJson ? JSON.parse(trackingJson) : {};
    } catch (e) {
        console.error('Error loading mood tracking data:', e);
        moodTracking = {};
    }
    
    // Update tracking data
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    if (!moodTracking[mood]) {
        moodTracking[mood] = { count: 0, lastSelected: null };
    }
    
    moodTracking[mood].count++;
    moodTracking[mood].lastSelected = today;
    
    // Save tracking data
    localStorage.setItem('gyangita_mood_tracking', JSON.stringify(moodTracking));
    
    // Update user interests
    userInterests.moods = userInterests.moods || {};
    userInterests.moods[mood] = (userInterests.moods[mood] || 0) + 1;
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.updateDailyRecommendation = updateDailyRecommendation;
    window.updatePracticeRecommendations = updatePracticeRecommendations;
    window.trackMoodSelection = trackMoodSelection;
}