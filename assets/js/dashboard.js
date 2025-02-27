/**
 * GyanGita Dashboard
 * Handles user dashboard functionality
 */

// Constants
const FAVORITES_KEY = 'gyangita_favorites';
const HISTORY_KEY = 'gyangita_history';
const PRACTICE_KEY = 'gyangita_practice';

// Initialize tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active state from all tabs
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'text-orange-600', 'border-orange-600');
                btn.classList.add('text-gray-500', 'border-transparent');
            });
            
            // Add active state to current tab
            this.classList.add('active', 'text-orange-600', 'border-orange-600');
            this.classList.remove('text-gray-500', 'border-transparent');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show current tab content
            document.getElementById(`${tabName}-tab`).classList.remove('hidden');
        });
    });
    
    // Sort functionality
    const sortBtn = document.getElementById('sort-favorites-btn');
    if (sortBtn) {
        sortBtn.addEventListener('click', showSortModal);
    }
    
    // Sort options
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sortBy = this.dataset.sort;
            sortFavorites(sortBy);
            closeSortModal();
        });
    });
    
    // Clear history button
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', confirmClearHistory);
    }
    
    // Share favorites button
    const shareFavoritesBtn = document.getElementById('share-favorites-btn');
    if (shareFavoritesBtn) {
        shareFavoritesBtn.addEventListener('click', shareFavorites);
    }
    
    // Calendar navigation
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => navigateCalendar(-1));
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => navigateCalendar(1));
    }
}

// Load overview data
function loadOverviewData() {
    const favorites = getFavorites();
    const history = getHistory();
    const practice = getPracticeData();
    
    // Update stats
    updateElementText('favorites-count', favorites.length);
    updateElementText('verses-read', history.length);
    updateElementText('practice-days', practice.sessionCount || 0);
    updateElementText('streak-days', practice.streak || 0);
    
    // Load recent activity
    loadRecentActivity();
    
    // Load daily recommendation
    loadDailyRecommendation();
    
    // Load monthly progress
    loadMonthlyProgress();
}

// Update element text content
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

// Load recent activity
function loadRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    if (!activityContainer) return;
    
    // Get history and practice data
    const history = getHistory().sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    const practice = getPracticeData().sessions || [];
    const recentPractice = practice.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    
    // Combine activities
    const allActivities = [
        ...history.map(item => ({
            type: 'read',
            chapter: item.chapter,
            verse: item.verse,
            timestamp: item.timestamp
        })),
        ...recentPractice.map(item => ({
            type: 'practice',
            practiceType: item.type,
            chapter: item.chapter,
            verse: item.verse,
            timestamp: item.timestamp
        }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    
    // Clear container
    activityContainer.innerHTML = '';
    
    // Check if there are any activities
    if (allActivities.length === 0) {
        activityContainer.innerHTML = `
            <div class="text-center text-gray-600 py-4">
                No activity yet. Start exploring and practicing to see your activity here.
            </div>
        `;
        return;
    }
    
    // Generate HTML for activities
    allActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'flex items-start border-b border-gray-100 pb-3';
        
        let iconClass = '';
        let activityText = '';
        
        if (activity.type === 'read') {
            iconClass = 'fas fa-book text-orange-500';
            activityText = `Read Chapter ${activity.chapter}, Verse ${activity.verse}`;
        } else {
            if (activity.practiceType === 'recitation') {
                iconClass = 'fas fa-microphone-alt text-orange-500';
                activityText = `Practiced recitation of Chapter ${activity.chapter}, Verse ${activity.verse}`;
            } else if (activity.practiceType === 'reflection') {
                iconClass = 'fas fa-brain text-green-500';
                activityText = `Reflected on Chapter ${activity.chapter}, Verse ${activity.verse}`;
            } else {
                iconClass = 'fas fa-om text-blue-500';
                activityText = `Meditated on Chapter ${activity.chapter}, Verse ${activity.verse}`;
            }
        }
        
        activityItem.innerHTML = `
            <div class="mr-3 p-2 bg-gray-100 rounded-full">
                <i class="${iconClass}"></i>
            </div>
            <div class="flex-1">
                <p class="text-gray-800">${activityText}</p>
                <p class="text-gray-500 text-sm">${formatDate(activity.timestamp)}</p>
            </div>
        `;
        
        activityContainer.appendChild(activityItem);
    });
}

