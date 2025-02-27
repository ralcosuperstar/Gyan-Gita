/**
 * GyanGita Practice Functionality
 * Handles practice sessions for recitation, reflection, and meditation
 */

// Configuration
const API_BASE_URL = 'https://vedicscriptures.github.io/slok';
const PRACTICE_KEY = 'gyangita_practice';

// DOM Elements
let practiceContent;
let practiceDuration = 0;
let practiceTimer;
let practiceActive = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize practice content
    practiceContent = document.getElementById('practice-content');
    
    if (practiceContent) {
        // Load practice content
        const chapter = practiceContent.dataset.chapter;
        const verse = practiceContent.dataset.verse;
        const type = practiceContent.dataset.type;
        
        if (chapter && verse && type) {
            loadPracticeContent(chapter, verse, type);
        }
    }
    
    // Load recommended practice verses
    const recommendedContainer = document.getElementById('recommended-practice-verses');
    if (recommendedContainer) {
        loadRecommendedPracticeVerses();
    }
    
    // Initialize practice calendar
    initializePracticeCalendar();
    
    // Load practice stats
    loadPracticeStats();
});

// Load practice content
async function loadPracticeContent(chapter, verse, type) {
    if (!practiceContent) return;
    
    try {
        // Fetch verse data from API
        const response = await fetch(`${API_BASE_URL}/${chapter}/${verse}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch verse ${chapter}:${verse}`);
        }
        
        const data = await response.json();
        
        // Generate practice content based on type
        let content = '';
        
        if (type === 'recitation') {
            content = generateRecitationContent(data, chapter, verse);
        } else if (type === 'reflection') {
            content = generateReflectionContent(data, chapter, verse);
        } else if (type === 'meditation') {
            content = generateMeditationContent(data, chapter, verse);
        }
        
        // Update practice content
        practiceContent.innerHTML = content;
        
        // Initialize practice-specific functionality
        if (type === 'recitation') {
            initializeRecitationPractice();
        } else if (type === 'reflection') {
            initializeReflectionPractice();
        } else if (type === 'meditation') {
            initializeMeditationPractice();
        }
    } catch (error) {
        console.error('Error loading practice content:', error);
        practiceContent.innerHTML = `
            <div class="text-red-500 p-4 bg-red-50 rounded-lg text-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                Failed to load practice content. Please try again later.
            </div>
        `;
    }
}

