/**
 * GyanGita Mood Selector
 * Interactive mood selection for personalized verse recommendations
 */

// Configuration
const MOODS_JSON_URL = '/assets/js/moods.json';

// DOM Elements
let moodGrid;
let extendedMoodsGrid;
let showMoreButton;
let moodDropdown;
let verseList;
let emptyState;
let verseActions;
let displayOptions;

// State
let moodData = [];
let selectedMood = null;

// Mood Icons and Colors
const moodIcons = {
    'Anger': { emoji: '😠', color: 'bg-red-100', iconColor: 'text-red-600', icon: 'fa-fire-alt' },
    'Seeking Peace': { emoji: '😌', color: 'bg-blue-100', iconColor: 'text-blue-600', icon: 'fa-peace' },
    'Depression': { emoji: '😞', color: 'bg-purple-100', iconColor: 'text-purple-600', icon: 'fa-cloud-rain' },
    'Confusion': { emoji: '😕', color: 'bg-yellow-100', iconColor: 'text-yellow-600', icon: 'fa-question-circle' },
    'Fear': { emoji: '😨', color: 'bg-indigo-100', iconColor: 'text-indigo-600', icon: 'fa-ghost' },
    'Greed': { emoji: '🤑', color: 'bg-green-100', iconColor: 'text-green-600', icon: 'fa-coins' },
    'Demotivated': { emoji: '😩', color: 'bg-gray-100', iconColor: 'text-gray-600', icon: 'fa-battery-quarter' },
    'Temptation': { emoji: '🤔', color: 'bg-pink-100', iconColor: 'text-pink-600', icon: 'fa-candy-cane' },
    'Forgetfulness': { emoji: '🧠', color: 'bg-cyan-100', iconColor: 'text-cyan-600', icon: 'fa-brain' },
    'Losing Hope': { emoji: '😔', color: 'bg-purple-100', iconColor: 'text-purple-600', icon: 'fa-heartbeat' },
    'Lust': { emoji: '😍', color: 'bg-pink-100', iconColor: 'text-pink-600', icon: 'fa-heart' },
    'Uncontrolled Mind': { emoji: '🌪️', color: 'bg-gray-100', iconColor: 'text-gray-600', icon: 'fa-wind' },
    'Dealing with Envy': { emoji: '💢', color: 'bg-green-100', iconColor: 'text-green-600', icon: 'fa-eye' },
    'Discriminated': { emoji: '😣', color: 'bg-orange-100', iconColor: 'text-orange-600', icon: 'fa-users' },
    'Practicing Forgiveness': { emoji: '🙏', color: 'bg-blue-100', iconColor: 'text-blue-600', icon: 'fa-hands' }
};

// Initialize Mood Selector
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadMoodData();
    
    // Event delegation for mood card clicks
    document.addEventListener('click', function(e) {
        const moodCard = e.target.closest('.mood-card');
        if (moodCard) {
            const mood = moodCard.dataset.mood;
            
            if (mood) {
                selectMood(mood);
                
                // Also update dropdown to match selection
                if (moodDropdown) {
                    const options = Array.from(moodDropdown.options);
                    const option = options.find(opt => opt.textContent === mood);
                    if (option) {
                        moodDropdown.value = option.value;
                    }
                }
            }
        }
    });
    
    // Show more/less moods toggle
    if (showMoreButton) {
        showMoreButton.addEventListener('click', function() {
            toggleExtendedMoods();
        });
    }
    
    // Dropdown backup selector
    if (moodDropdown) {
        moodDropdown.addEventListener('change', function() {
            try {
                // Get selected mood text (not value)
                const selectedOption = moodDropdown.options[moodDropdown.selectedIndex];
                selectMoodByName(selectedOption.textContent);
            } catch (e) {
                console.error('Error handling mood selection:', e);
            }
        });
    }
});

// Initialize DOM elements
function initializeElements() {
    moodGrid = document.querySelector('.grid:not(#extended-moods)');
    extendedMoodsGrid = document.getElementById('extended-moods');
    showMoreButton = document.getElementById('show-more-moods');
    showMoreContainer = document.getElementById('show-more-container');
    moodDropdown = document.getElementById('mood-dropdown');
    verseList = document.getElementById('verse-list');
    emptyState = document.getElementById('empty-state');
    verseActions = document.getElementById('verse-actions');
    displayOptions = document.getElementById('display-options');
}

