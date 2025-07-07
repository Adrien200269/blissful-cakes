// Authentication management
class AuthManager {
    constructor() {
        this.user = null;
        this.session = null;
        this.loading = true;
        this.listeners = [];
        
        this.init();
    }

    async init() {
        console.log('🔐 Initializing AuthManager...');
        
        // Wait for supabase to be available
        if (!window.supabase) {
            console.error('Supabase not available');
            return;
        }

        // Set up auth state listener
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            this.session = session;
            this.user = session?.user || null;
            this.loading = false;
            this.notifyListeners();
            
            if (event === 'SIGNED_IN') {
                this.showToast('Welcome back!', 'You have successfully signed in.', 'success');
                this.closeAuthModal();
                this.updateUI();
            } else if (event === 'SIGNED_OUT') {
                this.showToast('Signed Out', 'You have been signed out successfully.', 'success');
                this.updateUI();
            }
        });

        // Get initial session
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            this.session = sessionData.session;
            this.user = sessionData.session?.user || null;
            this.loading = false;
            this.notifyListeners();
            this.updateUI();
            
            console.log('Initial auth state:', this.user ? 'Signed in' : 'Signed out');
        } catch (error) {
            console.error('Error getting initial session:', error);
            this.loading = false;
            this.notifyListeners();
            this.updateUI();
        }
    }

    onAuthStateChange(callback) {
        this.listeners.push(callback);
        // Call immediately with current state
        callback(this.user, this.session, this.loading);
        
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.user, this.session, this.loading);
            } catch (error) {
                console.error('Auth listener error:', error);
            }
        });
    }

    async signUp(email, password, fullName) {
        console.log('Attempting signup for:', email);
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) {
                console.error('Signup error:', error);
                throw error;
            }

            console.log('Signup successful:', data);
            this.showToast('Account Created!', 'Please check your email to verify your account.', 'success');
            return { error: null };
        } catch (error) {
            console.error('Signup failed:', error);
            return { error };
        }
    }

    async signIn(email, password) {
        console.log('Attempting signin for:', email);
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Signin error:', error);
                throw error;
            }

            console.log('Signin successful:', data);
            return { error: null };
        } catch (error) {
            console.error('Signin failed:', error);
            return { error };
        }
    }

    async signOut() {
        console.log('Attempting signout...');
        
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Signout error:', error);
                throw error;
            }
            console.log('Signout successful');
        } catch (error) {
            console.error('Sign out error:', error);
            // Still update UI even if there's an error
            this.user = null;
            this.session = null;
            this.updateUI();
        }
    }

    updateUI() {
        const signinBtn = document.getElementById('signin-btn');
        const userMenu = document.getElementById('user-menu');
        const userNameEl = document.getElementById('user-name');
        const userAvatarEl = document.getElementById('user-avatar-text');

        if (!signinBtn || !userMenu) {
            console.warn('UI elements not found');
            return;
        }

        if (this.user) {
            console.log('Updating UI for signed in user:', this.user.email);
            signinBtn.classList.add('hidden');
            userMenu.classList.remove('hidden');
            
            // Update user info
            if (userNameEl) {
                userNameEl.textContent = this.user.user_metadata?.full_name || this.user.email;
            }
            if (userAvatarEl) {
                const name = this.user.user_metadata?.full_name || this.user.email;
                userAvatarEl.textContent = name.charAt(0).toUpperCase();
            }
        } else {
            console.log('Updating UI for signed out user');
            signinBtn.classList.remove('hidden');
            userMenu.classList.add('hidden');
        }
    }

    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            this.resetAuthForms();
        }
    }

    resetAuthForms() {
        // Reset form inputs
        const inputs = [
            'signin-email', 'signin-password',
            'signup-name', 'signup-email', 'signup-password'
        ];
        
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
        
        // Reset to sign in tab
        this.switchAuthTab('signin');
    }

    switchAuthTab(tab) {
        const signinTab = document.querySelector('[data-tab="signin"]');
        const signupTab = document.querySelector('[data-tab="signup"]');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');

        if (!signinTab || !signupTab || !signinForm || !signupForm) {
            console.warn('Auth tab elements not found');
            return;
        }

        if (tab === 'signin') {
            signinTab.classList.add('active');
            signupTab.classList.remove('active');
            signinForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupTab.classList.add('active');
            signinTab.classList.remove('active');
            signupForm.classList.add('active');
            signinForm.classList.remove('active');
        }
    }

    showToast(title, message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) {
            console.warn('Toast container not found');
            return;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-header">${title}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);

        // Manual close
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            });
        }
    }
}

// Initialize auth manager when DOM is ready
let authManager;

function initAuthManager() {
    if (window.supabase) {
        authManager = new AuthManager();
        window.authManager = authManager;
        console.log('✅ AuthManager initialized');
    } else {
        console.log('⏳ Waiting for Supabase...');
        setTimeout(initAuthManager, 100);
    }
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthManager);
} else {
    initAuthManager();
}