// Generate recitation practice content
function generateRecitationContent(data, chapter, verse) {
    const sanskritText = data.slok || 'Sanskrit text not available';
    const transliteration = data.transliteration || 'Transliteration not available';
    
    return `
        <div class="bg-orange-50 p-6 rounded-xl">
            <h2 class="text-2xl font-semibold text-orange-800 mb-6">Recitation Practice</h2>
            
            <div class="bg-white rounded-lg p-6 mb-8">
                <h3 class="text-xl font-medium text-gray-800 mb-4">Chapter ${chapter}, Verse ${verse}</h3>
                
                <div class="mb-6">
                    <h4 class="font-medium text-gray-700 mb-2">Sanskrit</h4>
                    <p class="text-gray-800 bg-orange-50 p-4 rounded-lg font-sanskrit text-lg mb-4 leading-relaxed">${sanskritText}</p>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-medium text-gray-700 mb-2">Transliteration</h4>
                    <p class="text-gray-800 bg-orange-50 p-4 rounded-lg leading-relaxed">${transliteration}</p>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-medium text-gray-700 mb-2">Practice Audio</h4>
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <button id="play-audio-btn" class="flex items-center text-orange-700 hover:text-orange-800 transition-colors">
                            <i class="fas fa-play-circle text-2xl mr-2"></i>
                            <span>Listen to Recitation</span>
                        </button>
                        <div id="recitation-audio-player" class="hidden mt-4">
                            <audio controls class="w-full">
                                <source src="/assets/audio/verses/ch${chapter}_v${verse}.mp3" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-medium text-gray-700 mb-2">Practice Instructions</h4>
                    <ol class="list-decimal ml-5 space-y-2 text-gray-700">
                        <li>Listen to the recitation audio 2-3 times to familiarize yourself with the pronunciation.</li>
                        <li>Practice reciting along with the audio.</li>
                        <li>Try reciting on your own, checking with the audio if needed.</li>
                        <li>Focus on the rhythm and correct pronunciation of each syllable.</li>
                        <li>Gradually build speed and fluency with regular practice.</li>
                    </ol>
                </div>
            </div>
            
            <!-- Practice Timer -->
            <div class="bg-white rounded-lg p-6 mb-8">
                <h3 class="text-xl font-medium text-gray-800 mb-4">Practice Session</h3>
                
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <p class="text-gray-700 mb-2">Time elapsed:</p>
                        <div class="text-4xl font-bold text-orange-600" id="practice-timer">00:00</div>
                    </div>
                    
                    <div class="flex flex-wrap gap-2">
                        <button id="start-practice-btn" class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center">
                            <i class="fas fa-play mr-2"></i>
                            <span>Start Practice</span>
                        </button>
                        
                        <button id="pause-practice-btn" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center hidden">
                            <i class="fas fa-pause mr-2"></i>
                            <span>Pause</span>
                        </button>
                        
                        <button id="complete-practice-btn" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                            <i class="fas fa-check mr-2"></i>
                            <span>Complete Practice</span>
                        </button>
                    </div>
                </div>
                
               <div class="text-gray-700">
                    <p>Track your practice time to build consistency and measure progress. Regular practice helps improve pronunciation and memorization.</p>
                </div>
            </div>
            
            <!-- Practice Notes -->
            <div class="bg-white rounded-lg p-6">
                <h3 class="text-xl font-medium text-gray-800 mb-4">Practice Notes</h3>
                <textarea id="practice-notes" class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" rows="4" placeholder="Note your observations, challenges, and progress here..."></textarea>
                <div class="mt-4 text-right">
                    <button id="save-notes-btn" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        Save Notes
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate reflection practice content
function generateReflectionContent(data, chapter, verse) {
    const sanskritText = data.slok || 'Sanskrit text not available';
    const translation = data.tej?.ht || data.siva?.et || 'Translation not available';
    
    return `
        <div class="bg-green-50 p-6 rounded-xl">
            <h2 class="text-2xl font-semibold text-green-800 mb-6">Guided Reflection</h2>
            
            <div class="bg-white rounded-lg p-6 mb-8">
                <h3 class="text-xl font-medium text-gray-800 mb-4">Chapter ${chapter}, Verse ${verse}</h3>
                
                <div class="mb-6">
                    <h4 class="font-medium text-gray-700 mb-2">Sanskrit</h4>
                    <p class="text-gray-800 bg-green-50 p-4 rounded-lg font-sanskrit mb-4">${sanskritText}</p>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-medium text-gray-700 mb-2">Translation</h4>
                    <p class="text-gray-800 bg-green-50 p-4 rounded-lg">${translation}</p>
                </div>
            </div>
            
            <!-- Reflection Prompts -->
            <div class="bg-white rounded-lg p-6 mb-8">
                <h3 class="text-xl font-medium text-gray-800 mb-4">Reflection Prompts</h3>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="font-medium text-gray-700 mb-2">1. Understanding</h4>
                        <p class="text-gray-600 mb-3">What is the core message of this verse? How would you explain it in your own words?</p>
                        <textarea class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" rows="3" placeholder="Write your thoughts here..."></textarea>
                    </div>
                    
                    <div>
                        <h4 class="font-medium text-gray-700 mb-2">2. Personal Application</h4>
                        <p class="text-gray-600 mb-3">How does this teaching relate to your current life situation? Can you think of a specific example?</p>
                        <textarea class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" rows="3" placeholder="Write your thoughts here..."></textarea>
                    </div>
                    
                    <div>
                        <h4 class="font-medium text-gray-700 mb-2">3. Challenges</h4>
                        <p class="text-gray-600 mb-3">What aspects of this teaching do you find challenging to implement? What obstacles might you face?</p>
                        <textarea class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" rows="3" placeholder="Write your thoughts here..."></textarea>
                    </div>
                    
                    <div>
                        <h4 class="font-medium text-gray-700 mb-2">4. Action Steps</h4>
                        <p class="text-gray-600 mb-3">What is one practical step you can take today to apply this wisdom in your life?</p>
                        <textarea class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" rows="3" placeholder="Write your thoughts here..."></textarea>
                    </div>
                </div>
            </div>
            
            <!-- Practice Timer -->
            <div class="bg-white rounded-lg p-6 mb-8">
                <h3 class="text-xl font-medium text-gray-800 mb-4">Reflection Session</h3>
                
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <p class="text-gray-700 mb-2">Time spent reflecting:</p>
                        <div class="text-4xl font-bold text-green-600" id="practice-timer">00:00</div>
                    </div>
                    
                    <div class="flex flex-wrap gap-2">
                        <button id="start-practice-btn" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                            <i class="fas fa-play mr-2"></i>
                            <span>Start Reflection</span>
                        </button>
                        
                        <button id="pause-practice-btn" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center hidden">
                            <i class="fas fa-pause mr-2"></i>
                            <span>Pause</span>
                        </button>
                        
                        <button id="complete-practice-btn" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                            <i class="fas fa-check mr-2"></i>
                            <span>Complete Reflection</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Save Reflection -->
            <div class="bg-white rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-medium text-gray-800">Save Your Reflection</h3>
                    <div class="flex items-center">
                        <input type="checkbox" id="save-privately" class="mr-2">
                        <label for="save-privately" class="text-gray-700">Save privately</label>
                    </div>
                </div>
                
                <button id="save-reflection-btn" class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Save Reflection
                </button>
                
                <p class="mt-3 text-sm text-gray-600 text-center">
                    Your reflections help deepen your understanding and track your spiritual journey.
                </p>
            </div>
        </div>
    `;
}

// Generate meditation practice content
function generateMeditationContent(data, chapter, verse) {
    const translation = data.tej?.ht || data.siva?.et || 'Translation not available';
    
    return `
        <div class="bg-blue-50 p-6 rounded-xl">
            <h2 class="text-2xl font-semibold text-blue-800 mb-6">Verse Meditation</h2>
            
            <div class="bg-white rounded-lg p-6 mb-8">
                <h3 class="text-xl font-medium text-gray-800 mb-4">Chapter ${chapter}, Verse ${verse}</h3>
                
                <div class="mb-6">
                    <h4 class="font-medium text-gray-700 mb-2">Meditation Verse</h4>
                    <p class="text-gray-800 bg-blue-50 p-4 rounded-lg">${translation}</p>
                </div>
            </div>
            
            <!-- Meditation Settings -->
            <div class="bg-white rounded-lg p-6 mb-8">
                <h3 class="text-xl font-medium text-gray-800 mb-4">Meditation Settings</h3>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">Duration</label>
                        <select id="meditation-duration" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option value="5">5 minutes</option>
                            <option value="10" selected>10 minutes</option>
                            <option value="15">15 minutes</option>
                            <option value="20">20 minutes</option>
                            <option value="30">30 minutes</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">Background Sound</label>
                        <select id="meditation-sound" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option value="none">None (Silence)</option>
                            <option value="om" selected>Om Chanting</option>
                            <option value="nature">Nature Sounds</option>
                            <option value="flute">Bamboo Flute</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label class="block text-gray-700 font-medium mb-2">Interval Bell</label>
                    <select id="meditation-bell" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="none">No Bell</option>
                        <option value="1">Every 1 minute</option>
                        <option value="3" selected>Every 3 minutes</option>
                        <option value="5">Every 5 minutes</option>
                    </select>
                </div>
            </div>
            
            <!-- Meditation Guide -->
            <div class="bg-white rounded-lg p-6 mb-8">
                <h3 class="text-xl font-medium text-gray-800 mb-4">Meditation Guide</h3>
                
                <div class="space-y-4 text-gray-700">
                    <p>
                        <span class="font-medium">1. Preparation:</span> 
                        Find a quiet place where you won't be disturbed. Sit in a comfortable position with your back straight.
                    </p>
                    <p>
                        <span class="font-medium">2. Begin with Breath Awareness:</span> 
                        Take a few deep breaths, then allow your breathing to return to its natural rhythm. Spend 1-2 minutes simply observing your breath.
                    </p>
                    <p>
                        <span class="font-medium">3. Contemplate the Verse:</span> 
                        Bring your attention to the verse. Read it slowly in your mind, feeling its meaning and significance.
                    </p>
                    <p>
                        <span class="font-medium">4. Deep Reflection:</span> 
                        Allow the wisdom of the verse to penetrate your consciousness. How does it relate to your life? What insights arise?
                    </p>
                    <p>
                        <span class="font-medium">5. Return to Center:</span> 
                        If your mind wanders, gently bring it back to the verse and your breath. Stay present with the teaching.
                    </p>
                    <p>
                        <span class="font-medium">6. Closing:</span> 
                        When the timer ends, take a moment to express gratitude for this practice. Slowly bring your awareness back to your surroundings.
                    </p>
                </div>
            </div>
            
            <!-- Meditation Timer -->
            <div class="bg-white rounded-lg p-6 mb-8">
                <div id="meditation-inactive" class="text-center py-8">
                    <button id="start-meditation-btn" class="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center text-lg">
                        <i class="fas fa-play mr-3"></i>
                        <span>Begin Meditation</span>
                    </button>
                </div>
                
                <div id="meditation-active" class="hidden">
                    <div class="text-center mb-8">
                        <div class="text-5xl font-bold text-blue-600 mb-2" id="meditation-timer">10:00</div>
                        <p class="text-gray-600" id="meditation-status">Meditation in progress</p>
                    </div>
                    
                    <div id="meditation-guidance" class="bg-blue-50 p-4 rounded-lg mb-8">
                        <p class="text-gray-700 text-center">
                            Find a comfortable seated position. Close your eyes, and bring your attention to your breath.
                        </p>
                    </div>
                    
                    <div class="flex justify-center space-x-4">
                        <button id="pause-meditation-btn" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center">
                            <i class="fas fa-pause mr-2"></i>
                            <span>Pause</span>
                        </button>
                        
                        <button id="stop-meditation-btn" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
                            <i class="fas fa-stop mr-2"></i>
                            <span>End Early</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Meditation Notes -->
            <div class="bg-white rounded-lg p-6">
                <h3 class="text-xl font-medium text-gray-800 mb-4">Post-Meditation Reflection</h3>
                <textarea id="meditation-notes" class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="4" placeholder="Record any insights, feelings, or experiences that arose during your meditation..."></textarea>
                <div class="mt-4 text-right">
                    <button id="save-meditation-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Save Reflection
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Initialize recitation practice
function initializeRecitationPractice() {
    // Audio player toggle
    const playAudioBtn = document.getElementById('play-audio-btn');
    const audioPlayer = document.getElementById('recitation-audio-player');
    
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
    
    // Initialize practice timer controls
    initializePracticeTimer();
    
    // Save notes button
    const saveNotesBtn = document.getElementById('save-notes-btn');
    const practiceNotes = document.getElementById('practice-notes');
    
    if (saveNotesBtn && practiceNotes) {
        saveNotesBtn.addEventListener('click', function() {
            const notes = practiceNotes.value.trim();
            if (notes) {
                alert('Notes saved successfully!');
            } else {
                alert('Please enter some notes before saving.');
            }
        });
    }
}

// Initialize reflection practice
function initializeReflectionPractice() {
    // Initialize practice timer controls
    initializePracticeTimer();
    
    // Save reflection button
    const saveReflectionBtn = document.getElementById('save-reflection-btn');
    
    if (saveReflectionBtn) {
        saveReflectionBtn.addEventListener('click', function() {
            // Check if any reflections were entered
            const textareas = document.querySelectorAll('textarea');
            let hasContent = false;
            
            textareas.forEach(textarea => {
                if (textarea.value.trim()) {
                    hasContent = true;
                }
            });
            
            if (hasContent) {
                alert('Reflection saved successfully!');
            } else {
                alert('Please enter at least one reflection before saving.');
            }
        });
    }
}

// Initialize meditation practice
function initializeMeditationPractice() {
    const startMeditationBtn = document.getElementById('start-meditation-btn');
    const meditationInactive = document.getElementById('meditation-inactive');
    const meditationActive = document.getElementById('meditation-active');
    const pauseMeditationBtn = document.getElementById('pause-meditation-btn');
    const stopMeditationBtn = document.getElementById('stop-meditation-btn');
    const meditationTimer = document.getElementById('meditation-timer');
    const meditationGuidance = document.getElementById('meditation-guidance');
    const durationSelect = document.getElementById('meditation-duration');
    const soundSelect = document.getElementById('meditation-sound');
    const bellSelect = document.getElementById('meditation-bell');
    
    let meditationInterval;
    let secondsLeft = 0;
    let isPaused = false;
    
    // Meditation guidance prompts
    const guidancePrompts = [
        "Find a comfortable seated position. Close your eyes, and bring your attention to your breath.",
        "As you breathe, let the words of the verse settle in your mind.",
        "Consider what this verse means in your life right now.",
        "Release any thoughts or judgments that arise. Return to the essence of the teaching.",
        "Feel the wisdom of the verse resonating within you.",
        "Imagine how you might embody this teaching in your daily actions."
    ];
    
    if (startMeditationBtn && meditationInactive && meditationActive) {
        startMeditationBtn.addEventListener('click', function() {
            // Get settings
            const duration = parseInt(durationSelect.value) || 10;
            const sound = soundSelect.value;
            const bellInterval = parseInt(bellSelect.value) || 0;
            
            // Convert minutes to seconds
            secondsLeft = duration * 60;
            
            // Show active meditation UI
            meditationInactive.classList.add('hidden');
            meditationActive.classList.remove('hidden');
            
            // Start timer
            updateMeditationTimer();
            meditationInterval = setInterval(function() {
                if (!isPaused) {
                    secondsLeft--;
                    updateMeditationTimer();
                    
                    // Update guidance prompt every 90 seconds
                    if (secondsLeft % 90 === 0) {
                        const promptIndex = Math.floor(Math.random() * guidancePrompts.length);
                        meditationGuidance.innerHTML = `
                            <p class="text-gray-700 text-center">
                                ${guidancePrompts[promptIndex]}
                            </p>
                        `;
                    }
                    
                    // Play bell at interval if set
                    if (bellInterval > 0 && secondsLeft % (bellInterval * 60) === 0 && secondsLeft > 0) {
                        playMeditationBell();
                    }
                    
                    // End meditation when time is up
                    if (secondsLeft <= 0) {
                        endMeditation();
                    }
                }
            }, 1000);
            
            // Play background sound if selected
            playMeditationSound(sound);
            
            // Start practice timer
            startPracticeTimer();
        });
        
        // Pause button
        if (pauseMeditationBtn) {
            pauseMeditationBtn.addEventListener('click', function() {
                isPaused = !isPaused;
                
                if (isPaused) {
                    this.innerHTML = `
                        <i class="fas fa-play mr-2"></i>
                        <span>Resume</span>
                    `;
                    document.getElementById('meditation-status').textContent = 'Meditation paused';
                } else {
                    this.innerHTML = `
                        <i class="fas fa-pause mr-2"></i>
                        <span>Pause</span>
                    `;
                    document.getElementById('meditation-status').textContent = 'Meditation in progress';
                }
            });
        }
        
        // Stop button
        if (stopMeditationBtn) {
            stopMeditationBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to end the meditation early?')) {
                    endMeditation();
                }
            });
        }
    }
    
    // Save meditation button
    const saveMeditationBtn = document.getElementById('save-meditation-btn');
    const meditationNotes = document.getElementById('meditation-notes');
    
    if (saveMeditationBtn && meditationNotes) {
        saveMeditationBtn.addEventListener('click', function() {
            const notes = meditationNotes.value.trim();
            if (notes) {
                alert('Meditation reflection saved successfully!');
            } else {
                alert('Please enter your meditation reflection before saving.');
            }
        });
    }
    
    // Helper function to update meditation timer
    function updateMeditationTimer() {
        if (!meditationTimer) return;
        
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        
        meditationTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Helper function to end meditation
    function endMeditation() {
        clearInterval(meditationInterval);
        
        // Show completion message
        meditationGuidance.innerHTML = `
            <p class="text-gray-700 text-center">
                Your meditation is complete. Take a moment to observe how you feel and record any insights below.
            </p>
        `;
        
        document.getElementById('meditation-status').textContent = 'Meditation completed';
        
        // Stop background sound
        stopMeditationSound();
        
        // Play final bell
        playMeditationBell();
        
        // Show stop meditation button only
        if (pauseMeditationBtn) pauseMeditationBtn.classList.add('hidden');
        if (stopMeditationBtn) {
            stopMeditationBtn.innerHTML = `
                <i class="fas fa-check mr-2"></i>
                <span>Done</span>
            `;
        }
        
        // Stop practice timer
        completePracticeSession();
    }
    
    // Helper function to play meditation sound
    function playMeditationSound(sound) {
        // In a real implementation, this would play the selected background sound
        console.log(`Playing ${sound} meditation sound`);
    }
    
    // Helper function to stop meditation sound
    function stopMeditationSound() {
        // In a real implementation, this would stop the background sound
        console.log('Stopping meditation sound');
    }
    
    // Helper function to play interval bell
    function playMeditationBell() {
        // In a real implementation, this would play a bell sound
        console.log('Playing meditation bell');
    }
}

