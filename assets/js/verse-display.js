/**
 * GyanGita Verse Display
 * Handles fetching and displaying verses based on mood or other criteria
 */

// Configuration
const API_BASE_URL = 'https://vedicscriptures.github.io/slok';
const FAVORITES_KEY = 'gyangita_favorites';
const HISTORY_KEY = 'gyangita_history';
const MAX_HISTORY_ITEMS = 50;

// DOM Elements
let verseList;
let emptyState;
let verseActions;
let displayOptions;
let verseModal;
let verseDetails;

// State
let currentVerses = [];
let viewMode = 'card'; // card, compact, or focus

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    
    // Load from URL parameters if present
    loadFromUrlParams();
    
    // Set initial view mode
    viewMode = localStorage.getItem('gyangita_view_mode') || 'card';
    updateViewModeUI();
});

// Initialize DOM elements
function initializeElements() {
    verseList = document.getElementById('verse-list');
    emptyState = document.getElementById('empty-state');
    verseActions = document.getElementById('verse-actions');
    displayOptions = document.getElementById('display-options');
    verseModal = document.getElementById('verseModal');
    verseDetails = document.getElementById('verse-details');
}

// Initialize event listeners
function initializeEventListeners() {
    // Display toggles
    if (displayOptions) {
        const toggles = displayOptions.querySelectorAll('.display-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const mode = this.dataset.view;
                setViewMode(mode);
            });
        });
    }
    
    // Modal close
    if (verseModal) {
        verseModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // Verse actions
    if (verseActions) {
        // Save to favorites
        const saveButton = verseActions.querySelector('#save-favorites');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                saveCurrentVersesToFavorites();
            });
        }
        
        // Share collection
        const shareButton = verseActions.querySelector('#share-collection');
        if (shareButton) {
            shareButton.addEventListener('click', function() {
                shareVerseCollection();
            });
        }
        
        // Create practice plan
        const practiceButton = verseActions.querySelector('#create-practice');
        if (practiceButton) {
            practiceButton.addEventListener('click', function() {
                createPracticePlan();
            });
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && verseModal && !verseModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Load verse from URL parameters
function loadFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const chapter = urlParams.get('chapter');
    const verse = urlParams.get('verse');
    
    if (chapter && verse) {
        // Show single verse
        showVerseDetails(chapter, verse);
    }
}

// Fetch verses by chapter and verse numbers
async function fetchVerses(verses) {
    if (!verseList) return;
    
    try {
        // Show loading indicator
        verseList.innerHTML = `
            <div class="flex justify-center items-center p-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        `;
        
        // Save current verses for later reference
        currentVerses = [...verses];
        
        // Fetch each verse
        const versePromises = verses.map(v => 
            fetch(`${API_BASE_URL}/${v.chapter}/${v.text}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch verse ${v.chapter}:${v.text}`);
                    }
                    return response.json();
                })
                .then(data => {
                    return {
                        data: data,
                        chapter: v.chapter,
                        verse: v.text,
                        theme: v.theme || 'Wisdom'
                    };
                })
                .catch(error => {
                    console.error(`Error fetching verse ${v.chapter}:${v.text}:`, error);
                    return { error: true, chapter: v.chapter, verse: v.text };
                })
        );
        
        // Wait for all verses to be fetched
        const results = await Promise.all(versePromises);
        
        // Track in history
        results.forEach(result => {
            if (!result.error) {
                addToHistory({
                    chapter: result.chapter,
                    verse: result.verse,
                    timestamp: new Date().getTime()
                });
            }
        });
        
        // Clear loading indicator
        verseList.innerHTML = '';
        
        // Display verses
        displayVerses(results);
    } catch (error) {
        console.error('Error fetching verses:', error);
        verseList.innerHTML = `
            <div class="text-red-500 p-4 bg-red-50 rounded-lg text-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                Failed to load verses. Please try again later.
            </div>
        `;
    }
}

