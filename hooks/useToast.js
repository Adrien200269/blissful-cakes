// Toast hook equivalent
class ToastHook {
    constructor() {
        this.toasts = [];
        this.listeners = [];
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    // Subscribe to toast changes
    subscribe(callback) {
        this.listeners.push(callback);
        // Call immediately with current state
        callback({ toasts: this.toasts });

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
            callback({ toasts: this.toasts });
        });
    }

    toast({ title, description, variant = 'default', duration = 5000 }) {
        const id = Utils.generateId('toast');
        const toast = {
            id,
            title,
            description,
            variant,
            duration,
            timestamp: Date.now()
        };

        this.toasts.push(toast);
        this.renderToast(toast);
        this.notifyListeners();

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.dismiss(id);
            }, duration);
        }

        return {
            id,
            dismiss: () => this.dismiss(id),
            update: (updates) => this.update(id, updates)
        };
    }

    dismiss(id) {
        this.toasts = this.toasts.filter(toast => toast.id !== id);
        const toastElement = document.getElementById(id);
        if (toastElement) {
            toastElement.remove();
        }
        this.notifyListeners();
    }

    update(id, updates) {
        const toastIndex = this.toasts.findIndex(toast => toast.id === id);
        if (toastIndex > -1) {
            this.toasts[toastIndex] = { ...this.toasts[toastIndex], ...updates };
            this.notifyListeners();
        }
    }

    renderToast(toast) {
        const toastElement = document.createElement('div');
        toastElement.id = toast.id;
        toastElement.className = `toast ${toast.variant}`;
        
        toastElement.innerHTML = `
            ${toast.title ? `<div class="toast-header">${toast.title}</div>` : ''}
            ${toast.description ? `<div class="toast-message">${toast.description}</div>` : ''}
            <button class="toast-close" onclick="useToast.dismiss('${toast.id}')">&times;</button>
        `;

        this.container.appendChild(toastElement);

        // Animate in
        requestAnimationFrame(() => {
            toastElement.classList.add('animate-slide-in-right');
        });
    }

    // Convenience methods
    success(title, description) {
        return this.toast({ title, description, variant: 'success' });
    }

    error(title, description) {
        return this.toast({ title, description, variant: 'error' });
    }

    warning(title, description) {
        return this.toast({ title, description, variant: 'warning' });
    }

    info(title, description) {
        return this.toast({ title, description, variant: 'default' });
    }
}

// Create global toast hook instance
window.useToast = new ToastHook();