// Authentication hook equivalent
class AuthHook {
    constructor() {
        this.user = null;
        this.session = null;
        this.loading = true;
        this.listeners = [];
        this.init();
    }

    async init() {
        // Initialize auth state
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            this.session = session;
            this.user = session?.user || null;
            this.loading = false;
            this.notifyListeners();
        });

        // Get initial session
        const { data: sessionData } = await supabase.auth.getSession();
        this.session = sessionData.session;
        this.user = sessionData.session?.user || null;
        this.loading = false;
        this.notifyListeners();
    }

    // Subscribe to auth state changes
    subscribe(callback) {
        this.listeners.push(callback);
        // Call immediately with current state
        callback({
            user: this.user,
            session: this.session,
            loading: this.loading
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
                user: this.user,
                session: this.session,
                loading: this.loading
            });
        });
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

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            return { error };
        } catch (error) {
            return { error };
        }
    }

    async updateProfile(updates) {
        try {
            if (!this.user) {
                throw new Error('No user logged in');
            }

            const { data, error } = await supabase
                .from('profiles')
                .upsert({
                    id: this.user.id,
                    email: this.user.email,
                    ...updates
                });

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async getProfile() {
        try {
            if (!this.user) {
                return { data: null, error: new Error('No user logged in') };
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', this.user.id)
                .single();

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }
}

// Create global auth hook instance
window.useAuth = new AuthHook();