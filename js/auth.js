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
        // Set up auth state listener
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
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
        const { data: sessionData } = await supabase.auth.getSession();
        this.session = sessionData.session;
        this.user = sessionData.session?.user || null;
        this.loading = false;
        this.notifyListeners();
        this.updateUI();
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
        this.listeners.forEach(callback => callback(this.user, this.session, this.loading));
    }

    async signUp(email, password, fullName) {
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

            if (error) throw error;

            this.showToast('Account Created!', 'Please check your email to verify your account.', 'success');
            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    updateUI() {
        const signinBtn = document.getElementById('signin-btn');
        const userMenu = document.getElementById('user-menu');
        const userNameEl = document.getElementById('user-name');
        const userAvatarEl = document.getElementById('user-avatar-text');

        if (this.user) {
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
            signinBtn.classList.remove('hidden');
            userMenu.classList.add('hidden');
        }
    }

    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        this.resetAuthForms();
    }

    resetAuthForms() {
        // Reset form inputs
        document.getElementById('signin-email').value = '';
        document.getElementById('signin-password').value = '';
        document.getElementById('signup-name').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
        
        // Reset to sign in tab
        this.switchAuthTab('signin');
    }

    switchAuthTab(tab) {
        const signinTab = document.querySelector('[data-tab="signin"]');
        const signupTab = document.querySelector('[data-tab="signup"]');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');

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
        toast.querySelector('.toast-close').addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for global use
window.authManager = authManager;