// UI management and interactions
class UIManager {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupModals();
        this.setupPasswordToggles();
        this.hideLoadingScreen();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                }, 300);
            }
        }, 1000);
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateToPage(page);
            }
        });

        // Auth modal triggers
        const signinBtn = document.getElementById('signin-btn');
        if (signinBtn) {
            signinBtn.addEventListener('click', () => {
                if (window.authManager) {
                    authManager.showAuthModal();
                }
            });
        }

        // Profile modal trigger
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.showProfileModal();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (window.authManager) {
                    authManager.signOut();
                }
            });
        }

        // Cart button
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                if (window.cartManager) {
                    cartManager.showCartSidebar();
                }
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (window.cartManager) {
                    cartManager.showCheckoutModal();
                }
            });
        }

        // Auth tabs
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-tab')) {
                const tab = e.target.getAttribute('data-tab');
                if (window.authManager) {
                    authManager.switchAuthTab(tab);
                }
            }
        });

        // Auth form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.closest('#signin-form')) {
                e.preventDefault();
                this.handleSignIn();
            } else if (e.target.closest('#signup-form')) {
                e.preventDefault();
                this.handleSignUp();
            } else if (e.target.closest('#checkout-form')) {
                e.preventDefault();
                this.handleCheckout();
            }
        });

        // Handle signin button click
        const signinSubmit = document.getElementById('signin-submit');
        if (signinSubmit) {
            signinSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSignIn();
            });
        }

        // Handle signup button click
        const signupSubmit = document.getElementById('signup-submit');
        if (signupSubmit) {
            signupSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSignUp();
            });
        }
    }

    setupModals() {
        // Close modals when clicking overlay or close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || 
                e.target.classList.contains('modal-close') ||
                e.target.classList.contains('sidebar-overlay') ||
                e.target.classList.contains('sidebar-close')) {
                this.closeAllModals();
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Cancel buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'cancel-checkout' || e.target.id === 'cancel-profile') {
                this.closeAllModals();
            }
        });
    }

    setupPasswordToggles() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('password-toggle')) {
                const targetId = e.target.getAttribute('data-target');
                const input = document.getElementById(targetId);
                if (input) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        e.target.textContent = '🙈';
                    } else {
                        input.type = 'password';
                        e.target.textContent = '👁️';
                    }
                }
            }
        });
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Show/hide pages
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        this.currentPage = page;
    }

    async handleSignIn() {
        console.log('🔐 Handling sign in...');
        
        const email = document.getElementById('signin-email')?.value;
        const password = document.getElementById('signin-password')?.value;
        const submitBtn = document.getElementById('signin-submit');

        if (!email || !password) {
            if (window.authManager) {
                authManager.showToast('Error', 'Please fill in all fields', 'error');
            }
            return;
        }

        if (!window.authManager) {
            console.error('AuthManager not available');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div class="spinner" style="width: 20px; height: 20px; margin-right: 8px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                Signing In...
            `;
        }

        try {
            const { error } = await authManager.signIn(email, password);

            if (error) {
                authManager.showToast('Sign In Error', error.message, 'error');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            if (window.authManager) {
                authManager.showToast('Sign In Error', 'An unexpected error occurred', 'error');
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span class="submit-icon">🔒</span>
                    Sign In
                `;
            }
        }
    }

    async handleSignUp() {
        console.log('📝 Handling sign up...');
        
        const name = document.getElementById('signup-name')?.value;
        const email = document.getElementById('signup-email')?.value;
        const password = document.getElementById('signup-password')?.value;
        const submitBtn = document.getElementById('signup-submit');

        if (!name || !email || !password) {
            if (window.authManager) {
                authManager.showToast('Error', 'Please fill in all fields', 'error');
            }
            return;
        }

        if (password.length < 6) {
            if (window.authManager) {
                authManager.showToast('Error', 'Password must be at least 6 characters', 'error');
            }
            return;
        }

        if (!window.authManager) {
            console.error('AuthManager not available');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div class="spinner" style="width: 20px; height: 20px; margin-right: 8px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                Creating Account...
            `;
        }

        try {
            const { error } = await authManager.signUp(email, password, name);

            if (error) {
                authManager.showToast('Sign Up Error', error.message, 'error');
            }
        } catch (error) {
            console.error('Sign up error:', error);
            if (window.authManager) {
                authManager.showToast('Sign Up Error', 'An unexpected error occurred', 'error');
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span class="submit-icon">✨</span>
                    Create Account
                `;
            }
        }
    }

    async handleCheckout() {
        const phone = document.getElementById('checkout-phone')?.value;
        const address = document.getElementById('checkout-address')?.value;
        const notes = document.getElementById('checkout-notes')?.value;

        if (!phone || !address) {
            if (window.authManager) {
                authManager.showToast('Error', 'Please fill in required fields', 'error');
            }
            return;
        }

        const formData = { phone, address, notes };
        if (window.cartManager) {
            await cartManager.processCheckout(formData);
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Load user profile data
            this.loadUserProfile();
        }
    }

    async loadUserProfile() {
        if (!window.authManager || !authManager.user) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authManager.user.id)
                .single();

            if (data) {
                const profileName = document.getElementById('profile-name');
                const profilePhone = document.getElementById('profile-phone');
                const profileLocation = document.getElementById('profile-location');
                const avatarFallback = document.getElementById('avatar-fallback');

                if (profileName) profileName.value = data.full_name || '';
                if (profilePhone) profilePhone.value = data.phone || '';
                if (profileLocation) profileLocation.value = data.location || '';
                
                // Update avatar
                if (avatarFallback) {
                    const name = data.full_name || authManager.user.email;
                    avatarFallback.textContent = name.charAt(0).toUpperCase();
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    closeAllModals() {
        // Close all modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        
        // Close sidebar
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.add('hidden');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Reset forms
        if (window.authManager) {
            authManager.resetAuthForms();
        }
    }

    // Utility method to show loading state
    showLoading(element, text = 'Loading...') {
        if (!element) return () => {};
        
        const originalContent = element.innerHTML;
        element.disabled = true;
        element.innerHTML = `
            <div class="spinner" style="width: 20px; height: 20px; margin-right: 8px; border: 2px solid currentColor; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            ${text}
        `;
        
        return () => {
            element.disabled = false;
            element.innerHTML = originalContent;
        };
    }

    // Utility method to format currency
    formatCurrency(amount) {
        return `Rs ${Math.round(amount)}`;
    }

    // Utility method to format date
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize UI manager when DOM is ready
let uiManager;

function initUIManager() {
    uiManager = new UIManager();
    window.uiManager = uiManager;
    console.log('✅ UIManager initialized');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUIManager);
} else {
    initUIManager();
}