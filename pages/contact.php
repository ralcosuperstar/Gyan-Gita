<?php
require_once '../includes/config.php';

// SEO settings
$page_title = "Contact Us - GyanGita";
$page_description = "Have questions or feedback about GyanGita? Reach out to our team for support, collaborations, or spiritual guidance.";

// Process contact form
$form_submitted = false;
$form_error = false;
$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Simple form validation
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    // Validate fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        $form_error = true;
        $error_message = 'Please fill all required fields.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $form_error = true;
        $error_message = 'Please enter a valid email address.';
    } else {
        // In a real implementation, send email here
        // For this demo, we'll just simulate success
        
        // Record contact in database or log
        // logContactSubmission($name, $email, $subject, $message);
        
        $form_submitted = true;
    }
}

include '../includes/header.php';
include '../includes/nav.php';
?>

<!-- Main Content -->
<main class="container mx-auto px-4 py-12" id="main-content">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-center text-orange-800 mb-8">Contact Us</h1>
        
        <?php if ($form_submitted): ?>
        <!-- Success Message -->
        <div class="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 mb-8">
            <div class="flex items-center">
                <i class="fas fa-check-circle text-green-600 text-2xl mr-4"></i>
                <div>
                    <h2 class="text-xl font-semibold mb-2">Message Sent Successfully!</h2>
                    <p>Thank you for reaching out to us. We'll respond to your message as soon as possible.</p>
                </div>
            </div>
        </div>
        <?php endif; ?>
        
        <?php if ($form_error): ?>
        <!-- Error Message -->
        <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-8">
            <div class="flex items-center">
                <i class="fas fa-exclamation-circle text-red-600 text-2xl mr-4"></i>
                <div>
                    <h2 class="text-xl font-semibold mb-2">There was a problem</h2>
                    <p><?php echo sanitize_output($error_message); ?></p>
                </div>
            </div>
        </div>
        <?php endif; ?>
        
        <div class="grid md:grid-cols-3 gap-8">
            <!-- Contact Info -->
            <div class="md:col-span-1">
                <div class="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
                    
                    <div class="space-y-4">
                        <div class="flex items-start">
                            <div class="bg-orange-100 p-3 rounded-full mr-4">
                                <i class="fas fa-map-marker-alt text-orange-600"></i>
                            </div>
                            <div>
                                <h3 class="font-medium text-gray-800 mb-1">Address</h3>
                                <p class="text-gray-600">
                                    123 Spiritual Way<br>
                                    Mumbai, Maharashtra 400001<br>
                                    India
                                </p>
                            </div>
                        </div>
                        
                        <div class="flex items-start">
                            <div class="bg-orange-100 p-3 rounded-full mr-4">
                                <i class="fas fa-envelope text-orange-600"></i>
                            </div>
                            <div>
                                <h3 class="font-medium text-gray-800 mb-1">Email</h3>
                                <a href="mailto:support@gyangita.com" class="text-orange-600 hover:text-orange-700 transition-colors">
                                    support@gyangita.com
                                </a>
                            </div>
                        </div>
                        
                        <div class="flex items-start">
                            <div class="bg-orange-100 p-3 rounded-full mr-4">
                                <i class="fas fa-phone-alt text-orange-600"></i>
                            </div>
                            <div>
                                <h3 class="font-medium text-gray-800 mb-1">Phone</h3>
                                <a href="tel:+919370922063" class="text-orange-600 hover:text-orange-700 transition-colors">
                                    +91 9370922063
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Social Media -->
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Connect With Us</h2>
                    
                    <div class="flex justify-between">
                        <a href="https://facebook.com/gyangita" target="_blank" rel="noopener" class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        
                        <a href="https://twitter.com/gyangita" target="_blank" rel="noopener" class="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors">
                            <i class="fab fa-twitter"></i>
                        </a>
                        
                        <a href="https://instagram.com/gyangita" target="_blank" rel="noopener" class="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors">
                            <i class="fab fa-instagram"></i>
                        </a>
                        
                        <a href="https://wa.me/919370922063" target="_blank" rel="noopener" class="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                        
                        <a href="https://youtube.com/gyangita" target="_blank" rel="noopener" class="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Contact Form -->
            <div class="md:col-span-2">
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Send Your Message</h2>
                    
                    <form action="/pages/contact.php" method="POST" class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label for="name" class="block text-gray-700 mb-2">Your Name *</label>
                                <input type="text" id="name" name="name" 
                                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                       required>
                            </div>
                            
                            <div>
                                <label for="email" class="block text-gray-700 mb-2">Your Email *</label>
                                <input type="email" id="email" name="email" 
                                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                       required>
                            </div>
                        </div>
                        
                        <div>
                            <label for="subject" class="block text-gray-700 mb-2">Subject *</label>
                            <input type="text" id="subject" name="subject" 
                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                   required>
                        </div>
                        
                        <div>
                            <label for="message" class="block text-gray-700 mb-2">Your Message *</label>
                            <textarea id="message" name="message" rows="6"
                                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                      required></textarea>
                        </div>
                        
                        <div class="flex items-start mb-6">
                            <div class="flex items-center h-5">
                                <input id="privacy" type="checkbox" name="privacy_policy"
                                       class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300"
                                       required>
                            </div>
                            <label for="privacy" class="ml-2 text-sm text-gray-600">
                                I agree with the <a href="/pages/privacy.php" class="text-orange-600 hover:underline">privacy policy</a> for handling my data.
                            </label>
                        </div>
                        
                        <button type="submit" 
                                class="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors text-lg font-medium">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
        <!-- FAQ Section -->
        <div class="bg-white rounded-xl shadow-md p-8 mt-12">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            
            <div class="space-y-4">
                <div class="border border-gray-200 rounded-lg p-4">
                    <button class="flex justify-between items-center w-full text-left" onclick="toggleFAQ(this)">
                        <h3 class="text-lg font-medium text-gray-800">How do I save my favorite verses?</h3>
                        <i class="fas fa-chevron-down text-gray-500 transition-transform"></i>
                    </button>
                    <div class="faq-answer hidden mt-4 text-gray-600">
                        <p>You can save any verse to your favorites by clicking the bookmark icon on the verse card. All saved verses will appear in the "My Favorites" section of your dashboard, allowing you to access them easily anytime.</p>
                    </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4">
                    <button class="flex justify-between items-center w-full text-left" onclick="toggleFAQ(this)">
                        <h3 class="text-lg font-medium text-gray-800">Can I use GyanGita offline?</h3>
                        <i class="fas fa-chevron-down text-gray-500 transition-transform"></i>
                    </button>
                    <div class="faq-answer hidden mt-4 text-gray-600">
                        <p>Yes, GyanGita works offline after your first visit. You can install it as a Progressive Web App (PWA) on your device. Once installed, you'll be able to access previously viewed verses, your favorites, and the main functions even without an internet connection.</p>
                    </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4">
                    <button class="flex justify-between items-center w-full text-left" onclick="toggleFAQ(this)">
                        <h3 class="text-lg font-medium text-gray-800">How can I contribute to GyanGita?</h3>
                        <i class="fas fa-chevron-down text-gray-500 transition-transform"></i>
                    </button>
                    <div class="faq-answer hidden mt-4 text-gray-600">
                        <p>We welcome contributions in various forms! You can help by providing feedback, suggesting features, reporting issues, or even volunteering as a translator or content creator. For more details on how to contribute, please contact us using the form above.</p>
                    </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4">
                    <button class="flex justify-between items-center w-full text-left" onclick="toggleFAQ(this)">
                        <h3 class="text-lg font-medium text-gray-800">Is GyanGita available in other languages?</h3>
                        <i class="fas fa-chevron-down text-gray-500 transition-transform"></i>
                    </button>
                    <div class="faq-answer hidden mt-4 text-gray-600">
                        <p>Currently, GyanGita is available in English with Sanskrit verses. We're working on adding support for Hindi, Tamil, Telugu, and other Indian languages. If you'd like to help with translations or see a specific language added, please let us know!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<script>
function toggleFAQ(element) {
    // Toggle the answer visibility
    const answer = element.nextElementSibling;
    answer.classList.toggle('hidden');
    
    // Toggle the icon rotation
    const icon = element.querySelector('i');
    icon.classList.toggle('rotate-180');
}
</script>

<?php include '../includes/footer.php'; ?>