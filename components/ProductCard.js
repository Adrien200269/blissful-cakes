// Product Card Component
class ProductCard {
    constructor(product, container) {
        this.product = product;
        this.container = container;
        this.element = null;
        this.render();
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'product-card';
        this.element.innerHTML = this.getHTML();
        
        this.setupEventListeners();
        
        if (this.container) {
            this.container.appendChild(this.element);
        }
        
        return this.element;
    }

    getHTML() {
        return `
            <div class="product-image">
                <img src="${this.product.image_url || '/placeholder.svg'}" alt="${this.product.name}" loading="lazy">
                <div class="product-overlay"></div>
                <div class="product-price-badge">${Utils.formatCurrency(this.product.price)}</div>
            </div>
            <div class="product-content">
                <h3 class="product-title">${this.product.name}</h3>
                <p class="product-description">${this.product.description || ''}</p>
                <div class="product-price">${Utils.formatCurrency(this.product.price)}</div>
            </div>
            <div class="product-footer">
                <button class="add-to-cart-btn" ${!this.product.is_available ? 'disabled' : ''}>
                    <span class="cart-icon">🛒</span>
                    ${this.product.is_available ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        `;
    }

    setupEventListeners() {
        const addToCartBtn = this.element.querySelector('.add-to-cart-btn');
        if (addToCartBtn && this.product.is_available) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart();
            });
        }

        // Add hover effects
        this.element.addEventListener('mouseenter', () => {
            this.element.classList.add('hover');
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.classList.remove('hover');
        });
    }

    addToCart() {
        if (window.cartManager) {
            cartManager.addToCart(this.product);
        } else if (window.useCart) {
            useCart.addToCart(this.product);
        }
        
        // Add visual feedback
        const button = this.element.querySelector('.add-to-cart-btn');
        const originalText = button.innerHTML;
        
        button.innerHTML = `
            <span class="cart-icon">✅</span>
            Added!
        `;
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }

    update(newProduct) {
        this.product = newProduct;
        this.element.innerHTML = this.getHTML();
        this.setupEventListeners();
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    // Static method to create multiple product cards
    static renderProducts(products, container) {
        if (!container) return [];
        
        container.innerHTML = '';
        
        return products.map((product, index) => {
            const card = new ProductCard(product);
            const element = card.render();
            
            // Add staggered animation
            element.style.animationDelay = `${index * 100}ms`;
            element.classList.add('animate-fade-in-up');
            
            container.appendChild(element);
            return card;
        });
    }
}

// Make ProductCard available globally
window.ProductCard = ProductCard;