// Load daily recommendation
function loadDailyRecommendation() {
    const recommendationContainer = document.getElementById('daily-recommendation');
    if (!recommendationContainer) return;
    
    // In a real app, this would be personalized based on user history
    // For demo, we'll use a static recommendation
    const recommendation = {
        chapter: 2,
        verse: 47,
        text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
        translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction."
    };
    
    recommendationContainer.innerHTML = `
        <h3 class="text-xl font-medium text-orange-800 mb-2">
            Chapter ${recommendation.chapter}, Verse ${recommendation.verse}
        </h3>
        <div class="bg-orange-50 rounded-lg p-4 mb-4">
            <p class="text-gray-800 font-sanskrit">${recommendation.text}</p>
        </div>
        <p class="text-gray-700 mb-4">${recommendation.translation}</p>
        <div class="flex space-x-3">
            <a href="/pages/browse.php?chapter=${recommendation.chapter}&verse=${recommendation.verse}" 
               class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Read Full Verse
            </a>
            <a href="/pages/practice.php?chapter=${recommendation.chapter}&verse=${recommendation.verse}" 
               class="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors flex items-center">
                <i class="fas fa-om mr-2"></i>
                <span>Practice</span>
            </a>
        </div>
    `;
}

// Load monthly progress
function loadMonthlyProgress() {
    const progressContainer = document.getElementById('monthly-progress');
    if (!progressContainer) return;
    
    // Get practice data
    const practice = getPracticeData();
    
    // For a real implementation, this would use a chart library
    progressContainer.innerHTML = `
        <div class="text-center py-8">
            <p class="text-gray-600 mb-4">Monthly Progress Chart</p>
            <div class="bg-orange-50 p-4 rounded-lg">
                <p class="text-gray-700">
                    You've practiced for a total of ${practice.totalMinutes || 0} minutes this month,
                    across ${practice.sessionCount || 0} sessions.
                </p>
                <p class="text-gray-700 mt-2">
                    Your current streak is ${practice.streak || 0} days.
                </p>
            </div>
        </div>
    `;
}

// Load favorites data
function loadFavoritesData() {
    const favoritesContainer = document.getElementById('favorites-list');
    const emptyState = document.getElementById('favorites-empty');
    
    if (!favoritesContainer || !emptyState) return;
    
    // Get favorites
    const favorites = getFavorites();
    
    // Clear container
    favoritesContainer.innerHTML = '';
    
    // Check if there are any favorites
    if (favorites.length === 0) {
        favoritesContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    // Show favorites
    favoritesContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    // Generate HTML for favorites
    favorites.forEach(favorite => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors';
        
        favoriteItem.innerHTML = `
            <div class="flex justify-between items-start">
                <h3 class="text-lg font-medium text-orange-800">
                    <a href="/pages/browse.php?chapter=${favorite.chapter}&verse=${favorite.verse}" class="hover:underline">
                        Chapter ${favorite.chapter}, Verse ${favorite.verse}
                    </a>
                </h3>
                <div class="flex space-x-2">
                    <a href="/pages/browse.php?chapter=${favorite.chapter}&verse=${favorite.verse}" 
                       class="p-2 bg-white text-orange-700 rounded-full hover:bg-orange-200 transition-colors">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button onclick="removeFavorite(${favorite.chapter}, ${favorite.verse})" 
                            class="p-2 bg-white text-red-700 rounded-full hover:bg-red-100 transition-colors">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <p class="text-gray-600 mt-2">Added ${formatDate(favorite.timestamp)}</p>
        `;
        
        favoritesContainer.appendChild(favoriteItem);
    });
}

