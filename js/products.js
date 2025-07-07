// Products management
class ProductsManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.filteredProducts = [];
        this.loading = false;
        this.searchTerm = '';
        this.selectedCategory = '';
        
        this.init();
    }

    async init() {
        await this.loadCategories();
        await this.loadProducts();
        this.setupEventListeners();
    }

    async loadCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');
            
            if (error) throw error;
            
            this.categories = data || [];
            this.renderCategoryFilters();
        } catch (error) {
            console.error('Error loading categories:', error);
            authManager.showToast('Error', 'Failed to load categories', 'error');
        }
    }

    async loadProducts() {
        this.setLoading(true);
        
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
            this.filteredProducts = this.products;
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            authManager.showToast('Error', 'Failed to load products', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        this.loading = loading;
        const loadingEl = document.getElementById('products-loading');
        const gridEl = document.getElementById('products-grid');
        const noProductsEl = document.getElementById('no-products');
        
        if (loading) {
            loadingEl.classList.remove('hidden');
            gridEl.classList.add('hidden');
            noProductsEl.classList.add('hidden');
        } else {
            loadingEl.classList.add('hidden');
            gridEl.classList.remove('hidden');
            
            if (this.products.length === 0) {
                noProductsEl.classList.remove('hidden');
                gridEl.classList.add('hidden');
            } else {
                noProductsEl.classList.add('hidden');
            }
        }
    }

    renderCategoryFilters() {
        const container = document.querySelector('.category-filters');
        if (!container) return;
        
        const allButton = container.querySelector('[data-category=""]');
        
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
        if (!container) return;
        
        if (this.products.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = this.products.map((product, index) => `
            <div class="product-card" style="animation-delay: ${index * 100}ms">
                <div class="product-image">
                    <img src="${product.image_url || '/placeholder.svg'}" alt="${product.name}">
                    <div class="product-overlay"></div>
                    <div class="product-price-badge">Rs ${Math.round(product.price)}</div>
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-price">Rs ${Math.round(product.price)}</div>
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

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.debounceSearch();
            });
        }

        // Category filters
        const categoryContainer = document.querySelector('.category-filters');
        if (categoryContainer) {
            categoryContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('category-btn')) {
                    // Update active state
                    categoryContainer.querySelectorAll('.category-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    e.target.classList.add('active');
                    
                    // Update selected category
                    this.selectedCategory = e.target.getAttribute('data-category');
                    this.loadProducts();
                }
            });
        }
    }

    debounceSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.loadProducts();
        }, 300);
    }

    filterProducts() {
        let filtered = [...this.products];
        
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(term) ||
                (product.description && product.description.toLowerCase().includes(term))
            );
        }
        
        if (this.selectedCategory) {
            filtered = filtered.filter(product => product.category_id === this.selectedCategory);
        }
        
        this.filteredProducts = filtered;
        this.renderProducts();
    }
}

// Initialize products manager
const productsManager = new ProductsManager();

// Export for global use
window.productsManager = productsManager;