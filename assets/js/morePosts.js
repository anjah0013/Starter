// More Posts functionality - toggle showing posts 4-6
document.addEventListener('DOMContentLoaded', function() {
    const morePostsButton = document.querySelector('.gh-more-posts-button');
    const postfeed = document.querySelector('.gh-postfeed');
    
    if (morePostsButton && postfeed) {
        morePostsButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle expanded class
            if (postfeed.classList.contains('gh-postfeed-expanded')) {
                // Collapse - hide posts 4-6
                postfeed.classList.remove('gh-postfeed-expanded');
                morePostsButton.textContent = 'More Posts →';
                postfeed.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Expand - show posts 4-6
                postfeed.classList.add('gh-postfeed-expanded');
                morePostsButton.textContent = '← Show Less';
            }
        });
    }
});
