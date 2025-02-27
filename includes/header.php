<?php
// Get current page info
$current_page = basename($_SERVER['PHP_SELF'], '.php');

// Default page information
if (!isset($page_title)) {
    $page_title = SITE_TITLE;
}

if (!isset($page_description)) {
    $page_description = SITE_DESCRIPTION;
}

// Handle canonicals
$canonical = canonical_url();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title><?php echo sanitize_output($page_title); ?></title>
    <meta name="description" content="<?php echo sanitize_output($page_description); ?>">
    <meta name="keywords" content="<?php echo sanitize_output($meta_keywords); ?>">
    <link rel="canonical" href="<?php echo sanitize_output($canonical); ?>">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo sanitize_output($canonical); ?>">
    <meta property="og:title" content="<?php echo sanitize_output($page_title); ?>">
    <meta property="og:description" content="<?php echo sanitize_output($page_description); ?>">
    <meta property="og:image" content="<?php echo SITE_URL; ?>/assets/images/general/og-image.jpg">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="<?php echo sanitize_output($canonical); ?>">
    <meta property="twitter:title" content="<?php echo sanitize_output($page_title); ?>">
    <meta property="twitter:description" content="<?php echo sanitize_output($page_description); ?>">
    <meta property="twitter:image" content="<?php echo SITE_URL; ?>/assets/images/general/og-image.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/images/general/favicon.png">
    <link rel="apple-touch-icon" href="/assets/images/app-icons/apple-touch-icon.png">
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#FF7F3F">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="GyanGita">
    <link rel="manifest" href="/manifest.json">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/assets/css/tailwind.css">
    <link rel="stylesheet" href="/assets/css/main.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "GyanGita",
        "url": "<?php echo SITE_URL; ?>",
        "description": "<?php echo sanitize_output(SITE_DESCRIPTION); ?>",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "<?php echo SITE_URL; ?>/pages/search.php?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>
    
    <!-- Schema for Organization -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GyanGita",
        "url": "<?php echo SITE_URL; ?>",
        "logo": "<?php echo SITE_URL; ?>/assets/images/general/logo.png",
        "sameAs": [
            "https://facebook.com/gyangita",
            "https://twitter.com/gyangita",
            "https://instagram.com/gyangita"
        ]
    }
    </script>
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');
    </script>
</head>
<body class="bg-orange-50 text-gray-800 min-h-screen flex flex-col">
    <!-- Skip to content link for accessibility -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-orange-600 focus:text-white focus:z-50">Skip to content</a>
    
    <!-- Offline notification banner (hidden by default) -->
    <div id="offline-banner" class="hidden w-full bg-yellow-100 text-yellow-800 px-4 py-2 text-center fixed top-0 left-0 z-50">
        <i class="fas fa-wifi mr-2"></i>
        <span>You are offline. Some features may be limited.</span>
    </div>