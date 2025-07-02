import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User, LogOut, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Cart } from '@/components/Cart';
import { AuthModal } from '@/components/AuthModal';
import { ProfileModal } from '@/components/ProfileModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const { user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Fetch user profile for avatar
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', selectedCategory, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully.',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/9d3d417e-75ad-4e57-999f-fc0e4ca2def0.png" 
                alt="Blissful Cakes" 
                className="h-12 w-12 object-contain"
              />
              <nav className="hidden md:flex space-x-6">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-pink-600 font-medium"
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-pink-600 font-medium"
                >
                  About Us
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Cart />
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-pink-50 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={(userProfile as any)?.avatar_url} alt="Profile" />
                      <AvatarFallback>
                        {userProfile?.full_name ? userProfile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {userProfile?.full_name || user.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Animated Title */}
        <div className="text-center mb-12">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-fade-in opacity-0 animation-delay-500"></div>
            
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-fade-in opacity-0 animation-delay-200 mb-6">
              Welcome to Blissful Cakes
            </h1>
            
            {/* Animated underline */}
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full animate-scale-in opacity-0 animation-delay-700 mb-6"></div>
            
            <p className="text-lg md:text-xl text-gray-600 font-inter animate-fade-in opacity-0 animation-delay-1000 max-w-2xl mx-auto">
              Your premier destination for delicious and beautifully crafted cakes
            </p>

            {/* Floating decorative elements */}
            <div className="absolute top-0 left-1/4 w-3 h-3 bg-pink-300 rounded-full animate-float opacity-60 animation-delay-1500"></div>
            <div className="absolute top-8 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-float-delayed opacity-60 animation-delay-2000"></div>
            <div className="absolute -bottom-4 left-1/3 w-4 h-4 bg-pink-200 rounded-full animate-float opacity-40 animation-delay-2500"></div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for cakes, cupcakes, and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All Items
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4 animate-pulse"></div>
                <div className="bg-gray-200 h-4 rounded mb-2 animate-pulse"></div>
                <div className="bg-gray-200 h-3 rounded mb-2 animate-pulse"></div>
                <div className="bg-gray-200 h-6 rounded animate-pulse"></div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg animate-fade-in">No products found matching your criteria.</p>
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in opacity-0"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
};

export default Index;
