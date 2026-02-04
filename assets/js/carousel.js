// assets/js/carousel.js

(function () {
    const carousels = document.querySelectorAll('.featured-carousel');

    carousels.forEach(carousel => {
        const carouselInner = carousel.querySelector('.carousel-inner');
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        const prevButton = carousel.querySelector('.carousel-control-prev');
        const nextButton = carousel.querySelector('.carousel-control-next');
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        const indicators = carousel.querySelectorAll('.indicator');

        let currentIndex = 0;
        let intervalTime = parseInt(carousel.dataset.carouselSpeed) || 5000; // Default: 5 seconds
        let transitionType = carousel.dataset.carouselTransition || 'slide'; // Default: slide
        let overlayColor = carousel.dataset.carouselOverlayColor || '#000000';
        let overlayOpacity = parseFloat(carousel.dataset.carouselOverlayOpacity) || 0.5;
        let imageFit = carousel.dataset.imageFit || 'cover'; // Default: cover
        let heroWidth = carousel.dataset.heroWidth;
        let heroHeight = carousel.dataset.heroHeight;

        let autoRotateInterval;

        // Apply dimensions to the carousel container
        if (heroHeight) {
            carousel.style.minHeight = `${heroHeight}px`;
        }

        // Apply overlay styles and image dimensions dynamically
        carouselItems.forEach(item => {
            const overlay = item.querySelector('.carousel-overlay');
            if (overlay) {
                overlay.style.backgroundColor = overlayColor;
                overlay.style.opacity = overlayOpacity;
            }
            const image = item.querySelector('.carousel-post-image');
            if (image) {
                image.style.objectFit = imageFit;
                // If width/height are set, apply them
                if (heroWidth) {
                    image.style.width = `${heroWidth}px`;
                }
                if (heroHeight) {
                    image.style.height = `${heroHeight}px`;
                }
            }
        });

        function showItem(index) {
            carouselItems.forEach((item, i) => {
                if (transitionType === 'fade') {
                    if (i === index) {
                        item.style.opacity = 1;
                        item.style.zIndex = 1;
                    } else {
                        item.style.opacity = 0;
                        item.style.zIndex = 0;
                    }
                } else { // 'slide' or default
                    item.classList.remove('active');
                    if (i === index) {
                        item.classList.add('active');
                    }
                }
            });
            indicators.forEach((indicator, i) => {
                indicator.classList.remove('active');
                if (i === index) {
                    indicator.classList.add('active');
                }
            });
            currentIndex = index;
        }

        function nextItem() {
            currentIndex = (currentIndex + 1) % carouselItems.length;
            showItem(currentIndex);
        }

        function prevItem() {
            currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            showItem(currentIndex);
        }

        function startAutoRotate() {
            stopAutoRotate(); // Clear any existing interval
            autoRotateInterval = setInterval(nextItem, intervalTime);
        }

        function stopAutoRotate() {
            clearInterval(autoRotateInterval);
        }

        // Event Listeners
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                stopAutoRotate();
                prevItem();
                startAutoRotate();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                stopAutoRotate();
                nextItem();
                startAutoRotate();
            });
        }

        if (indicatorsContainer) {
            indicatorsContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('indicator')) {
                    stopAutoRotate();
                    const slideTo = parseInt(event.target.dataset.slideTo);
                    showItem(slideTo);
                    startAutoRotate();
                }
            });
        }

        // Initial setup
        if (carouselItems.length > 0) {
            showItem(currentIndex);
            startAutoRotate();
        }
    });
})();
