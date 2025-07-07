// Supabase query helpers
class SupabaseQueries {
    constructor() {
        this.client = window.supabase;
    }

    // Products queries
    async getProducts(filters = {}) {
        try {
            let query = this.client
                .from('products')
                .select('*')
                .eq('is_available', true)
                .order('name');

            if (filters.category) {
                query = query.eq('category_id', filters.category);
            }

            if (filters.search) {
                query = query.ilike('name', `%${filters.search}%`);
            }

            if (filters.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;
            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async getProduct(id) {
        try {
            const { data, error } = await this.client
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    // Categories queries
    async getCategories() {
        try {
            const { data, error } = await this.client
                .from('categories')
                .select('*')
                .order('name');

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async getCategory(id) {
        try {
            const { data, error } = await this.client
                .from('categories')
                .select('*')
                .eq('id', id)
                .single();

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    // Orders queries
    async createOrder(orderData) {
        try {
            const { data, error } = await this.client
                .from('orders')
                .insert(orderData)
                .select()
                .single();

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async createOrderItems(orderItems) {
        try {
            const { data, error } = await this.client
                .from('order_items')
                .insert(orderItems);

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async getUserOrders(userId) {
        try {
            const { data, error } = await this.client
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        products (*)
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async getOrder(id) {
        try {
            const { data, error } = await this.client
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        products (*)
                    )
                `)
                .eq('id', id)
                .single();

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    // Profile queries
    async getProfile(userId) {
        try {
            const { data, error } = await this.client
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async updateProfile(userId, updates) {
        try {
            const { data, error } = await this.client
                .from('profiles')
                .upsert({
                    id: userId,
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async createProfile(profileData) {
        try {
            const { data, error } = await this.client
                .from('profiles')
                .insert(profileData)
                .select()
                .single();

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    // Real-time subscriptions
    subscribeToProducts(callback) {
        return this.client
            .channel('products')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'products' }, 
                callback
            )
            .subscribe();
    }

    subscribeToOrders(userId, callback) {
        return this.client
            .channel('orders')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'orders',
                    filter: `user_id=eq.${userId}`
                }, 
                callback
            )
            .subscribe();
    }

    // Utility methods
    async executeQuery(queryFn) {
        try {
            const result = await queryFn();
            return result;
        } catch (error) {
            console.error('Query execution error:', error);
            return { data: null, error };
        }
    }

    // Batch operations
    async batchInsert(table, records) {
        try {
            const { data, error } = await this.client
                .from(table)
                .insert(records);

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async batchUpdate(table, updates, filters) {
        try {
            let query = this.client.from(table);
            
            // Apply filters
            Object.entries(filters).forEach(([key, value]) => {
                query = query.eq(key, value);
            });

            const { data, error } = await query.update(updates);
            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    async batchDelete(table, filters) {
        try {
            let query = this.client.from(table);
            
            // Apply filters
            Object.entries(filters).forEach(([key, value]) => {
                query = query.eq(key, value);
            });

            const { data, error } = await query.delete();
            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }
}

// Create global queries instance
window.supabaseQueries = new SupabaseQueries();