// Load reading history
function loadHistoryData() {
    const historyContainer = document.getElementById('history-list');
    const emptyState = document.getElementById('history-empty');
    
    if (!historyContainer || !emptyState) return;
    
    // Get history
    const history = getHistory();
    
    // Clear container
    historyContainer.innerHTML = '';
    
    // Check if there is any history
    if (history.length === 0) {
        historyContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    // Show history
    historyContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    // Sort history by timestamp (newest first)
    history.sort((a, b) => b.timestamp - a.timestamp);
    
    // Group history by date
    const groupedHistory = {};
    
    history.forEach(item => {
        const date = new Date(item.timestamp).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
        
        if (!groupedHistory[date]) {
            groupedHistory[date] = [];
        }
        
        groupedHistory[date].push(item);
    });
    
    // Generate HTML for history
    Object.keys(groupedHistory).forEach(date => {
        const dateGroup = document.createElement('div');
        dateGroup.className = 'mb-6';
        
        dateGroup.innerHTML = `
            <h3 class="text-lg font-medium text-gray-800 mb-3">${date}</h3>
            <div class="space-y-3 history-date-group"></div>
        `;
        
        const itemsContainer = dateGroup.querySelector('.history-date-group');
        
        groupedHistory[date].forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'flex justify-between items-center bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors';
            
            historyItem.innerHTML = `
                <div>
                    <p class="text-gray-800">
                        <a href="/pages/browse.php?chapter=${item.chapter}&verse=${item.verse}" class="hover:underline">
                            Chapter ${item.chapter}, Verse ${item.verse}
                        </a>
                    </p>
                    <p class="text-gray-500 text-sm">${new Date(item.timestamp).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                    })}</p>
                </div>
                <a href="/pages/browse.php?chapter=${item.chapter}&verse=${item.verse}" 
                   class="p-2 bg-white text-orange-700 rounded-full hover:bg-orange-100 transition-colors">
                    <i class="fas fa-eye"></i>
                </a>
            `;
            
            itemsContainer.appendChild(historyItem);
        });
        
        historyContainer.appendChild(dateGroup);
    });
}

// Load practice data
function loadPracticeData() {
    // Get practice data
    const practice = getPracticeData();
    
    // Update stats
    updateElementText('total-practice-minutes', practice.totalMinutes || 0);
    updateElementText('current-streak-days', practice.streak || 0);
    updateElementText('verses-practiced-count', practice.verseCount || 0);
    updateElementText('practice-sessions-count', practice.sessionCount || 0);
    
    // Load practice by type
    loadPracticeByType(practice.byType || {});
    
    // Initialize practice calendar
    initializePracticeCalendar();
    
    // Load practice sessions
    loadPracticeSessions(practice.sessions || []);
}

