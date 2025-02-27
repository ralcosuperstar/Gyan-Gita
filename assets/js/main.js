/**
 * GyanGita Main JavaScript
 * Core functionality for the website
 */

// DOM Elements
let mobileMenuButton;
let mobileMenu;
let scrollToTopButton;
let appInstallBanner;
let dismissInstallButton;
let installAppButton;
let offlineBanner;
let chatToggleButton;
let chatPanel;
let newsletterForm;

// State
let deferredPrompt;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    initializeServiceWorker();
    checkOnlineStatus();
    checkScrollPosition();
    initializeAppInstallBanner();
});

// Initialize DOM elements
function initializeElements() {
    mobileMenuButton = document.getElementById('mobile-menu-button');
    mobileMenu = document.getElementById('mobile-menu');
    scrollToTopButton = document.getElementById('scroll-to-top');
    appInstallBanner = document.getElementById('app-install-banner');
    dismissInstallButton = document.getElementById('dismiss-install');
    installAppButton = document.getElementById('install-app-btn');
    offlineBanner = document.getElementById('offline-banner');
    chatToggleButton = document.getElementById('chat-toggle-btn');
    chatPanel = document.getElementById('chat-panel');
    newsletterForm = document.getElementById('newsletter-form');
}

// Initialize event listeners
function initializeEventListeners() {
    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mobileMenu.classList.contains('hidden')) return;
            if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
    
    // Scroll event for scroll-to-top button
    window.addEventListener('scroll', debounce(checkScrollPosition, 100));
    
    // Scroll to top button click
    if (scrollToTopButton) {
        scrollToTopButton.addEventListener('click', scrollToTop);
    }
    
    // App installation banner
    if (dismissInstallButton) {
        dismissInstallButton.addEventListener('click', dismissAppInstallBanner);
    }
    
    if (installAppButton) {
        installAppButton.addEventListener('click', installApp);
    }
    
    // Online/offline events
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    
    // Chat widget toggle
    if (chatToggleButton && chatPanel) {
        chatToggleButton.addEventListener('click', toggleChatPanel);
        
        // Close chat when clicking outside
        document.addEventListener('click', function(event) {
            if (chatPanel.classList.contains('hidden')) return;
            if (!chatPanel.contains(event.target) && !chatToggleButton.contains(event.target)) {
                chatPanel.classList.add('hidden');
            }
        });
    }
    
    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
}

// Initialize service worker
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function(registration) {
                    console.log('ServiceWorker registered successfully');
                })
                .catch(function(error) {
                    console.error('ServiceWorker registration failed:', error);
                });
        });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('hidden');
    
    // Update aria attributes
    const expanded = !mobileMenu.classList.contains('hidden');
    mobileMenuButton.setAttribute('aria-expanded', expanded.toString());
}

// Check scroll position for scroll-to-top button
function checkScrollPosition() {
    if (!scrollToTopButton) return;
    
    if (window.scrollY > 300) {
        scrollToTopButton.classList.remove('opacity-0', 'invisible');
        scrollToTopButton.classList.add('opacity-100', 'visible');
    } else {
        scrollToTopButton.classList.add('opacity-0', 'invisible');
        scrollToTopButton.classList.remove('opacity-100', 'visible');
    }
}

// Scroll to top of page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Check online/offline status
function checkOnlineStatus() {
    if (!offlineBanner) return;
    
    if (navigator.onLine) {
        offlineBanner.classList.add('hidden');
        // Sync any pending data
        if (window.syncPendingData) {
            window.syncPendingData();
        }
    } else {
        offlineBanner.classList.remove('hidden');
    }
}

// Initialize app install banner
function initializeAppInstallBanner() {
    // Show install banner after 30 seconds if not dismissed
    if (appInstallBanner && !localStorage.getItem('app_banner_dismissed')) {
        setTimeout(() => {
            appInstallBanner.classList.remove('translate-y-full');
        }, 30000);
    }
    
    // Handle beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        // Show install button if it exists
        if (installAppButton) {
            installAppButton.classList.remove('hidden');
        }
    });
    
    // Handle appinstalled event
    window.addEventListener('appinstalled', (evt) => {
        console.log('App was installed');
        // Hide install button and banner after installation
        if (installAppButton) {
            installAppButton.classList.add('hidden');
        }
        if (appInstallBanner) {
            appInstallBanner.classList.add('translate-y-full');
        }
    });
}

// Dismiss app install banner
function dismissAppInstallBanner() {
    if (!appInstallBanner) return;
    
    appInstallBanner.classList.add('translate-y-full');
    localStorage.setItem('app_banner_dismissed', 'true');
}

// Install app
function installApp() {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        // Clear the saved prompt
        deferredPrompt = null;
    });
}

