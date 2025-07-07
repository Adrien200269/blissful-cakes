// Supabase configuration
const SUPABASE_URL = "https://ekrdsjwpjeigyiwagmyu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrcmRzandwamVpZ3lpd2FnbXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNTkxOTgsImV4cCI6MjA2NTYzNTE5OH0.kUas6Nq7HPw7wtV89VXgqBmRh4JjNNnmlgthuupdfJo";

// Simple Supabase client implementation
class SupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
        this.auth = new AuthClient(this);
    }

    from(table) {
        return new QueryBuilder(this, table);
    }

    async request(method, path, body = null) {
        const headers = {
            'Content-Type': 'application/json',
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`
        };

        const token = localStorage.getItem('supabase_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${this.url}/rest/v1${path}`, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            console.error('Supabase request error:', error);
            return { data: null, error };
        }
    }
}

class AuthClient {
    constructor(client) {
        this.client = client;
        this.currentUser = null;
        this.currentSession = null;
        this.listeners = [];
        
        // Check for existing session on initialization
        this.initializeSession();
    }

    async initializeSession() {
        const token = localStorage.getItem('supabase_token');
        const userStr = localStorage.getItem('supabase_user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                this.currentUser = user;
                this.currentSession = { 
                    access_token: token, 
                    user: user,
                    expires_at: localStorage.getItem('supabase_expires_at')
                };
                
                // Verify token is still valid
                await this.verifyToken(token);
                
                this.notifyListeners('SIGNED_IN', this.currentSession);
            } catch (error) {
                console.error('Session initialization error:', error);
                this.clearSession();
            }
        } else {
            this.notifyListeners('SIGNED_OUT', null);
        }
    }

    async verifyToken(token) {
        try {
            const response = await fetch(`${this.client.url}/auth/v1/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'apikey': this.client.key
                }
            });

            if (!response.ok) {
                throw new Error('Token verification failed');
            }

            const userData = await response.json();
            this.currentUser = userData;
            localStorage.setItem('supabase_user', JSON.stringify(userData));
            
            return true;
        } catch (error) {
            console.error('Token verification failed:', error);
            this.clearSession();
            return false;
        }
    }

    clearSession() {
        localStorage.removeItem('supabase_token');
        localStorage.removeItem('supabase_user');
        localStorage.removeItem('supabase_expires_at');
        this.currentUser = null;
        this.currentSession = null;
    }

    async signUp({ email, password, options = {} }) {
        try {
            const response = await fetch(`${this.client.url}/auth/v1/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.client.key
                },
                body: JSON.stringify({
                    email,
                    password,
                    data: options.data || {}
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || data.message || data.error_description || 'Sign up failed');
            }

            // Handle successful signup
            if (data.user) {
                console.log('Signup successful:', data);
            }

            return { data, error: null };
        } catch (error) {
            console.error('Signup error:', error);
            return { data: null, error };
        }
    }

    async signInWithPassword({ email, password }) {
        try {
            const response = await fetch(`${this.client.url}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.client.key
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.error_description || data.msg || data.message || 'Sign in failed';
                throw new Error(errorMessage);
            }

            // Store session data
            if (data.access_token && data.user) {
                localStorage.setItem('supabase_token', data.access_token);
                localStorage.setItem('supabase_user', JSON.stringify(data.user));
                
                if (data.expires_at) {
                    localStorage.setItem('supabase_expires_at', data.expires_at);
                }

                this.currentUser = data.user;
                this.currentSession = data;
                
                console.log('Sign in successful:', data.user);
                this.notifyListeners('SIGNED_IN', data);
            }

            return { data, error: null };
        } catch (error) {
            console.error('Sign in error:', error);
            return { data: null, error };
        }
    }

    async signOut() {
        try {
            const token = localStorage.getItem('supabase_token');
            if (token) {
                // Attempt to call logout endpoint
                try {
                    await fetch(`${this.client.url}/auth/v1/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'apikey': this.client.key
                        }
                    });
                } catch (logoutError) {
                    console.warn('Logout endpoint failed, proceeding with local cleanup:', logoutError);
                }
            }

            // Clear local session regardless of logout endpoint success
            this.clearSession();
            this.notifyListeners('SIGNED_OUT', null);

            return { error: null };
        } catch (error) {
            console.error('Sign out error:', error);
            // Still clear local session even if there's an error
            this.clearSession();
            this.notifyListeners('SIGNED_OUT', null);
            return { error };
        }
    }

    async getSession() {
        if (this.currentSession) {
            return { data: { session: this.currentSession }, error: null };
        }
        return { data: { session: null }, error: null };
    }

    async getUser() {
        if (this.currentUser) {
            return { data: { user: this.currentUser }, error: null };
        }
        return { data: { user: null }, error: null };
    }

    onAuthStateChange(callback) {
        this.listeners.push(callback);
        
        // Call immediately with current state
        if (this.currentSession) {
            callback('SIGNED_IN', this.currentSession);
        } else {
            callback('SIGNED_OUT', null);
        }

        return {
            data: {
                subscription: {
                    unsubscribe: () => {
                        const index = this.listeners.indexOf(callback);
                        if (index > -1) {
                            this.listeners.splice(index, 1);
                        }
                    }
                }
            }
        };
    }

    notifyListeners(event, session) {
        console.log('Auth state change:', event, session?.user?.email);
        this.listeners.forEach(callback => {
            try {
                callback(event, session);
            } catch (error) {
                console.error('Auth listener error:', error);
            }
        });
    }
}