// Display verses in the UI
function displayVerses(verses) {
    if (!verseList) return;
    
    // Clear verse list
    verseList.innerHTML = '';
    
    // No verses or error
    if (!verses || verses.length === 0) {
        verseList.innerHTML = `
            <div class="text-center py-8 bg-orange-50 rounded-lg">
                <i class="fas fa-search text-4xl text-orange-300 mb-3"></i>
                <p class="text-gray-600">No verses found for this selection.</p>
            </div>
        `;
        return;
    }
    
    // Verses with errors
    const hasErrors = verses.some(v => v.error);
    if (hasErrors) {
        const errorNotice = document.createElement('div');
        errorNotice.className = 'bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm';
        errorNotice.innerHTML = `
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Some verses could not be loaded. Please try again later.
        `;
        verseList.appendChild(errorNotice);
    }
    
    // Create verse cards
    verses.forEach(verse => {
        if (verse.error) return;
        
        // Create verse container
        const verseElement = document.createElement('div');
        verseElement.className = 'verse-item';
        
        // Determine which display mode to use
        let verseHtml = '';
        
        if (viewMode === 'focus' && verseList.children.length > 0) {
            // In focus mode, only show first verse
            return;
        } else if (viewMode === 'compact') {
            // Compact view - simpler layout
            verseHtml = createCompactVerseHtml(verse);
        } else {
            // Card view - full layout
            verseHtml = createCardVerseHtml(verse);
        }
        
        verseElement.innerHTML = verseHtml;
        verseList.appendChild(verseElement);
        
        // Attach event listeners to the verse card
        attachVerseCardListeners(verseElement, verse);
    });
}

