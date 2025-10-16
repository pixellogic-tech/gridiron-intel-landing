// Platform detection
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gridiron Intel Landing Page Loaded');
    
    // Detect user's platform
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) {
        console.log('Android device detected');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        console.log('iOS device detected');
    } else if (userAgent.includes('linux')) {
        console.log('Linux system detected');
    } else if (userAgent.includes('windows')) {
        console.log('Windows system detected');
    }
});