class QueryBuilder {
    constructor(client, table) {
        this.client = client;
        this.table = table;
        this.query = {
            select: '*',
            filters: [],
            order: null,
            limit: null
        };
    }

    select(columns = '*') {
        this.query.select = columns;
        return this;
    }

    eq(column, value) {
        this.query.filters.push(`${column}=eq.${encodeURIComponent(value)}`);
        return this;
    }

    ilike(column, value) {
        this.query.filters.push(`${column}=ilike.${encodeURIComponent(value)}`);
        return this;
    }

    order(column, options = {}) {
        const direction = options.ascending === false ? 'desc' : 'asc';
        this.query.order = `${column}.${direction}`;
        return this;
    }

    limit(count) {
        this.query.limit = count;
        return this;
    }

    single() {
        this.query.single = true;
        return this;
    }

    async execute() {
        let path = `/${this.table}`;
        const params = new URLSearchParams();

        if (this.query.select !== '*') {
            params.append('select', this.query.select);
        }

        this.query.filters.forEach(filter => {
            const [key, value] = filter.split('=');
            params.append(key, value);
        });

        if (this.query.order) {
            params.append('order', this.query.order);
        }

        if (this.query.limit) {
            params.append('limit', this.query.limit);
        }

        const queryString = params.toString();
        if (queryString) {
            path += `?${queryString}`;
        }

        const result = await this.client.request('GET', path);
        
        if (this.query.single && result.data && Array.isArray(result.data)) {
            result.data = result.data[0] || null;
        }

        return result;
    }

    // Alias for execute to match Supabase API
    then(resolve, reject) {
        return this.execute().then(resolve, reject);
    }

    async insert(data) {
        const result = await this.client.request('POST', `/${this.table}`, data);
        return result;
    }

    async update(data) {
        let path = `/${this.table}`;
        const params = new URLSearchParams();

        this.query.filters.forEach(filter => {
            const [key, value] = filter.split('=');
            params.append(key, value);
        });

        const queryString = params.toString();
        if (queryString) {
            path += `?${queryString}`;
        }

        const result = await this.client.request('PATCH', path, data);
        return result;
    }

    async delete() {
        let path = `/${this.table}`;
        const params = new URLSearchParams();

        this.query.filters.forEach(filter => {
            const [key, value] = filter.split('=');
            params.append(key, value);
        });

        const queryString = params.toString();
        if (queryString) {
            path += `?${queryString}`;
        }

        const result = await this.client.request('DELETE', path);
        return result;
    }
}

// Create and export the Supabase client
const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Make it globally available
window.supabase = supabase;

console.log('🔌 Supabase client initialized');