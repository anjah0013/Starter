// Hero Slider Functionality
export default function heroSlider() {
    const heroSection = document.querySelector('.gh-hero-section');
    if (!heroSection) return;

    const slides = heroSection.querySelectorAll('.gh-hero-slide');
    const dots = heroSection.querySelectorAll('.gh-hero-dot');
    const prevBtn = heroSection.querySelector('.gh-hero-prev');
    const nextBtn = heroSection.querySelector('.gh-hero-next');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;
    const autoPlayDelay = 5000; // 5 seconds between slides

    // Initialize first slide
    function init() {
        slides[0].classList.add('active');
        if (dots.length > 0) {
            dots[0].classList.add('active');
        }
        startAutoPlay();
    }

    // Show specific slide
    function showSlide(index) {
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        if (dots.length > 0) {
            dots[currentSlide].classList.remove('active');
        }

        // Update current slide index
        currentSlide = index;

        // Handle wrapping
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        // Add active class to new slide and dot
        slides[currentSlide].classList.add('active');
        if (dots.length > 0) {
            dots[currentSlide].classList.add('active');
        }
    }

    // Next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Start autoplay
    function startAutoPlay() {
        stopAutoPlay();
        slideInterval = setInterval(nextSlide, autoPlayDelay);
    }

    // Stop autoplay
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay(); // Reset timer on manual navigation
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay(); // Reset timer on manual navigation
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoPlay(); // Reset timer on manual navigation
        });
    });

    // Pause on hover
    heroSection.addEventListener('mouseenter', stopAutoPlay);
    heroSection.addEventListener('mouseleave', startAutoPlay);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only handle if hero section is in viewport
        const rect = heroSection.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInViewport) return;

        if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoPlay();
        }
    });

    // Initialize
    init();
}