// Create HTML for card display mode
function createCardVerseHtml(verse) {
    const { data, chapter, verse: verseNum, theme } = verse;
    
    // Get translations
    const tejTranslation = data.tej?.ht || '';
    const sivaTranslation = data.siva?.et || '';
    const mainTranslation = tejTranslation || sivaTranslation || 'Translation not available';
    const commentaryText = data.purohit?.et || data.chinmay?.hc || '';
    
    // Check if this verse is in favorites
    const isFavorite = isFavoriteVerse(chapter, verseNum);
    const bookmarkIcon = isFavorite ? 'fas fa-bookmark' : 'far fa-bookmark';
    const bookmarkClass = isFavorite ? 'text-orange-600' : '';
    
    return `
        <div class="verse-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-orange-800">
                    Chapter <span class="chapter-num">${chapter}</span>, 
                    Verse <span class="verse-num">${verseNum}</span>
                </h3>
                <div class="flex space-x-2">
                    <button class="play-audio-btn p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors" aria-label="Play audio">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button class="bookmark-btn p-2 bg-orange-100 ${bookmarkClass} rounded-full hover:bg-orange-200 transition-colors" aria-label="Bookmark verse">
                        <i class="${bookmarkIcon}"></i>
                    </button>
                    <button class="share-btn p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors" aria-label="Share verse">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
            <div class="space-y-4">
                <div class="bg-orange-50 rounded-lg p-4 relative">
                    <p class="verse-sanskrit text-gray-800 font-sanskrit mb-2">${data.slok || 'Sanskrit not available'}</p>
                    <p class="verse-transliteration text-gray-600 text-sm">${data.transliteration || 'Transliteration not available'}</p>
                    
                    <!-- Audio Player (Hidden Initially) -->
                    <div class="audio-player hidden mt-4 pt-4 border-t border-orange-200">
                        <audio controls class="w-full">
                            <source src="/assets/audio/verses/ch${chapter}_v${verseNum}.mp3" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <p class="verse-translation text-gray-700">${mainTranslation}</p>
                    ${commentaryText ? `
                        <p class="verse-commentary text-gray-600 italic text-sm">${commentaryText}</p>
                    ` : ''}
                    
                    <!-- Theme Tag -->
                    <div class="mt-4 flex items-center">
                        <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            <i class="fas fa-tag mr-1"></i>
                            <span class="verse-theme">${theme}</span>
                        </span>
                    </div>
                </div>
                
                <div class="pt-4 flex justify-between">
                    <button class="read-more-btn px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        Read More
                    </button>
                    
                    <!-- Practice Button -->
                    <a href="/pages/practice.php?chapter=${chapter}&verse=${verseNum}" class="practice-btn px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors flex items-center">
                        <i class="fas fa-om mr-2"></i>
                        <span>Practice</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Create HTML for compact display mode
function createCompactVerseHtml(verse) {
    const { data, chapter, verse: verseNum, theme } = verse;
    
    // Get translations
    const tejTranslation = data.tej?.ht || '';
    const sivaTranslation = data.siva?.et || '';
    const mainTranslation = tejTranslation || sivaTranslation || 'Translation not available';
    
    // Check if this verse is in favorites
    const isFavorite = isFavoriteVerse(chapter, verseNum);
    const bookmarkIcon = isFavorite ? 'fas fa-bookmark' : 'far fa-bookmark';
    const bookmarkClass = isFavorite ? 'text-orange-600' : '';
    
    return `
        <div class="verse-card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col md:flex-row">
            <div class="md:w-2/5 mb-3 md:mb-0 md:mr-4">
                <h3 class="text-lg font-medium text-orange-800 mb-2">
                    Chapter <span class="chapter-num">${chapter}</span>, 
                    Verse <span class="verse-num">${verseNum}</span>
                </h3>
                <p class="verse-sanskrit text-gray-800 font-sanskrit text-sm bg-orange-50 p-2 rounded">${data.slok || 'Sanskrit not available'}</p>
            </div>
            <div class="md:w-3/5 flex flex-col justify-between">
                <p class="verse-translation text-gray-700 mb-3">${mainTranslation}</p>
                <div class="flex justify-between items-center">
                    <button class="read-more-btn px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors">
                        Read More
                    </button>
                    <div class="flex space-x-2">
                        <button class="play-audio-btn p-1.5 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors text-sm" aria-label="Play audio">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <button class="bookmark-btn p-1.5 bg-orange-100 ${bookmarkClass} rounded-full hover:bg-orange-200 transition-colors text-sm" aria-label="Bookmark verse">
                            <i class="${bookmarkIcon}"></i>
                        </button>
                        <button class="share-btn p-1.5 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors text-sm" aria-label="Share verse">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Attach event listeners to verse card
function attachVerseCardListeners(verseElement, verse) {
    const { chapter, verse: verseNum } = verse;
    
    // Read more button
    const readMoreBtn = verseElement.querySelector('.read-more-btn');
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', function() {
            showVerseDetails(chapter, verseNum);
        });
    }
    
    // Play audio button
    const playAudioBtn = verseElement.querySelector('.play-audio-btn');
    if (playAudioBtn) {
        playAudioBtn.addEventListener('click', function() {
            const audioPlayer = verseElement.querySelector('.audio-player');
            if (audioPlayer) {
                if (audioPlayer.classList.contains('hidden')) {
                    audioPlayer.classList.remove('hidden');
                    
                    // Start playing
                    const audio = audioPlayer.querySelector('audio');
                    if (audio) {
                        audio.play().catch(error => {
                            console.warn('Audio playback error:', error);
                            // Show a message about the audio
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
            }
        });
    }
    
    // Bookmark button
    const bookmarkBtn = verseElement.querySelector('.bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', function() {
            toggleFavorite(chapter, verseNum);
            
            // Update icon
            const isFav = isFavoriteVerse(chapter, verseNum);
            bookmarkBtn.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-bookmark"></i>`;
            
            if (isFav) {
                bookmarkBtn.classList.add('text-orange-600');
            } else {
                bookmarkBtn.classList.remove('text-orange-600');
            }
        });
    }
    
    // Share button
    const shareBtn = verseElement.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            shareVerse(chapter, verseNum);
        });
    }
}

