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
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return { data, error: null };
        } catch (error) {
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
        
        // Check for existing session
        this.getSession();
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
                throw new Error(data.msg || data.message || 'Sign up failed');
            }

            return { data, error: null };
        } catch (error) {
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
                throw new Error(data.msg || data.message || 'Sign in failed');
            }

            // Store session
            if (data.access_token) {
                localStorage.setItem('supabase_token', data.access_token);
                localStorage.setItem('supabase_user', JSON.stringify(data.user));
                this.currentUser = data.user;
                this.currentSession = data;
                this.notifyListeners('SIGNED_IN', data);
            }

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async signOut() {
        try {
            const token = localStorage.getItem('supabase_token');
            if (token) {
                await fetch(`${this.client.url}/auth/v1/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'apikey': this.client.key
                    }
                });
            }

            localStorage.removeItem('supabase_token');
            localStorage.removeItem('supabase_user');
            this.currentUser = null;
            this.currentSession = null;
            this.notifyListeners('SIGNED_OUT', null);

            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    async getSession() {
        const token = localStorage.getItem('supabase_token');
        const userStr = localStorage.getItem('supabase_user');

        if (token && userStr) {
            try {
                this.currentUser = JSON.parse(userStr);
                this.currentSession = { access_token: token, user: this.currentUser };
                return { data: { session: this.currentSession }, error: null };
            } catch (error) {
                localStorage.removeItem('supabase_token');
                localStorage.removeItem('supabase_user');
            }
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
        this.listeners.forEach(callback => callback(event, session));
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