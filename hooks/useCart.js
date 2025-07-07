// Cart hook equivalent
class CartHook {
    constructor() {
        this.items = [];
        this.listeners = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        const saved = Utils.storage.get('cart', []);
        this.items = saved;
    }

    saveToStorage() {
        Utils.storage.set('cart', this.items);
    }

    // Subscribe to cart changes
    subscribe(callback) {
        this.listeners.push(callback);
        // Call immediately with current state
        callback({
            items: this.items,
            totalPrice: this.getTotalPrice(),
            totalItems: this.getTotalItems()
        });

        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            callback({
                items: this.items,
                totalPrice: this.getTotalPrice(),
                totalItems: this.getTotalItems()
            });
        });
    }

    addToCart(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveToStorage();
        this.notifyListeners();
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
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
            this.notifyListeners();
        }
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.notifyListeners();
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getCartData() {
        return {
            items: this.items,
            totalPrice: this.getTotalPrice(),
            totalItems: this.getTotalItems()
        };
    }
}

// Create global cart hook instance
window.useCart = new CartHook();