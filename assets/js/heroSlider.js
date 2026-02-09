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
    
    // Get speed from data attribute
    const speedAttr = heroSection.getAttribute('data-speed') || '5s';
    let autoPlayDelay = 5000;
    let autoPlayEnabled = true;

    if (speedAttr === 'Off') {
        autoPlayEnabled = false;
    } else {
        autoPlayDelay = parseInt(speedAttr) * 1000;
    }

    // Initialize first slide
    function init() {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev-slide', 'next-slide', 'exiting', 'exiting-left', 'exiting-right');
            if (i === 0) {
                slide.classList.add('active');
            } else if (i === 1) {
                slide.classList.add('next-slide');
            } else if (i === slides.length - 1) {
                slide.classList.add('prev-slide');
            }
        });
        if (dots.length > 0) {
            dots[0].classList.add('active');
        }
        if (autoPlayEnabled) {
            startAutoPlay();
        }
    }

    // Show specific slide with stacking animation
    function showSlide(newIndex, direction = 'next') {
        if (newIndex === currentSlide) return;

        // Calculate actual index with wrapping
        let targetIndex = newIndex;
        if (targetIndex >= slides.length) {
            targetIndex = 0;
        } else if (targetIndex < 0) {
            targetIndex = slides.length - 1;
        }

        // Determine direction if not specified
        if (direction === 'auto') {
            direction = targetIndex > currentSlide ? 'next' : 'prev';
            // Handle wrap-around cases
            if (currentSlide === slides.length - 1 && targetIndex === 0) {
                direction = 'next';
            } else if (currentSlide === 0 && targetIndex === slides.length - 1) {
                direction = 'prev';
            }
        }

        // Prepare the next slide (position it underneath)
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev-slide', 'next-slide', 'exiting', 'exiting-left', 'exiting-right');
            
            if (i === targetIndex) {
                // This will be the new active slide
                slide.classList.add('active');
            } else if (i === currentSlide) {
                // Current slide slides away
                slide.classList.add('exiting');
                if (direction === 'next') {
                    slide.classList.add('exiting-left');
                } else {
                    slide.classList.add('exiting-right');
                }
            }
        });

        // Update dot navigation
        if (dots.length > 0) {
            dots[currentSlide].classList.remove('active');
            dots[targetIndex].classList.add('active');
        }

        // Update current slide index
        currentSlide = targetIndex;

        // Clean up exiting class after animation completes
        setTimeout(() => {
            slides.forEach(slide => {
                slide.classList.remove('exiting', 'exiting-left', 'exiting-right');
            });
        }, 800);
    }

    // Next slide
    function nextSlide() {
        showSlide(currentSlide + 1, 'next');
    }

    // Previous slide
    function prevSlide() {
        showSlide(currentSlide - 1, 'prev');
    }

    // Start autoplay
    function startAutoPlay() {
        if (!autoPlayEnabled) return;
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