// Show verse details in modal
async function showVerseDetails(chapter, verse) {
    if (!verseModal || !verseDetails) return;

    // Show loading indicator
    verseDetails.innerHTML = `
        <div class="flex justify-center items-center p-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
    `;
    
    // Show modal
    openModal();
    
    try {
        const response = await fetch(`${API_BASE_URL}/${chapter}/${verse}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch verse ${chapter}:${verse}`);
        }
        
        const data = await response.json();
        
        // Add to history
        addToHistory({
            chapter: parseInt(chapter),
            verse: parseInt(verse),
            timestamp: new Date().getTime()
        });
        
        // Check if favorited
        const isFav = isFavoriteVerse(chapter, verse);
        
        // Get translations
        const translations = [];
        if (data.tej?.ht) translations.push({ author: 'Swami Tejomayananda', text: data.tej.ht });
        if (data.siva?.et) translations.push({ author: 'Swami Sivananda', text: data.siva.et });
        if (data.purohit?.et) translations.push({ author: 'Shri Purohit Swami', text: data.purohit.et });
        if (data.chinmay?.hc) translations.push({ author: 'Swami Chinmayananda', text: data.chinmay.hc });
        if (data.san?.et) translations.push({ author: 'Dr.S.Sankaranarayan', text: data.san.et });
        if (data.gambir?.et) translations.push({ author: 'Swami Gambirananda', text: data.gambir.et });
        
        // Update modal title
        const modalTitle = verseModal.querySelector('#modal-title');
        if (modalTitle) {
            modalTitle.textContent = `Chapter ${chapter}, Verse ${verse}`;
        }
        
        // Update verse details
        verseDetails.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h4 class="text-2xl font-semibold text-orange-800">
                        Chapter ${chapter}, Verse ${verse}
                    </h4>
                    <div class="flex space-x-2">
                        <button id="verse-audio-btn" class="p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <button id="verse-bookmark-btn" class="p-2 bg-orange-100 ${isFav ? 'text-orange-600' : ''} rounded-full hover:bg-orange-200 transition-colors">
                            <i class="${isFav ? 'fas' : 'far'} fa-bookmark"></i>
                        </button>
                    </div>
                </div>
                
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">Sanskrit</h5>
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <p class="text-gray-800 font-sanskrit text-lg">${data.slok}</p>
                        
                        <!-- Audio Player (Hidden Initially) -->
                        <div id="verse-audio-player" class="hidden mt-4 pt-4 border-t border-orange-200">
                            <audio controls class="w-full">
                                <source src="/assets/audio/verses/ch${chapter}_v${verse}.mp3" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">Transliteration</h5>
                    <p class="text-gray-600 bg-orange-50 p-4 rounded-lg">${data.transliteration || "Not available"}</p>
                </div>
                
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h5 class="font-semibold text-gray-700">Translations & Commentaries</h5>
                        <div class="flex text-sm">
                            <button id="show-all-trans" class="px-3 py-1 bg-orange-100 text-orange-800 rounded-l-lg hover:bg-orange-200 transition-colors">All</button>
                            <button id="show-concise-trans" class="px-3 py-1 bg-gray-100 text-gray-800 rounded-r-lg hover:bg-gray-200 transition-colors">Concise</button>
                        </div>
                    </div>
                    <div id="translations-container" class="space-y-4">
                        ${translations.map((t, i) => `
                            <div class="bg-orange-50 p-4 rounded-lg ${i > 1 ? 'extended-translation' : ''}">
                                <p class="font-medium text-orange-800 mb-2">${t.author}</p>
                                <p class="text-gray-700">${t.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex justify-center gap-4 pt-4 border-t border-gray-200">
                    <a href="/pages/practice.php?chapter=${chapter}&verse=${verse}" class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center">
                        <i class="fas fa-om mr-2"></i>
                        <span>Practice This Verse</span>
                    </a>
                    
                    <button id="share-verse-btn" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                        <i class="fas fa-share-alt mr-2"></i>
                        <span>Share</span>
                    </button>
                </div>
            </div>
        `;
        
        // Attach event listeners
        const audioBtn = document.getElementById('verse-audio-btn');
        if (audioBtn) {
            audioBtn.addEventListener('click', function() {
                const audioPlayer = document.getElementById('verse-audio-player');
                if (audioPlayer) {
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
                }
            });
        }
        
        const bookmarkBtn = document.getElementById('verse-bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', function() {
                toggleFavorite(chapter, verse);
                
                // Update button
                const isFav = isFavoriteVerse(chapter, verse);
                this.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-bookmark"></i>`;
                
                if (isFav) {
                    this.classList.add('text-orange-600');
                } else {
                    this.classList.remove('text-orange-600');
                }
            });
        }
        
        const shareBtn = document.getElementById('share-verse-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function() {
                shareVerse(chapter, verse);
            });
        }
        
        // Translation view toggle
        const showAllBtn = document.getElementById('show-all-trans');
        const showConciseBtn = document.getElementById('show-concise-trans');
        
        if (showAllBtn) {
            showAllBtn.addEventListener('click', function() {
                this.classList.replace('bg-gray-100', 'bg-orange-100');
                this.classList.replace('text-gray-800', 'text-orange-800');
                showConciseBtn.classList.replace('bg-orange-100', 'bg-gray-100');
                showConciseBtn.classList.replace('text-orange-800', 'text-gray-800');
                
                const extended = document.querySelectorAll('.extended-translation');
                extended.forEach(el => el.style.display = 'block');
            });
        }
        
        if (showConciseBtn) {
            showConciseBtn.addEventListener('click', function() {
                this.classList.replace('bg-gray-100', 'bg-orange-100');
                this.classList.replace('text-gray-800', 'text-orange-800');
                showAllBtn.classList.replace('bg-orange-100', 'bg-gray-100');
                showAllBtn.classList.replace('text-orange-800', 'text-gray-800');
                
                const extended = document.querySelectorAll('.extended-translation');
                extended.forEach(el => el.style.display = 'none');
            });
        }
        
    } catch (error) {
        console.error('Error fetching verse details:', error);
        verseDetails.innerHTML = `
            <div class="text-red-500 p-4 bg-red-50 rounded-lg text-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                Failed to load verse details. Please try again later.
            </div>
        `;
    }
}

