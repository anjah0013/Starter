class PostFilters {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentFilters = {
            tag: '',
            author: '',
            sort: 'published_at desc'
        };
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.collectPosts();
    }

    cacheElements() {
        this.tagFilter = document.getElementById('tagFilter');
        this.authorFilter = document.getElementById('authorFilter');
        this.sortFilter = document.getElementById('sortFilter');
        this.resetButton = document.getElementById('resetFilters');
        this.postsContainer = document.getElementById('postsContainer');
        this.activeFiltersContainer = document.getElementById('activeFilters');
    }

    bindEvents() {
        this.tagFilter.addEventListener('change', (e) => this.handleFilterChange('tag', e.target.value));
        this.authorFilter.addEventListener('change', (e) => this.handleFilterChange('author', e.target.value));
        this.sortFilter.addEventListener('change', (e) => this.handleFilterChange('sort', e.target.value));
        this.resetButton.addEventListener('click', () => this.resetFilters());
    }

    collectPosts() {
        const postCards = document.querySelectorAll('.gh-card');
        this.posts = Array.from(postCards).map(card => this.extractPostData(card));
        this.filteredPosts = [...this.posts];
    }

    extractPostData(card) {
        const title = card.querySelector('.gh-card-title')?.textContent.trim() || '';
        const url = card.querySelector('.gh-card-link')?.href || '';
        const excerpt = card.querySelector('.gh-card-content p')?.textContent.trim() || '';
        const featureImage = card.querySelector('.gh-card-image')?.src || '';
        const date = card.querySelector('time')?.getAttribute('datetime') || '';
        const readingTime = card.querySelector('.gh-card-meta')?.textContent.split('•')[1]?.trim() || '';
        
        // Extract tags
        const tags = Array.from(card.querySelectorAll('.gh-card-tag')).map(tag => ({
            name: tag.textContent.trim(),
            slug: this.slugify(tag.textContent.trim())
        }));

        // Extract authors
        const authors = Array.from(card.querySelectorAll('.gh-card-author')).map(author => ({
            name: author.textContent.trim(),
            slug: this.slugify(author.textContent.trim())
        }));

        // Check if featured
        const isFeatured = card.classList.contains('featured') || card.querySelector('.gh-card-featured');

        return {
            element: card,
            title,
            url,
            excerpt,
            featureImage,
            date,
            readingTime,
            tags,
            authors,
            isFeatured,
            timestamp: new Date(date).getTime() || 0
        };
    }

    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    handleFilterChange(filterType, value) {
        this.currentFilters[filterType] = value;
        this.applyFilters();
        this.updateActiveFilters();
    }

    applyFilters() {
        this.filteredPosts = this.posts.filter(post => {
            // Tag filter
            if (this.currentFilters.tag) {
                const hasTag = post.tags.some(tag => tag.slug === this.currentFilters.tag);
                if (!hasTag) return false;
            }

            // Author filter
            if (this.currentFilters.author) {
                const hasAuthor = post.authors.some(author => author.slug === this.currentFilters.author);
                if (!hasAuthor) return false;
            }

            return true;
        });

        this.sortPosts();
        this.renderPosts();
    }

    sortPosts() {
        const sortOption = this.currentFilters.sort;
        
        this.filteredPosts.sort((a, b) => {
            switch (sortOption) {
                case 'published_at desc':
                    return b.timestamp - a.timestamp;
                case 'published_at asc':
                    return a.timestamp - b.timestamp;
                case 'title asc':
                    return a.title.localeCompare(b.title);
                case 'title desc':
                    return b.title.localeCompare(a.title);
                case 'featured desc,published_at desc':
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    return b.timestamp - a.timestamp;
                default:
                    return b.timestamp - a.timestamp;
            }
        });
    }

    renderPosts() {
        const noResults = this.postsContainer.querySelector('.gh-no-results');
        
        if (this.filteredPosts.length === 0) {
            // Hide all post cards
            this.posts.forEach(post => post.element.style.display = 'none');
            // Show no results message
            if (noResults) noResults.style.display = 'block';
        } else {
            // Hide no results message
            if (noResults) noResults.style.display = 'none';
            
            // Hide all posts first
            this.posts.forEach(post => post.element.style.display = 'none');
            
            // Show filtered posts in order
            this.filteredPosts.forEach(post => {
                post.element.style.display = 'block';
                this.postsContainer.appendChild(post.element);
            });
        }
    }

    updateActiveFilters() {
        const activeFilters = [];
        
        if (this.currentFilters.tag) {
            const tagOption = this.tagFilter.querySelector(`option[value="${this.currentFilters.tag}"]`);
            activeFilters.push({
                type: 'tag',
                value: this.currentFilters.tag,
                label: tagOption?.textContent || this.currentFilters.tag
            });
        }
        
        if (this.currentFilters.author) {
            const authorOption = this.authorFilter.querySelector(`option[value="${this.currentFilters.author}"]`);
            activeFilters.push({
                type: 'author',
                value: this.currentFilters.author,
                label: authorOption?.textContent || this.currentFilters.author
            });
        }

        this.renderActiveFilters(activeFilters);
    }

    renderActiveFilters(activeFilters) {
        if (activeFilters.length === 0) {
            this.activeFiltersContainer.innerHTML = '';
            return;
        }

        const html = activeFilters.map(filter => `
            <div class="gh-active-filter">
                <span>${filter.label}</span>
                <button class="gh-filter-remove" data-type="${filter.type}" data-value="${filter.value}">×</button>
            </div>
        `).join('');

        this.activeFiltersContainer.innerHTML = html;

        // Bind remove events
        this.activeFiltersContainer.querySelectorAll('.gh-filter-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.removeFilter(type);
            });
        });
    }

    removeFilter(type) {
        this.currentFilters[type] = '';
        
        // Reset the corresponding dropdown
        switch (type) {
            case 'tag':
                this.tagFilter.value = '';
                break;
            case 'author':
                this.authorFilter.value = '';
                break;
        }
        
        this.applyFilters();
        this.updateActiveFilters();
    }

    resetFilters() {
        this.currentFilters = {
            tag: '',
            author: '',
            sort: 'published_at desc'
        };
        
        this.tagFilter.value = '';
        this.authorFilter.value = '';
        this.sortFilter.value = 'published_at desc';
        
        this.applyFilters();
        this.updateActiveFilters();
    }
}

// Initialize filters when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('postsContainer')) {
        new PostFilters();
    }
});
