// More Posts functionality - toggle showing all posts
document.addEventListener('DOMContentLoaded', function() {
    const morePostsButton = document.querySelector('.gh-more-posts-button');
    const postfeed = document.querySelector('.gh-postfeed');
    
    if (morePostsButton && postfeed) {
        morePostsButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle expanded class
            if (postfeed.classList.contains('gh-postfeed-expanded')) {
                // Collapse - hide extra posts
                postfeed.classList.remove('gh-postfeed-expanded');
                morePostsButton.textContent = 'More Posts →';
                postfeed.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Expand - show all posts
                postfeed.classList.add('gh-postfeed-expanded');
                morePostsButton.textContent = '← Show Less';
            }
        });
    }
});