// Open verse modal
function openModal() {
    if (!verseModal) return;
    verseModal.classList.remove('hidden');
    verseModal.classList.add('flex');
}

// Close verse modal
function closeModal() {
    if (!verseModal) return;
    verseModal.classList.add('hidden');
    verseModal.classList.remove('flex');
}

// Set view mode for verse display
function setViewMode(mode) {
    if (!displayOptions) return;
    
    // Update mode
    viewMode = mode;
    localStorage.setItem('gyangita_view_mode', mode);
    
    // Update UI
    updateViewModeUI();
    
    // Redisplay verses with new mode
    if (currentVerses.length > 0) {
        fetchVerses(currentVerses);
    }
}

// Update view mode UI
function updateViewModeUI() {
    if (!displayOptions) return;
    
    // Update toggle buttons
    const toggles = displayOptions.querySelectorAll('.display-toggle');
    toggles.forEach(toggle => {
        if (toggle.dataset.view === viewMode) {
            toggle.classList.remove('bg-gray-200', 'text-gray-700');
            toggle.classList.add('bg-orange-600', 'text-white');
        } else {
            toggle.classList.remove('bg-orange-600', 'text-white');
            toggle.classList.add('bg-gray-200', 'text-gray-700');
        }
    });
}

// Share a verse
function shareVerse(chapter, verse) {
    const text = `Discover this profound verse from Bhagavad Gita - Chapter ${chapter}, Verse ${verse}`;
    const url = `${window.location.origin}/pages/browse.php?chapter=${chapter}&verse=${verse}`;
    
    // Use navigator.share if available (mobile devices)
    if (navigator.share) {
        navigator.share({
            title: 'GyanGita - Bhagavad Gita Verse',
            text: text,
            url: url
        }).catch(error => {
            console.warn('Share failed:', error);
            // Fallback to WhatsApp share
            shareOnWhatsApp(text, url);
        });
    } else {
        // Fallback to WhatsApp share
        shareOnWhatsApp(text, url);
    }
}

// Share on WhatsApp
function shareOnWhatsApp(text, url) {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
    window.open(whatsappUrl, '_blank');
}

// Share verse collection
function shareVerseCollection() {
    if (currentVerses.length === 0) {
        alert('No verses selected to share.');
        return;
    }
    
    // Create sharing text
    let text = 'Profound verses from Bhagavad Gita:\n\n';
    
    currentVerses.forEach((verse, index) => {
        text += `${index+1}. Chapter ${verse.chapter}, Verse ${verse.text}\n`;
    });
    
    text += '\nDiscover your own personalized guidance at GyanGita.com';
    
    // Create share URL
    const url = window.location.origin;
    
    // Share
    if (navigator.share) {
        navigator.share({
            title: 'GyanGita - Bhagavad Gita Verses',
            text: text,
            url: url
        }).catch(error => {
            console.warn('Share failed:', error);
            shareOnWhatsApp(text, url);
        });
    } else {
        shareOnWhatsApp(text, url);
    }
}

