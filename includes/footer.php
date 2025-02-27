<!-- Scroll to Top Button -->
<button id="scroll-to-top" class="fixed bottom-8 right-8 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 opacity-0 invisible z-30">
        <i class="fas fa-arrow-up"></i>
    </button>

    <!-- App Installation Banner (hidden by default) -->
    <div id="app-install-banner" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg transform translate-y-full transition-transform duration-300 z-30">
        <div class="container mx-auto flex items-center justify-between">
            <div class="flex items-center">
                <img src="/assets/images/app-icons/icon-192x192.png" alt="GyanGita App Icon" class="w-12 h-12 mr-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-800">GyanGita App</h3>
                    <p class="text-gray-600 text-sm">Install for daily guidance & offline access</p>
                </div>
            </div>
            <div class="flex items-center">
                <button id="dismiss-install" class="mr-4 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
                <button id="install-app-btn" class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Install App
                </button>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-auto pt-16 pb-6">
        <div class="container mx-auto px-4">
            <!-- Main Footer Content -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <!-- About Section -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-om text-3xl text-orange-500"></i>
                        <h3 class="text-2xl font-bold text-white">GyanGita</h3>
                    </div>
                    <p class="text-gray-400">
                        Discover the timeless wisdom of Bhagavad Gita through personalized guidance for modern life challenges.
                    </p>
                    <div class="flex space-x-4">
                        <a href="https://facebook.com/gyangita" class="text-gray-400 hover:text-orange-500 transition-colors" target="_blank" rel="noopener">
                            <i class="fab fa-facebook-f text-xl"></i>
                        </a>
                        <a href="https://twitter.com/gyangita" class="text-gray-400 hover:text-orange-500 transition-colors" target="_blank" rel="noopener">
                            <i class="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="https://instagram.com/gyangita" class="text-gray-400 hover:text-orange-500 transition-colors" target="_blank" rel="noopener">
                            <i class="fab fa-instagram text-xl"></i>
                        </a>
                        <a href="https://wa.me/919370922063" class="text-gray-400 hover:text-orange-500 transition-colors" target="_blank" rel="noopener">
                            <i class="fab fa-whatsapp text-xl"></i>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                    <ul class="space-y-2">
                        <li>
                            <a href="/index.php" class="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                                <i class="fas fa-chevron-right text-xs mr-2"></i>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/pages/browse.php" class="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                                <i class="fas fa-chevron-right text-xs mr-2"></i>
                                Browse Gita
                            </a>
                        </li>
                        <li>
                            <a href="/pages/practice.php" class="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                                <i class="fas fa-chevron-right text-xs mr-2"></i>
                                Practice
                            </a>
                        </li>
                        <li>
                            <a href="/pages/dashboard.php" class="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                                <i class="fas fa-chevron-right text-xs mr-2"></i>
                                My Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="/pages/about.php" class="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                                <i class="fas fa-chevron-right text-xs mr-2"></i>
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="/pages/contact.php" class="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                                <i class="fas fa-chevron-right text-xs mr-2"></i>
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Resources -->
                <div>
                    <h4 class="text-lg font-semibold mb-4 text-white">Resources</h4>
                    <ul class="space-y-2">
                        <li>
                            <a href="/pages/daily-verse.php" class="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                                <i class="fas fa-chevron-right text-xs mr-2"></i>
                                Daily Verse
                            </a>
                        </li>
                        <li>
                            <a href="/pages/meditation-guide.php" class="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                                <i class="fas fa-chevron-right text-xs mr-2"></i>
                                Meditation Guide
                            </a>
                        </li>
                        <li>
                            <a href="/pages/audio.php" class="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                                <i class="fas fa-chevron-right text-xs mr-2"></i>
                                Gita Audio
                            </a>
                        </li>
                        <li>
                            <a href="/pages/faq.php" class="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                                <i class="fas fa-chevron-right text-xs mr-2"></i>
                                FAQs
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter & Contact -->
                <div>
                    <h4 class="text-lg font-semibold mb-4 text-white">Stay Connected</h4>
                    <form id="newsletter-form" class="space-y-4">
                        <div>
                            <label for="newsletter-email" class="sr-only">Email Address</label>
                            <input type="email" 
                                   id="newsletter-email" 
                                   placeholder="Enter your email"
                                   class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500">
                        </div>
                        <button type="submit" 
                                class="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors">
                            Subscribe
                        </button>
                    </form>
                    <div class="mt-6 space-y-2">
                        <p class="flex items-center text-gray-400">
                            <i class="fas fa-envelope mr-2 text-orange-500"></i>
                            support@gyangita.com
                        </p>
                        <p class="flex items-center text-gray-400">
                            <i class="fas fa-phone mr-2 text-orange-500"></i>
                            +91 9370922063
                        </p>
                    </div>
                </div>
            </div>

            <!-- Bottom Footer -->
            <div class="border-t border-gray-800 pt-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div class="text-center md:text-left text-gray-400">
                        <p>&copy; <?php echo date('Y'); ?> GyanGita. All rights reserved.</p>
                    </div>
                    <div class="text-center md:text-right text-gray-400">
                        <a href="/pages/privacy.php" class="hover:text-orange-500 transition-colors mr-4">Privacy Policy</a>
                        <a href="/pages/terms.php" class="hover:text-orange-500 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <!-- AI Chat Widget -->
    <div id="ai-guidance-widget" class="fixed bottom-6 right-6 z-50">
        <!-- Chat Button -->
        <button id="chat-toggle-btn" class="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-orange-700 transition-colors focus:outline-none">
            <i class="fas fa-comment-alt text-2xl"></i>
        </button>
        
        <!-- Chat Panel (Hidden by default) -->
        <div id="chat-panel" class="hidden absolute bottom-20 right-0 w-96 bg-white rounded-xl shadow-xl overflow-hidden">
            <!-- Chat content will be loaded here -->
        </div>
    </div>

    <!-- JavaScript -->
    <script src="/assets/js/main.js"></script>
    
    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(function(registration) {
                        console.log('ServiceWorker registration successful');
                    })
                    .catch(function(error) {
                        console.log('ServiceWorker registration failed: ', error);
                    });
            });
        }
    </script>

    <?php if (isset($page_scripts) && !empty($page_scripts)): ?>
        <?php foreach ($page_scripts as $script): ?>
            <script src="<?php echo $script; ?>"></script>
        <?php endforeach; ?>
    <?php endif; ?>
</body>
</html>