// Toggle chat panel
function toggleChatPanel() {
    if (!chatPanel) return;
    chatPanel.classList.toggle('hidden');
    
    // If opening, focus on input if available
    if (!chatPanel.classList.contains('hidden')) {
        const chatInput = chatPanel.querySelector('#chat-input');
        if (chatInput) {
            chatInput.focus();
        }
        
        // Initialize chat content if empty
        if (!chatPanel.querySelector('.chat-message')) {
            initializeChatContent();
        }
    }
}

// Initialize chat content
function initializeChatContent() {
    if (!chatPanel) return;
    
    chatPanel.innerHTML = `
        <!-- Chat Header -->
        <div class="bg-orange-600 text-white p-4 flex justify-between items-center">
            <div class="flex items-center">
                <i class="fas fa-om text-2xl mr-2"></i>
                <div>
                    <h3 class="font-medium">Gita Guide</h3>
                    <p class="text-xs opacity-80">Powered by Vedic wisdom</p>
                </div>
            </div>
            <button id="close-chat-btn" class="text-white hover:text-orange-200 transition-colors focus:outline-none">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <!-- Chat Messages -->
        <div id="chat-messages" class="h-80 overflow-y-auto p-4 bg-orange-50">
            <!-- Welcome Message -->
            <div class="flex mb-4 chat-message">
                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 flex-shrink-0">
                    <i class="fas fa-om text-orange-600"></i>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                    <p class="text-gray-700">Namaste! I'm your Gita Guide. I can help you find relevant verses, explain concepts from Bhagavad Gita, or provide guidance based on its teachings. How may I assist you today?</p>
                </div>
            </div>
            
            <!-- Suggested Questions -->
            <div class="flex justify-center mb-4">
                <div class="bg-white p-2 rounded-lg shadow-sm text-center">
                    <p class="text-gray-500 text-xs mb-2">Try asking:</p>
                    <div class="space-y-2">
                        <button class="suggestion-btn block w-full text-left text-sm bg-orange-50 hover:bg-orange-100 p-2 rounded text-gray-700 transition-colors" data-question="What does Gita say about stress?">
                            What does Gita say about stress?
                        </button>
                        <button class="suggestion-btn block w-full text-left text-sm bg-orange-50 hover:bg-orange-100 p-2 rounded text-gray-700 transition-colors" data-question="Explain karma yoga">
                            Explain karma yoga
                        </button>
                        <button class="suggestion-btn block w-full text-left text-sm bg-orange-50 hover:bg-orange-100 p-2 rounded text-gray-700 transition-colors" data-question="Verses for finding peace">
                            Verses for finding peace
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Chat Input -->
        <div class="p-4 border-t border-gray-200">
            <form id="chat-form" class="flex">
                <input type="text" id="chat-input" class="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ask about Bhagavad Gita...">
                <button type="submit" class="bg-orange-600 text-white p-2 rounded-r-lg hover:bg-orange-700 transition-colors">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    `;
    
    // Add event listeners
    const closeButton = chatPanel.querySelector('#close-chat-btn');
    if (closeButton) {
        closeButton.addEventListener('click', toggleChatPanel);
    }
    
    const chatForm = chatPanel.querySelector('#chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmission);
    }
    
    const suggestionButtons = chatPanel.querySelectorAll('.suggestion-btn');
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.dataset.question;
            if (question) {
                // Add user message
                addUserChatMessage(question);
                // Process the question
                processChatQuestion(question);
            }
        });
    });
}

// Handle chat form submission
function handleChatSubmission(e) {
    e.preventDefault();
    
    const chatInput = document.getElementById('chat-input');
    if (!chatInput) return;
    
    const question = chatInput.value.trim();
    if (!question) return;
    
    // Add user message
    addUserChatMessage(question);
    
    // Clear input
    chatInput.value = '';
    
    // Process the question
    processChatQuestion(question);
}

// Add user message to chat
function addUserChatMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'flex mb-4 justify-end chat-message';
    messageElement.innerHTML = `
        <div class="bg-orange-600 p-3 rounded-lg shadow-sm text-white max-w-[80%]">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add bot message to chat
function addBotChatMessage(message, isLoading = false) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    // Remove loading indicator if exists
    const loadingIndicator = chatMessages.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
    
    if (isLoading) {
        // Add loading indicator
        const loadingElement = document.createElement('div');
        loadingElement.className = 'flex mb-4 chat-message loading-indicator';
        loadingElement.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 flex-shrink-0">
                <i class="fas fa-om text-orange-600"></i>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm">
                <div class="flex space-x-2">
                    <div class="w-2 h-2 bg-orange-600 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(loadingElement);
    } else {
        // Add bot message
        const messageElement = document.createElement('div');
        messageElement.className = 'flex mb-4 chat-message';
        messageElement.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 flex-shrink-0">
                <i class="fas fa-om text-orange-600"></i>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                <p class="text-gray-700">${message}</p>
            </div>
        `;
        chatMessages.appendChild(messageElement);
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process chat question
function processChatQuestion(question) {
    // Show loading indicator
    addBotChatMessage('', true);
    
    // In a real implementation, this would call an API
    // For demo, we'll use a timeout to simulate processing
    setTimeout(() => {
        // Generate response based on question
        const response = generateChatResponse(question);
        
        // Add bot response
        addBotChatMessage(response);
        
        // Add follow-up suggestions sometimes
        if (Math.random() > 0.5) {
            addFollowUpSuggestions();
        }
    }, 1000);
}