// Create practice plan
function createPracticePlan() {
    if (currentVerses.length === 0) {
        alert('No verses selected for practice.');
        return;
    }
    
    // Redirect to practice page with selected verses
    const verseParams = currentVerses.map(v => `verse[]=${v.chapter}-${v.text}`).join('&');
    window.location.href = `/pages/practice.php?${verseParams}`;
}

// Favorites Management
function toggleFavorite(chapter, verse) {
    const favorites = getFavorites();
    const verseKey = `${chapter}-${verse}`;
    
    // Check if already favorite
    const index = favorites.findIndex(fav => fav.chapter == chapter && fav.verse == verse);
    
    if (index !== -1) {
        // Remove from favorites
        favorites.splice(index, 1);
    } else {
        // Add to favorites
        favorites.push({
            chapter: parseInt(chapter),
            verse: parseInt(verse),
            timestamp: new Date().getTime()
        });
    }
    
    // Save updated favorites
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Check if verse is in favorites
function isFavoriteVerse(chapter, verse) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.chapter == chapter && fav.verse == verse);
}

// Get favorites from localStorage
function getFavorites() {
    try {
        const favoritesJson = localStorage.getItem(FAVORITES_KEY);
        return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (e) {
        console.error("Error loading favorites:", e);
        return [];
    }
}

// Save current verses to favorites
function saveCurrentVersesToFavorites() {
    if (currentVerses.length === 0) {
        alert('No verses selected to save.');
        return;
    }
    
    // Get current favorites
    const favorites = getFavorites();
    
    // Count how many are already saved
    let alreadySaved = 0;
    let newlySaved = 0;
    
    // Add each verse to favorites if not already there
    currentVerses.forEach(verse => {
        const isAlreadySaved = favorites.some(fav => 
            fav.chapter == verse.chapter && fav.verse == verse.text
        );
        
        if (isAlreadySaved) {
            alreadySaved++;
        } else {
            favorites.push({
                chapter: parseInt(verse.chapter),
                verse: parseInt(verse.text),
                timestamp: new Date().getTime()
            });
            newlySaved++;
        }
    });
    
    // Save updated favorites
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    
    // Show confirmation message
    let message = '';
    if (newlySaved > 0) {
        message = `Saved ${newlySaved} verse${newlySaved > 1 ? 's' : ''} to favorites`;
        if (alreadySaved > 0) {
            message += ` (${alreadySaved} already saved)`;
        }
    } else {
        message = `All verses are already in your favorites`;
    }
    
    alert(message);
    
    // Refresh verse display to update bookmark icons
    if (newlySaved > 0 && currentVerses.length > 0) {
        fetchVerses(currentVerses);
    }
}

// History Management
function addToHistory(item) {
    try {
        const history = getHistory();
        
        // Check if already in history
        const existingIndex = history.findIndex(h => h.chapter == item.chapter && h.verse == item.verse);
        if (existingIndex !== -1) {
            // Update timestamp
            history[existingIndex].timestamp = item.timestamp;
        } else {
            // Add new item
            history.push(item);
        }
        
        // Keep history limited to MAX_HISTORY_ITEMS
        if (history.length > MAX_HISTORY_ITEMS) {
            // Sort by timestamp (newest first) and trim
            history.sort((a, b) => b.timestamp - a.timestamp);
            history.length = MAX_HISTORY_ITEMS;
        }
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Error updating history:", e);
    }
}

// Get history from localStorage
function getHistory() {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (e) {
        console.error("Error loading history:", e);
        return [];
    }
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.fetchVerses = fetchVerses;
    window.showVerseDetails = showVerseDetails;
    window.shareVerse = shareVerse;
    window.openModal = openModal;
    window.closeModal = closeModal;
}