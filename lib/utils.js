// Utility functions
class Utils {
    // Class name utility (similar to clsx/cn)
    static cn(...classes) {
        return classes
            .filter(Boolean)
            .map(cls => {
                if (typeof cls === 'string') return cls;
                if (typeof cls === 'object') {
                    return Object.entries(cls)
                        .filter(([_, value]) => Boolean(value))
                        .map(([key]) => key)
                        .join(' ');
                }
                return '';
            })
            .join(' ')
            .trim();
    }

    // Format currency
    static formatCurrency(amount, currency = 'Rs') {
        return `${currency} ${Math.round(amount)}`;
    }

    // Format date
    static formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
    }

    // Debounce function
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

    // Throttle function
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

    // Generate unique ID
    static generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Deep clone object
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = Utils.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Smooth scroll to element
    static scrollToElement(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    // Local storage helpers
    static storage = {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Error clearing localStorage:', error);
                return false;
            }
        }
    };

    // URL helpers
    static url = {
        getParams() {
            return new URLSearchParams(window.location.search);
        },

        getParam(name, defaultValue = null) {
            return this.getParams().get(name) || defaultValue;
        },

        setParam(name, value) {
            const url = new URL(window.location);
            url.searchParams.set(name, value);
            window.history.pushState({}, '', url);
        },

        removeParam(name) {
            const url = new URL(window.location);
            url.searchParams.delete(name);
            window.history.pushState({}, '', url);
        }
    };

    // Validation helpers
    static validate = {
        email(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        phone(phone) {
            const re = /^[\+]?[1-9][\d]{0,15}$/;
            return re.test(phone.replace(/\s/g, ''));
        },

        required(value) {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        },

        minLength(value, min) {
            return value && value.length >= min;
        },

        maxLength(value, max) {
            return value && value.length <= max;
        },

        number(value) {
            return !isNaN(value) && !isNaN(parseFloat(value));
        },

        positiveNumber(value) {
            return this.number(value) && parseFloat(value) > 0;
        }
    };

    // Animation helpers
    static animation = {
        fadeIn(element, duration = 300) {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            const start = performance.now();
            
            function animate(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = progress.toString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        },

        fadeOut(element, duration = 300) {
            const start = performance.now();
            const startOpacity = parseFloat(element.style.opacity) || 1;
            
            function animate(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = (startOpacity * (1 - progress)).toString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                }
            }
            
            requestAnimationFrame(animate);
        },

        slideDown(element, duration = 300) {
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.display = 'block';
            
            const targetHeight = element.scrollHeight;
            const start = performance.now();
            
            function animate(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.height = (targetHeight * progress) + 'px';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.height = '';
                    element.style.overflow = '';
                }
            }
            
            requestAnimationFrame(animate);
        },

        slideUp(element, duration = 300) {
            const startHeight = element.offsetHeight;
            const start = performance.now();
            
            element.style.overflow = 'hidden';
            
            function animate(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.height = (startHeight * (1 - progress)) + 'px';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    element.style.height = '';
                    element.style.overflow = '';
                }
            }
            
            requestAnimationFrame(animate);
        }
    };

    // Device detection
    static device = {
        isMobile() {
            return window.innerWidth < 768;
        },

        isTablet() {
            return window.innerWidth >= 768 && window.innerWidth < 1024;
        },

        isDesktop() {
            return window.innerWidth >= 1024;
        },

        isTouchDevice() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        }
    };

    // Performance helpers
    static performance = {
        measure(name, fn) {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`${name} took ${end - start} milliseconds`);
            return result;
        },

        async measureAsync(name, fn) {
            const start = performance.now();
            const result = await fn();
            const end = performance.now();
            console.log(`${name} took ${end - start} milliseconds`);
            return result;
        }
    };
}

// Make Utils available globally
window.Utils = Utils;

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}