// Load practice by type
function loadPracticeByType(byType) {
    const container = document.getElementById('practice-by-type');
    if (!container) return;
    
    // Calculate percentages
    const total = (byType.recitation || 0) + (byType.reflection || 0) + (byType.meditation || 0);
    
    // Check if there is any practice data
    if (total === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-600 py-4">
                No practice data yet. Start practicing to see your stats.
            </div>
        `;
        return;
    }
    
    // Calculate percentages
    const recitationPercent = Math.round(((byType.recitation || 0) / total) * 100);
    const reflectionPercent = Math.round(((byType.reflection || 0) / total) * 100);
    const meditationPercent = Math.round(((byType.meditation || 0) / total) * 100);
    
    container.innerHTML = `
        <div class="flex items-center mb-3">
            <div class="w-1/4 text-gray-600">Recitation</div>
            <div class="w-3/4 bg-gray-200 rounded-full h-4">
                <div class="bg-orange-500 h-4 rounded-full" style="width: ${recitationPercent}%"></div>
            </div>
            <div class="w-12 text-right text-gray-600 ml-2">${recitationPercent}%</div>
        </div>
        <div class="flex items-center mb-3">
            <div class="w-1/4 text-gray-600">Reflection</div>
            <div class="w-3/4 bg-gray-200 rounded-full h-4">
                <div class="bg-green-500 h-4 rounded-full" style="width: ${reflectionPercent}%"></div>
            </div>
            <div class="w-12 text-right text-gray-600 ml-2">${reflectionPercent}%</div>
        </div>
        <div class="flex items-center">
            <div class="w-1/4 text-gray-600">Meditation</div>
            <div class="w-3/4 bg-gray-200 rounded-full h-4">
                <div class="bg-blue-500 h-4 rounded-full" style="width: ${meditationPercent}%"></div>
            </div>
            <div class="w-12 text-right text-gray-600 ml-2">${meditationPercent}%</div>
        </div>
    `;
}

// Initialize practice calendar
function initializePracticeCalendar() {
    const calendar = document.getElementById('practice-calendar');
    const monthDisplay = document.getElementById('calendar-month');
    
    if (!calendar || !monthDisplay) return;
    
    // Get current date
    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();
    
    // Store current view date
    calendar.dataset.viewMonth = currentMonth;
    calendar.dataset.viewYear = currentYear;
    
    // Generate calendar
    generateCalendar(currentMonth, currentYear);
}

// Generate calendar for given month and year
function generateCalendar(month, year) {
    const calendar = document.getElementById('practice-calendar');
    const monthDisplay = document.getElementById('calendar-month');
    
    if (!calendar || !monthDisplay) return;
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    monthDisplay.textContent = `${monthNames[month]} ${year}`;
    
    // Clear existing calendar except headers
    while (calendar.children.length > 7) {
        calendar.removeChild(calendar.lastChild);
    }
    
    // Get first day of month (0 = Sunday, 1 = Monday, ...)
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust for Monday as first day of week
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Add empty cells for days before first of month
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }
    
    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get practice data
    const practiceData = getPracticeData();
    const practiceDays = getPracticeDaysInMonth(practiceData, year, month);
    
    // Add cells for each day of month
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'h-8 w-8 mx-auto rounded-md flex items-center justify-center text-xs';
        
        // Check if practiced on this day
        const dateKey = `${year}-${month+1}-${day}`;
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
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('ring-2', 'ring-orange-600');
        }
        
        cell.textContent = day;
        calendar.appendChild(cell);
    }
}

// Get practice days in month
function getPracticeDaysInMonth(practiceData, year, month) {
    const practiceDays = {};
    
    if (!practiceData.sessions) return practiceDays;
    
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

// Navigate calendar
function navigateCalendar(direction) {
    const calendar = document.getElementById('practice-calendar');
    
    if (!calendar) return;
    
    let viewMonth = parseInt(calendar.dataset.viewMonth);
    let viewYear = parseInt(calendar.dataset.viewYear);
    
    // Update month and year
    viewMonth += direction;
    
    // Handle year change
    if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
    } else if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
    }
    
    // Update dataset
    calendar.dataset.viewMonth = viewMonth;
    calendar.dataset.viewYear = viewYear;
    
    // Regenerate calendar
    generateCalendar(viewMonth, viewYear);
}

// Load practice sessions
function loadPracticeSessions(sessions) {
    const sessionsContainer = document.getElementById('practice-sessions-list');
    const emptyState = document.getElementById('practice-empty');
    
    if (!sessionsContainer || !emptyState) return;
    
    // Clear container
    sessionsContainer.innerHTML = '';
    
    // Check if there are any sessions
    if (!sessions || sessions.length === 0) {
        sessionsContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    // Show sessions
    sessionsContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    // Sort sessions by timestamp (newest first)
    sessions.sort((a, b) => b.timestamp - a.timestamp);
    
    // Generate HTML for sessions
    sessions.slice(0, 5).forEach(session => {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between';
        
        // Get appropriate icon and color based on practice type
        let iconClass = '';
        let bgColorClass = '';
        
        if (session.type === 'recitation') {
            iconClass = 'fas fa-microphone-alt text-orange-600';
            bgColorClass = 'bg-orange-100';
        } else if (session.type === 'reflection') {
            iconClass = 'fas fa-brain text-green-600';
            bgColorClass = 'bg-green-100';
        } else {
            iconClass = 'fas fa-om text-blue-600';
            bgColorClass = 'bg-blue-100';
        }
        
        sessionItem.innerHTML = `
            <div class="flex items-center mb-3 md:mb-0">
                <div class="p-3 rounded-full ${bgColorClass} mr-4">
                    <i class="${iconClass}"></i>
                </div>
                <div>
                    <h4 class="font-medium text-gray-800">${session.type.charAt(0).toUpperCase() + session.type.slice(1)} Practice</h4>
                    <p class="text-gray-600">Chapter ${session.chapter}, Verse ${session.verse}</p>
                </div>
            </div>
            <div class="flex items-center justify-between md:justify-end space-x-4">
                <div class="text-right">
                    <p class="text-sm text-gray-500">${formatDate(session.timestamp)}</p>
                    <p class="text-sm text-gray-700">${session.duration} minutes</p>
                </div>
                <a href="/pages/browse.php?chapter=${session.chapter}&verse=${session.verse}" 
                   class="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                    <i class="fas fa-eye"></i>
                </a>
            </div>
        `;
        
        sessionsContainer.appendChild(sessionItem);
    });
}

// Get favorites
function getFavorites() {
    try {
        const favoritesJson = localStorage.getItem(FAVORITES_KEY);
        return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (e) {
        console.error("Error loading favorites:", e);
        return [];
    }
}

// Get history
function getHistory() {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (e) {
        console.error("Error loading history:", e);
        return [];
    }
}

// Get practice data
function getPracticeData() {
    try {
        const practiceJson = localStorage.getItem(PRACTICE_KEY);
        return practiceJson ? JSON.parse(practiceJson) : {
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
    } catch (e) {
        console.error("Error loading practice data:", e);
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
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    });
}

// Sort favorites
function sortFavorites(sortBy) {
    const favorites = getFavorites();
    
    if (sortBy === 'recent') {
        favorites.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'chapter-asc') {
        favorites.sort((a, b) => {
            if (a.chapter === b.chapter) {
                return a.verse - b.verse;
            }
            return a.chapter - b.chapter;
        });
    } else if (sortBy === 'chapter-desc') {
        favorites.sort((a, b) => {
            if (a.chapter === b.chapter) {
                return b.verse - a.verse;
            }
            return b.chapter - a.chapter;
        });
    }
    
    // Reload favorites with new sort order
    loadFavoritesData();
}

// Remove favorite
function removeFavorite(chapter, verse) {
    if (confirm('Are you sure you want to remove this verse from your favorites?')) {
        const favorites = getFavorites();
        const index = favorites.findIndex(fav => fav.chapter == chapter && fav.verse == verse);
        
        if (index !== -1) {
            favorites.splice(index, 1);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            
            // Reload favorites
            loadFavoritesData();
            
            // Update favorites count in overview
            updateElementText('favorites-count', favorites.length);
        }
    }
}

// Show sort modal
function showSortModal() {
    const modal = document.getElementById('sortModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

// Close sort modal
function closeSortModal() {
    const modal = document.getElementById('sortModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Confirm clear history
function confirmClearHistory() {
    if (confirm('Are you sure you want to clear your reading history?')) {
        localStorage.removeItem(HISTORY_KEY);
        
        // Reload history
        loadHistoryData();
        
        // Update history count in overview
        updateElementText('verses-read', 0);
        
        // Update recent activity
        loadRecentActivity();
    }
}

// Share favorites
function shareFavorites() {
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        alert('You have no favorite verses to share.');
        return;
    }
    
    // Format favorites list for sharing
    let shareText = 'My favorite verses from Bhagavad Gita:\n\n';
    
    favorites.forEach(favorite => {
        shareText += `Chapter ${favorite.chapter}, Verse ${favorite.verse}\n`;
    });
    
    shareText += '\nDiscover more wisdom at GyanGita.com';
    
    // Share on WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
}

// Make functions available globally
window.removeFavorite = removeFavorite;
window.showSortModal = showSortModal;
window.closeSortModal = closeSortModal;
window.confirmClearHistory = confirmClearHistory;
window.shareFavorites = shareFavorites;