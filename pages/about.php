<?php
require_once '../includes/config.php';

// SEO settings
$page_title = "About GyanGita - Our Mission and Vision";
$page_description = "Learn about GyanGita's mission to make the eternal wisdom of Bhagavad Gita accessible to seekers worldwide through personalized guidance.";

include '../includes/header.php';
include '../includes/nav.php';
?>

<!-- Main Content -->
<main class="container mx-auto px-4 py-12" id="main-content">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-center text-orange-800 mb-8">About GyanGita</h1>
        
        <!-- Mission Section -->
        <div class="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p class="text-gray-700 mb-4">
                GyanGita is dedicated to making the timeless wisdom of Bhagavad Gita accessible and relevant to modern seekers. We believe that the teachings of the Gita contain solutions to life's most pressing challenges and questions, regardless of one's cultural or religious background.
            </p>
            <p class="text-gray-700 mb-4">
                Our mission is to help individuals find personalized guidance from this ancient text by connecting their current emotional states and life situations with the specific verses that offer wisdom, comfort, and direction.
            </p>
            <p class="text-gray-700">
                Through technology and thoughtful curation, we aim to build a bridge between ancient wisdom and contemporary needs, making spiritual knowledge practical and accessible for daily life.
            </p>
        </div>
        
        <!-- Vision Section -->
        <div class="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p class="text-gray-700 mb-4">
                We envision a world where the profound teachings of Bhagavad Gita are seamlessly integrated into people's daily lives, offering guidance, clarity, and peace amidst modern chaos.
            </p>
            <p class="text-gray-700 mb-4">
                GyanGita strives to become the trusted companion for spiritual seekers worldwide, transforming how people interact with sacred texts through:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Personalized guidance based on emotional states and life situations</li>
                <li>Accessible learning through multiple translations and commentaries</li>
                <li>Interactive practice tools for deeper understanding and internalization</li>
                <li>Community support to share insights and spiritual journeys</li>
                <li>Modern technology that respects and preserves traditional wisdom</li>
            </ul>
        </div>
        
        <!-- Our Story Section -->
        <div class="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p class="text-gray-700 mb-4">
                GyanGita was born from a personal journey. Our founder, Rajat Udasi, was going through a challenging time in life and turned to the Bhagavad Gita for guidance. While the wisdom was profound, finding specific verses relevant to his situation required hours of searching through different translations and commentaries.
            </p>
            <p class="text-gray-700 mb-4">
                This experience sparked the idea: What if there was a way to instantly find relevant Gita verses based on one's current emotional state or life challenge?
            </p>
            <p class="text-gray-700 mb-4">
                Working with scholars, technologists, and fellow seekers, GyanGita was developed to bridge the gap between this timeless wisdom and modern accessibility needs. Our team has meticulously curated verses relevant to different emotional states and life situations, making divine guidance just a click away.
            </p>
            <p class="text-gray-700">
                Today, GyanGita continues to evolve, adding new features for study, practice, and community building—all aimed at making the Gita's wisdom an integral part of daily life for seekers worldwide.
            </p>
        </div>
        
        <!-- Team Section -->
        <div class="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Team</h2>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Founder -->
                <div class="text-center">
                    <div class="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                        <img src="/assets/images/team/rajat-udasi.jpg" alt="Rajat Udasi" class="w-full h-full object-cover">
                    </div>
                    <h3 class="text-xl font-medium text-gray-800 mb-1">Rajat Udasi</h3>
                    <p class="text-orange-600 mb-2">Founder & CEO</p>
                    <p class="text-gray-600 text-sm">
                        Spiritual seeker with a passion for technology and ancient wisdom. Background in software development and digital marketing.
                    </p>
                </div>
                
                <!-- Sanskrit Scholar -->
                <div class="text-center">
                    <div class="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                        <img src="/assets/images/team/dr-sharma.jpg" alt="Dr. Priya Sharma" class="w-full h-full object-cover">
                    </div>
                    <h3 class="text-xl font-medium text-gray-800 mb-1">Dr. Priya Sharma</h3>
                    <p class="text-orange-600 mb-2">Sanskrit Scholar</p>
                    <p class="text-gray-600 text-sm">
                        PhD in Sanskrit literature with 15 years of experience teaching Bhagavad Gita and Vedic philosophy.
                    </p>
                </div>
                
                <!-- Technical Lead -->
                <div class="text-center">
                    <div class="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                        <img src="/assets/images/team/arjun-mehta.jpg" alt="Arjun Mehta" class="w-full h-full object-cover">
                    </div>
                    <h3 class="text-xl font-medium text-gray-800 mb-1">Arjun Mehta</h3>
                    <p class="text-orange-600 mb-2">Technical Lead</p>
                    <p class="text-gray-600 text-sm">
                        Full-stack developer with expertise in web applications and mobile development. Yoga practitioner.
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Values Section -->
        <div class="bg-orange-50 rounded-xl shadow-md p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Values</h2>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg">
                    <div class="flex items-center mb-3">
                        <div class="bg-orange-100 p-3 rounded-full mr-4">
                            <i class="fas fa-heart text-orange-600"></i>
                        </div>
                        <h3 class="text-xl font-medium text-gray-800">Respect for Tradition</h3>
                    </div>
                    <p class="text-gray-600">
                        We honor the sacred tradition of Bhagavad Gita by working with scholars to ensure authenticity while making it accessible.
                    </p>
                </div>
                
                <div class="bg-white p-6 rounded-lg">
                    <div class="flex items-center mb-3">
                        <div class="bg-orange-100 p-3 rounded-full mr-4">
                            <i class="fas fa-globe text-orange-600"></i>
                        </div>
                        <h3 class="text-xl font-medium text-gray-800">Universal Accessibility</h3>
                    </div>
                    <p class="text-gray-600">
                        We believe divine wisdom should be available to all seekers regardless of background, making our platform inclusive and user-friendly.
                    </p>
                </div>
                
                <div class="bg-white p-6 rounded-lg">
                    <div class="flex items-center mb-3">
                        <div class="bg-orange-100 p-3 rounded-full mr-4">
                            <i class="fas fa-seedling text-orange-600"></i>
                        </div>
                        <h3 class="text-xl font-medium text-gray-800">Spiritual Growth</h3>
                    </div>
                    <p class="text-gray-600">
                        We focus on creating tools that encourage not just reading but practicing and embodying the wisdom of the Gita.
                    </p>
                </div>
                
                <div class="bg-white p-6 rounded-lg">
                    <div class="flex items-center mb-3">
                        <div class="bg-orange-100 p-3 rounded-full mr-4">
                            <i class="fas fa-users text-orange-600"></i>
                        </div>
                        <h3 class="text-xl font-medium text-gray-800">Community</h3>
                    </div>
                    <p class="text-gray-600">
                        We believe in the power of sangha (spiritual community) and strive to foster connections among like-minded seekers.
                    </p>
                </div>
            </div>
        </div>
    </div>
</main>

<?php include '../includes/footer.php'; ?>