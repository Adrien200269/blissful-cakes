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
                authManager.showAuthModal();
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
                authManager.signOut();
            });
        }

        // Cart button
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartManager.showCartSidebar();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                cartManager.showCheckoutModal();
            });
        }

        // Auth tabs
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-tab')) {
                const tab = e.target.getAttribute('data-tab');
                authManager.switchAuthTab(tab);
            }
        });

        // Auth form submissions
        const signinForm = document.getElementById('signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignIn();
            });
        }

        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignUp();
            });
        }

        // Checkout form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCheckout();
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
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Show/hide pages
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        document.getElementById(`${page}-page`).classList.add('active');

        this.currentPage = page;
    }

    async handleSignIn() {
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        const submitBtn = document.getElementById('signin-submit');

        if (!email || !password) {
            authManager.showToast('Error', 'Please fill in all fields', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="spinner" style="width: 20px; height: 20px; margin-right: 8px;"></div>
            Signing In...
        `;

        const { error } = await authManager.signIn(email, password);

        if (error) {
            authManager.showToast('Sign In Error', error.message, 'error');
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <span class="submit-icon">🔒</span>
            Sign In
        `;
    }

    async handleSignUp() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const submitBtn = document.getElementById('signup-submit');

        if (!name || !email || !password) {
            authManager.showToast('Error', 'Please fill in all fields', 'error');
            return;
        }

        if (password.length < 6) {
            authManager.showToast('Error', 'Password must be at least 6 characters', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="spinner" style="width: 20px; height: 20px; margin-right: 8px;"></div>
            Creating Account...
        `;

        const { error } = await authManager.signUp(email, password, name);

        if (error) {
            authManager.showToast('Sign Up Error', error.message, 'error');
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <span class="submit-icon">✨</span>
            Create Account
        `;
    }

    async handleCheckout() {
        const phone = document.getElementById('checkout-phone').value;
        const address = document.getElementById('checkout-address').value;
        const notes = document.getElementById('checkout-notes').value;

        if (!phone || !address) {
            authManager.showToast('Error', 'Please fill in required fields', 'error');
            return;
        }

        const formData = { phone, address, notes };
        await cartManager.processCheckout(formData);
    }

    showProfileModal() {
        const modal = document.getElementById('profile-modal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Load user profile data
        this.loadUserProfile();
    }

    async loadUserProfile() {
        if (!authManager.user) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authManager.user.id)
                .single();

            if (data) {
                document.getElementById('profile-name').value = data.full_name || '';
                document.getElementById('profile-phone').value = data.phone || '';
                document.getElementById('profile-location').value = data.location || '';
                
                // Update avatar
                const avatarFallback = document.getElementById('avatar-fallback');
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
        document.getElementById('cart-sidebar').classList.add('hidden');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Reset forms
        authManager.resetAuthForms();
    }

    // Utility method to show loading state
    showLoading(element, text = 'Loading...') {
        const originalContent = element.innerHTML;
        element.disabled = true;
        element.innerHTML = `
            <div class="spinner" style="width: 20px; height: 20px; margin-right: 8px;"></div>
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

// Initialize UI manager
const uiManager = new UIManager();

// Export for global use
window.uiManager = uiManager;