<?php
// Define navigation items
$nav_items = [
    'home' => [
        'label' => 'Home',
        'url' => '/index.php',
        'icon' => 'fa-home'
    ],
    'browse' => [
        'label' => 'Browse Gita',
        'url' => '/pages/browse.php',
        'icon' => 'fa-book-open'
    ],
    'practice' => [
        'label' => 'Practice',
        'url' => '/pages/practice.php',
        'icon' => 'fa-om'
    ],
    'dashboard' => [
        'label' => 'My Dashboard',
        'url' => '/pages/dashboard.php',
        'icon' => 'fa-user'
    ],
    'about' => [
        'label' => 'About',
        'url' => '/pages/about.php',
        'icon' => 'fa-info-circle'
    ],
    'contact' => [
        'label' => 'Contact',
        'url' => '/pages/contact.php',
        'icon' => 'fa-envelope'
    ]
];
?>

<!-- Navigation -->
<nav class="bg-white shadow-md sticky top-0 z-40">
    <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <a href="/index.php" class="flex items-center space-x-2" aria-label="GyanGita Home">
                <i class="fas fa-om text-3xl text-orange-600"></i>
                <span class="text-2xl font-bold text-orange-800">GyanGita</span>
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex space-x-8">
                <?php foreach ($nav_items as $id => $item): ?>
                <a href="<?php echo $item['url']; ?>" 
                   class="<?php echo $current_page === $id ? 'text-orange-600 font-medium' : 'text-gray-700 hover:text-orange-600'; ?> transition-colors"
                   aria-current="<?php echo $current_page === $id ? 'page' : 'false'; ?>">
                    <?php echo $item['label']; ?>
                </a>
                <?php endforeach; ?>
            </div>

            <!-- Search Button -->
            <div class="hidden md:flex">
                <a href="/pages/search.php" class="p-2 text-gray-600 hover:text-orange-600 transition-colors" aria-label="Search">
                    <i class="fas fa-search"></i>
                </a>
            </div>

            <!-- Mobile Menu Button -->
            <button type="button" id="mobile-menu-button" class="md:hidden text-gray-700" aria-expanded="false" aria-controls="mobile-menu">
                <i class="fas fa-bars text-xl"></i>
            </button>
        </div>
    </div>

    <!-- Mobile Navigation (hidden by default) -->
    <div id="mobile-menu" class="hidden md:hidden bg-white border-t">
        <div class="container mx-auto px-4 py-2 space-y-2">
            <?php foreach ($nav_items as $id => $item): ?>
            <a href="<?php echo $item['url']; ?>" 
               class="block py-2 <?php echo $current_page === $id ? 'text-orange-600 font-medium' : 'text-gray-700 hover:text-orange-600'; ?>">
                <i class="fas <?php echo $item['icon']; ?> mr-2"></i>
                <?php echo $item['label']; ?>
            </a>
            <?php endforeach; ?>
            
            <a href="/pages/search.php" class="block py-2 text-gray-700 hover:text-orange-600">
                <i class="fas fa-search mr-2"></i>
                Search
            </a>
        </div>
    </div>
</nav>