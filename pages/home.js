// Home page functionality
class HomePage {
    constructor() {
        this.searchTerm = '';
        this.selectedCategory = '';
        this.products = [];
        this.categories = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.render();
    }

    async loadData() {
        try {
            // Load categories
            const { data: categories, error: catError } = await supabase
                .from('categories')
                .select('*')
                .order('name');
            
            if (catError) throw catError;
            this.categories = categories || [];

            // Load products
            await this.loadProducts();
        } catch (error) {
            console.error('Error loading data:', error);
            authManager.showToast('Error', 'Failed to load data', 'error');
        }
    }

    async loadProducts() {
        try {
            let query = supabase
                .from('products')
                .select('*')
                .eq('is_available', true)
                .order('name');

            if (this.selectedCategory) {
                query = query.eq('category_id', this.selectedCategory);
            }

            if (this.searchTerm) {
                query = query.ilike('name', `%${this.searchTerm}%`);
            }

            const { data, error } = await query;
            
            if (error) throw error;
            this.products = data || [];
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', App.debounce((e) => {
                this.searchTerm = e.target.value;
                this.loadProducts();
            }, 300));
        }

        // Category filters
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                this.selectedCategory = e.target.getAttribute('data-category');
                this.loadProducts();
            }
        });
    }

    render() {
        this.renderCategoryFilters();
        this.renderProducts();
    }

    renderCategoryFilters() {
        const container = document.querySelector('.category-filters');
        if (!container) return;

        // Clear existing buttons except "All Items"
        const allButton = container.querySelector('[data-category=""]');
        container.innerHTML = '';
        container.appendChild(allButton);

        // Add category buttons
        this.categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-btn';
            button.textContent = category.name;
            button.setAttribute('data-category', category.id);
            container.appendChild(button);
        });
    }

    renderProducts() {
        const container = document.getElementById('products-grid');
        const noProducts = document.getElementById('no-products');
        
        if (!container) return;

        if (this.products.length === 0) {
            container.innerHTML = '';
            noProducts.classList.remove('hidden');
            return;
        }

        noProducts.classList.add('hidden');
        
        container.innerHTML = this.products.map((product, index) => `
            <div class="product-card" style="animation-delay: ${index * 100}ms">
                <div class="product-image">
                    <img src="${product.image_url || '/placeholder.svg'}" alt="${product.name}">
                    <div class="product-overlay"></div>
                    <div class="product-price-badge">${App.formatPrice(product.price)}</div>
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-price">${App.formatPrice(product.price)}</div>
                </div>
                <div class="product-footer">
                    <button class="add-to-cart-btn" onclick="cartManager.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" ${!product.is_available ? 'disabled' : ''}>
                        <span class="cart-icon">🛒</span>
                        ${product.is_available ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize home page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.homePage = new HomePage();
    });
} else {
    window.homePage = new HomePage();
}