// Initialize practice timer
function initializePracticeTimer() {
    const startBtn = document.getElementById('start-practice-btn');
    const pauseBtn = document.getElementById('pause-practice-btn');
    const completeBtn = document.getElementById('complete-practice-btn');
    const timerDisplay = document.getElementById('practice-timer');
    
    if (!startBtn || !pauseBtn || !completeBtn || !timerDisplay) return;
    
    let timerInterval;
    let isRunning = false;
    
    // Start button
    startBtn.addEventListener('click', function() {
        if (!isRunning) {
            startPracticeTimer();
            
            // Update UI
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            isRunning = true;
        }
    });
    
    // Pause button
    pauseBtn.addEventListener('click', function() {
        if (isRunning) {
            clearInterval(timerInterval);
            
            // Update UI
            pauseBtn.innerHTML = `
                <i class="fas fa-play mr-2"></i>
                <span>Resume</span>
            `;
            isRunning = false;
        } else {
            timerInterval = setInterval(updateTimer, 1000);
            
            // Update UI
            pauseBtn.innerHTML = `
                <i class="fas fa-pause mr-2"></i>
                <span>Pause</span>
            `;
            isRunning = true;
        }
    });
    
    // Complete button
    completeBtn.addEventListener('click', function() {
        completePracticeSession();
    });
    
    // Helper function to update timer
    function updateTimer() {
        practiceDuration++;
        
        const minutes = Math.floor(practiceDuration / 60);
        const seconds = practiceDuration % 60;
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Start practice timer
function startPracticeTimer() {
    practiceActive = true;
    practiceDuration = 0;
    
    const timerDisplay = document.getElementById('practice-timer');
    if (!timerDisplay) return;
    
    // Reset display
    timerDisplay.textContent = '00:00';
    
    // Start timer
    practiceTimer = setInterval(function() {
        practiceDuration++;
        
        const minutes = Math.floor(practiceDuration / 60);
        const seconds = practiceDuration % 60;
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Complete practice session
function completePracticeSession() {
    if (!practiceActive) return;
    
    // Stop timer
    clearInterval(practiceTimer);
    practiceActive = false;
    
    // Get practice details
    const chapter = practiceContent.dataset.chapter;
    const verse = practiceContent.dataset.verse;
    const type = practiceContent.dataset.type;
    
    // Save practice session
    savePracticeSession(chapter, verse, type, practiceDuration);
    
    // Show completion message
    alert(`Practice session completed! You practiced for ${Math.floor(practiceDuration / 60)} minutes and ${practiceDuration % 60} seconds.`);
    
    // Reload page to show updated stats
    window.location.reload();
}

// Save practice session
function savePracticeSession(chapter, verse, type, duration) {
    // Get existing practice data
    const practiceData = getPracticeData();
    
    // Add new session
    practiceData.sessions.push({
        chapter: parseInt(chapter),
        verse: parseInt(verse),
        type: type,
        duration: Math.ceil(duration / 60), // Round up to minutes
        timestamp: Date.now()
    });
    
    // Update stats
    practiceData.totalMinutes += Math.ceil(duration / 60);
    practiceData.sessionCount++;
    practiceData.verseCount++;
    
    // Update chapters explored
    if (!practiceData.chapters.includes(parseInt(chapter))) {
        practiceData.chapters.push(parseInt(chapter));
    }
    
    // Update last practice date
    practiceData.lastPractice = Date.now();
    
    // Update streak
    updatePracticeStreak(practiceData);
    
    // Update practice by type
    if (!practiceData.byType[type]) {
        practiceData.byType[type] = 0;
    }
    practiceData.byType[type]++;
    
    // Save updated data
    localStorage.setItem(PRACTICE_KEY, JSON.stringify(practiceData));
}

// Update practice streak
function updatePracticeStreak(practiceData) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    if (!practiceData.lastPracticeDay) {
        // First practice
        practiceData.streak = 1;
        practiceData.lastPracticeDay = today;
    } else {
        const lastPracticeDay = new Date(practiceData.lastPracticeDay);
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        if (today === practiceData.lastPracticeDay) {
            // Already practiced today
        } else if (yesterday.getTime() === new Date(practiceData.lastPracticeDay).getTime()) {
            // Practiced yesterday, increment streak
            practiceData.streak++;
            practiceData.lastPracticeDay = today;
        } else {
            // Missed days, reset streak
            practiceData.streak = 1;
            practiceData.lastPracticeDay = today;
        }
    }
}

// Get practice data
function getPracticeData() {
    try {
        const data = localStorage.getItem(PRACTICE_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Error loading practice data:', e);
    }
    
    // Return default data structure
    return {
        totalMinutes: 0,
        streak: 0,
        verseCount: 0,
        sessionCount: 0,
        lastPractice: null,
        lastPracticeDay: null,
        sessions: [],
        chapters: [],
        byType: {
            recitation: 0,
            reflection: 0,
            meditation: 0
        }
    };
}

// Load practice stats
function loadPracticeStats() {
    const practiceData = getPracticeData();
    
    // Update stats displays
    const daysStreakEl = document.getElementById('days-streak');
    const versesPracticedEl = document.getElementById('verses-practiced');
    const practiceMinutesEl = document.getElementById('practice-minutes');
    const chaptersExploredEl = document.getElementById('chapters-explored');
    
    if (daysStreakEl) daysStreakEl.textContent = practiceData.streak;
    if (versesPracticedEl) versesPracticedEl.textContent = practiceData.verseCount;
    if (practiceMinutesEl) practiceMinutesEl.textContent = practiceData.totalMinutes;
    if (chaptersExploredEl) chaptersExploredEl.textContent = practiceData.chapters.length;
}

// Initialize practice calendar
function initializePracticeCalendar() {
    const calendarContainer = document.getElementById('practice-calendar');
    if (!calendarContainer) return;
    
    // Clear existing calendar except headers
    while (calendarContainer.children.length > 7) {
        calendarContainer.removeChild(calendarContainer.lastChild);
    }
    
    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get first day of month (0 = Sunday, 1 = Monday, ...)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // Adjust for Monday as first day of week
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Add empty cells for days before first of month
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarContainer.appendChild(emptyCell);
    }
    
    // Get number of days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get practice data
    const practiceData = getPracticeData();
    const practiceDays = getPracticeDaysInMonth(practiceData, currentYear, currentMonth);
    
    // Add cells for each day of month
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'h-8 w-8 mx-auto rounded-md flex items-center justify-center text-xs';
        
        // Check if practiced on this day
        const dateKey = `${currentYear}-${currentMonth+1}-${day}`;
        if (practiceDays[dateKey]) {
            const intensity = practiceDays[dateKey];
            if (intensity === 'light') {
                cell.classList.add('bg-orange-200', 'text-orange-800');
            } else if (intensity === 'medium') {
                cell.classList.add('bg-orange-300', 'text-orange-800');
            } else if (intensity === 'intense') {
                cell.classList.add('bg-orange-500', 'text-white');
            } else {
                cell.classList.add('bg-gray-200', 'text-gray-700');
            }
        } else {
            cell.classList.add('bg-gray-200', 'text-gray-700');
        }
        
        // Highlight today
        if (day === now.getDate()) {
            cell.classList.add('ring-2', 'ring-orange-600');
        }
        
        cell.textContent = day;
        calendarContainer.appendChild(cell);
    }
}

// Get practice days in month
function getPracticeDaysInMonth(practiceData, year, month) {
    const practiceDays = {};
    
    // Group sessions by day
    practiceData.sessions.forEach(session => {
        const date = new Date(session.timestamp);
        if (date.getFullYear() === year && date.getMonth() === month) {
            const day = date.getDate();
            const dateKey = `${year}-${month+1}-${day}`;
            
            if (!practiceDays[dateKey]) {
                practiceDays[dateKey] = 'light';
            } else if (practiceDays[dateKey] === 'light') {
                practiceDays[dateKey] = 'medium';
            } else if (practiceDays[dateKey] === 'medium') {
                practiceDays[dateKey] = 'intense';
            }
        }
    });
    
    return practiceDays;
}

// Load recommended practice verses
function loadRecommendedPracticeVerses() {
    const container = document.getElementById('recommended-practice-verses');
    if (!container) return;
    
    // In a real implementation, this would fetch personalized recommendations
    // For demo, we'll use static recommendations
    setTimeout(() => {
        const recommendedVerses = [
            { chapter: 2, verse: 47, theme: "Duty without attachment" },
            { chapter: 6, verse: 5, theme: "Self-elevation" },
            { chapter: 2, verse: 14, theme: "Tolerance of dualities" },
            { chapter: 12, verse: 13, theme: "Universal friendship" }
        ];
        
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
        
        container.innerHTML = html;
    }, 1000);
}