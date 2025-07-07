// Main application initialization and coordination
class App {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🎂 Initializing Blissful Cakes App...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.showErrorMessage('Failed to initialize application');
        }
    }

    async start() {
        try {
            console.log('🚀 Starting application...');
            
            // Initialize all managers (they're already initialized in their respective files)
            await this.waitForManagers();
            
            // Set up global error handling
            this.setupErrorHandling();
            
            // Set up performance monitoring
            this.setupPerformanceMonitoring();
            
            // Mark as initialized
            this.initialized = true;
            
            console.log('✅ Blissful Cakes App initialized successfully!');
            
            // Show welcome message for first-time visitors
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ App startup failed:', error);
            this.showErrorMessage('Failed to start application');
        }
    }

    async waitForManagers() {
        // Wait for all managers to be available
        const maxWait = 5000; // 5 seconds
        const startTime = Date.now();
        
        while (!window.authManager || !window.cartManager || !window.productsManager || !window.uiManager) {
            if (Date.now() - startTime > maxWait) {
                throw new Error('Managers failed to initialize within timeout');
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('📦 All managers loaded successfully');
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('🚨 Global error:', event.error);
            this.handleError(event.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Page load performance:', {
                loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
            });
        });
    }

    handleError(error) {
        // Don't show error messages for every error to avoid spam
        if (this.lastErrorTime && Date.now() - this.lastErrorTime < 5000) {
            return;
        }
        
        this.lastErrorTime = Date.now();
        
        // Show user-friendly error message
        if (window.authManager) {
            authManager.showToast(
                'Something went wrong',
                'Please try refreshing the page if the problem persists.',
                'error'
            );
        }
    }

    showErrorMessage(message) {
        // Fallback error display if toast system isn't available
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    showWelcomeMessage() {
        // Check if this is a first visit
        const hasVisited = localStorage.getItem('blissful_cakes_visited');
        
        if (!hasVisited && window.authManager) {
            setTimeout(() => {
                authManager.showToast(
                    '🎂 Welcome to Blissful Cakes!',
                    'Discover our delicious collection of cakes and treats.',
                    'success'
                );
                localStorage.setItem('blissful_cakes_visited', 'true');
            }, 2000);
        }
    }

    // Utility methods for other parts of the app
    static formatPrice(price) {
        return `Rs ${Math.round(price)}`;
    }

    static formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Development helpers
    static isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('stackblitz');
    }

    static log(...args) {
        if (this.isDevelopment()) {
            console.log('🎂 [Blissful Cakes]', ...args);
        }
    }

    static warn(...args) {
        if (this.isDevelopment()) {
            console.warn('⚠️ [Blissful Cakes]', ...args);
        }
    }

    static error(...args) {
        console.error('❌ [Blissful Cakes]', ...args);
    }
}

// Initialize the application
const app = new App();

// Make App class available globally for debugging
window.App = App;

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}

console.log('🎂 Blissful Cakes - Vanilla JavaScript Edition');
console.log('✨ Your sweet journey begins here!');