// Load mood data from JSON file
function loadMoodData() {
    fetch(MOODS_JSON_URL)
        .then(response => response.json())
        .then(data => {
            moodData = data.moods;
            
            // Populate dropdown
            populateMoodDropdown();
            
            // Create visual mood cards
            populateMoodCards();
            
            // Show 'show more' button if there are extended moods
            if (showMoreContainer && moodData.length > 8) {
                showMoreContainer.classList.remove('hidden');
            }
            
            // Remove loading indicator
            const loadingElement = document.querySelector('.mood-loading');
            if (loadingElement) {
                loadingElement.remove();
            }
        })
        .catch(error => {
            console.error('Error loading mood data:', error);
            
            // Show error in mood grid
            if (moodGrid) {
                moodGrid.innerHTML = `
                    <div class="col-span-full text-center text-red-500 py-4">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        Error loading mood data. Please try refreshing the page.
                    </div>
                `;
            }
        });
}

// Populate mood dropdown
function populateMoodDropdown() {
    if (!moodDropdown) return;
    
    // Clear existing options except the first one
    while (moodDropdown.options.length > 1) {
        moodDropdown.remove(1);
    }
    
    // Add mood options
    moodData.forEach(mood => {
        const option = document.createElement('option');
        option.value = JSON.stringify(mood.verses);
        option.textContent = mood.name;
        moodDropdown.appendChild(option);
    });
}

// Populate visual mood cards
function populateMoodCards() {
    if (!moodGrid || !extendedMoodsGrid) return;
    
    // Clear existing cards
    moodGrid.innerHTML = '';
    extendedMoodsGrid.innerHTML = '';
    
    // Split moods into main and extended groups
    const mainMoods = moodData.slice(0, 8);
    const extendedMoods = moodData.slice(8);
    
    // Create main mood cards
    mainMoods.forEach(mood => {
        const moodCard = createMoodCard(mood);
        moodGrid.appendChild(moodCard);
    });
    
    // Create extended mood cards
    extendedMoods.forEach(mood => {
        const moodCard = createMoodCard(mood);
        extendedMoodsGrid.appendChild(moodCard);
    });
}

// Create a mood card element
function createMoodCard(mood) {
    const moodCard = document.createElement('div');
    moodCard.className = `mood-card cursor-pointer rounded-lg p-4 text-center hover:shadow-md transition-all`;
    moodCard.dataset.mood = mood.name;
    
    // Get mood styling
    const moodStyle = moodIcons[mood.name] || { 
        emoji: '😊', 
        color: 'bg-orange-100', 
        iconColor: 'text-orange-600',
        icon: 'fa-smile'
    };
    
    // Apply background color
    moodCard.classList.add(moodStyle.color);
    
    moodCard.innerHTML = `
        <div class="text-3xl mb-2">${moodStyle.emoji}</div>
        <div class="font-medium">${mood.name}</div>
    `;
    
    return moodCard;
}

// Toggle extended moods visibility
function toggleExtendedMoods() {
    if (!extendedMoodsGrid || !showMoreButton) return;
    
    const isHidden = extendedMoodsGrid.classList.contains('hidden');
    
    if (isHidden) {
        extendedMoodsGrid.classList.remove('hidden');
        showMoreButton.innerHTML = `
            <span>Show fewer emotions</span>
            <i class="fas fa-chevron-up ml-2"></i>
        `;
    } else {
        extendedMoodsGrid.classList.add('hidden');
        showMoreButton.innerHTML = `
            <span>Show more emotions</span>
            <i class="fas fa-chevron-down ml-2"></i>
        `;
    }
}

// Select a mood by name
function selectMoodByName(moodName) {
    const mood = moodData.find(m => m.name === moodName);
    if (mood) {
        selectMood(moodName);
    }
}

// Select a mood and load verses
function selectMood(moodName) {
    // Find the mood in our data
    const mood = moodData.find(m => m.name === moodName);
    if (!mood) return;
    
    // Update selected mood
    selectedMood = moodName;
    
    // Highlight selected mood card
    const moodCards = document.querySelectorAll('.mood-card');
    moodCards.forEach(card => {
        if (card.dataset.mood === moodName) {
            card.classList.add('ring-2', 'ring-orange-500', 'shadow-md');
        } else {
            card.classList.remove('ring-2', 'ring-orange-500', 'shadow-md');
        }
    });
    
    // Show verse UI actions
    if (verseActions) verseActions.classList.remove('hidden');
    if (displayOptions) displayOptions.classList.remove('hidden');
    
    // Hide empty state
    if (emptyState) emptyState.classList.add('hidden');
    
    // Fetch verses for this mood
    if (window.fetchVerses) {
        window.fetchVerses(mood.verses);
    } else {
        // If verse-display.js isn't loaded, attempt to load it
        loadScript('/assets/js/verse-display.js', () => {
            if (window.fetchVerses) {
                window.fetchVerses(mood.verses);
            } else {
                console.error('verse-display.js loaded but fetchVerses not found');
            }
        });
    }
    
    // Track this mood selection for analytics/recommendations
    if (window.trackMoodSelection) {
        window.trackMoodSelection(moodName);
    }
}

// Helper function to load a script dynamically
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.selectMood = selectMood;
    window.selectMoodByName = selectMoodByName;
}