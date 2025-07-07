// Cart management
class CartManager {
    constructor() {
        this.items = [];
        this.listeners = [];
        this.loadFromStorage();
        this.updateUI();
    }

    loadFromStorage() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                this.items = JSON.parse(saved);
            } catch (error) {
                console.error('Error loading cart from storage:', error);
                this.items = [];
            }
        }
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    addToCart(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            authManager.showToast('Updated Cart', `${product.name} quantity increased`, 'success');
        } else {
            this.items.push({ ...product, quantity: 1 });
            authManager.showToast('Added to Cart', `${product.name} added to your cart`, 'success');
        }
        
        this.saveToStorage();
        this.updateUI();
        this.notifyListeners();
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateUI();
        this.notifyListeners();
    }

    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveToStorage();
            this.updateUI();
            this.notifyListeners();
        }
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateUI();
        this.notifyListeners();
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    updateUI() {
        this.updateCartBadge();
        this.updateCartSidebar();
    }

    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        const count = document.getElementById('cart-count');
        const totalItems = this.getTotalItems();
        
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove('hidden');
            if (count) count.textContent = totalItems;
        } else {
            badge.classList.add('hidden');
            if (count) count.textContent = '0';
        }
    }

    updateCartSidebar() {
        const cartItems = document.getElementById('cart-items');
        const cartFooter = document.getElementById('cart-footer');
        const cartTotal = document.getElementById('cart-total');
        
        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <small>Add some delicious cakes to get started!</small>
                </div>
            `;
            cartFooter.classList.add('hidden');
        } else {
            cartItems.innerHTML = this.items.map((item, index) => `
                <div class="cart-item" style="animation-delay: ${index * 100}ms">
                    <div class="cart-item-image">
                        <img src="${item.image_url || '/placeholder.svg'}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rs ${Math.round(item.price)}</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            <button class="remove-btn" onclick="cartManager.removeFromCart('${item.id}')">🗑️</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        <div class="cart-item-total-price">Rs ${Math.round(item.price * item.quantity)}</div>
                    </div>
                </div>
            `).join('');
            
            cartFooter.classList.remove('hidden');
            if (cartTotal) {
                cartTotal.textContent = Math.round(this.getTotalPrice());
            }
        }
    }

    showCartSidebar() {
        const sidebar = document.getElementById('cart-sidebar');
        sidebar.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.updateCartSidebar();
    }

    hideCartSidebar() {
        const sidebar = document.getElementById('cart-sidebar');
        sidebar.classList.add('hidden');
        document.body.style.overflow = '';
    }

    showCheckoutModal() {
        if (!authManager.user) {
            authManager.showAuthModal();
            return;
        }

        const modal = document.getElementById('checkout-modal');
        const checkoutItems = document.getElementById('checkout-items');
        const checkoutTotal = document.getElementById('checkout-total');
        
        // Populate checkout items
        checkoutItems.innerHTML = this.items.map(item => `
            <div class="checkout-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>Rs ${Math.round(item.price * item.quantity)}</span>
            </div>
        `).join('');
        
        checkoutTotal.textContent = Math.round(this.getTotalPrice());
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset form
        document.getElementById('checkout-form').reset();
    }

    async processCheckout(formData) {
        if (!authManager.user) {
            authManager.showToast('Authentication Required', 'Please sign in to place an order.', 'error');
            return;
        }

        try {
            // Create order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: authManager.user.id,
                    total_amount: this.getTotalPrice(),
                    delivery_address: formData.address,
                    phone: formData.phone,
                    notes: formData.notes,
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = this.items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            authManager.showToast('Order Placed Successfully!', 'Your order has been received and will be processed soon.', 'success');
            
            this.clearCart();
            this.hideCheckoutModal();
            this.hideCartSidebar();
            
        } catch (error) {
            console.error('Order error:', error);
            authManager.showToast('Order Failed', 'There was an error placing your order. Please try again.', 'error');
        }
    }

    onChange(callback) {
        this.listeners.push(callback);
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.items));
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Export for global use
window.cartManager = cartManager;