// Generate chat response
function generateChatResponse(question) {
    // Simple pattern matching for demo
    question = question.toLowerCase();
    
    if (question.includes('stress') || question.includes('anxiety') || question.includes('worried')) {
        return "The Bhagavad Gita offers wisdom for managing stress in Chapter 2, Verse 14: \"The nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons. They arise from sense perception, and one must learn to tolerate them without being disturbed.\" This teaches us that challenges are temporary, and developing equanimity is key to peace.";
    }
    
    if (question.includes('karma yoga')) {
        return "Karma Yoga is the path of selfless action explained primarily in Chapter 3 of the Bhagavad Gita. The key principle is expressed in Chapter 2, Verse 47: \"You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.\" This teaches us to act without attachment to results, focusing on the action itself rather than the reward.";
    }
    
    if (question.includes('peace') || question.includes('calm')) {
        return "For finding peace, the Bhagavad Gita offers guidance in Chapter 2, Verse 71: \"A person who has given up all desires for sense gratification, who lives free from desires, who has given up all sense of proprietorship, and is devoid of false ego—he alone can attain real peace.\" The Gita teaches that true peace comes from mastering desires and finding contentment within.";
    }
    
    if (question.includes('purpose') || question.includes('meaning')) {
        return "The Bhagavad Gita speaks about life's purpose in Chapter 3, Verse 9, which explains that actions should be performed as a sacrifice (yajna) rather than for selfish motives. The ultimate purpose is described in Chapter 18, Verse 65: \"Always think of Me, become My devotee, worship Me, and offer your homage unto Me. Thus you will come to Me without fail.\" The Gita suggests our purpose is spiritual growth and divine connection.";
    }
    
    // Default response
    return "That's an interesting question about the Bhagavad Gita. While I don't have the exact verse that addresses this specifically, the Gita's teachings on self-knowledge (jnana), action (karma), and devotion (bhakti) offer guidance for many life situations. Would you like me to suggest some verses that might be relevant to your question?";
}

// Add follow-up suggestions
function addFollowUpSuggestions() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const suggestions = [
        "How can I apply this in daily life?",
        "Which chapter covers this in more detail?",
        "What does Krishna say about overcoming obstacles?",
        "How does this relate to modern psychology?"
    ];
    
    const suggestionsElement = document.createElement('div');
    suggestionsElement.className = 'flex justify-center mb-4';
    suggestionsElement.innerHTML = `
        <div class="bg-white p-2 rounded-lg shadow-sm text-center">
            <p class="text-gray-500 text-xs mb-2">You might also want to ask:</p>
            <div class="space-y-2">
                ${suggestions.map(suggestion => `
                    <button class="suggestion-btn block w-full text-left text-sm bg-orange-50 hover:bg-orange-100 p-2 rounded text-gray-700 transition-colors">
                        ${suggestion}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    chatMessages.appendChild(suggestionsElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add event listeners to new buttons
    const newButtons = suggestionsElement.querySelectorAll('.suggestion-btn');
    newButtons.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.textContent.trim();
            // Add user message
            addUserChatMessage(question);
            // Process the question
            processChatQuestion(question);
        });
    });
}

// Handle newsletter submission
function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('newsletter-email');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Show success message
    alert(`Thank you for subscribing to our newsletter with ${email}! We'll keep you updated with daily verses and spiritual wisdom.`);
    
    // Clear form
    emailInput.value = '';
    
    // In a real implementation, this would submit to an API endpoint
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Share website functionality
function shareWebsite() {
    const text = "Find peace and guidance through the wisdom of Bhagavad Gita at GyanGita.com";
    const url = window.location.origin;
    
    if (navigator.share) {
        navigator.share({
            title: 'GyanGita - Divine Wisdom from Bhagavad Gita',
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

function shareOnWhatsApp(text, url) {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
    window.open(whatsappUrl, '_blank');
}

// Make functions available globally
window.shareWebsite = shareWebsite;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;