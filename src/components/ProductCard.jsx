
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
    console.log('Adding to cart:', product);
    setIsAdding(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      addToCart(product);
      setIsAdding(false);
      setJustAdded(true);
      
      // Reset the "just added" state after animation
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    }, 300);
  };

  if (!product) {
    return null;
  }

  return (
    <Card className="h-full flex flex-col group animate-fade-in hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg relative">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
            onError={(e) => {
              e.target.src = '/placeholder.svg';
            }}
          />
          {/* Animated overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Floating price badge */}
          <div className="absolute top-3 right-3 bg-pink-500 text-white px-2 py-1 rounded-full text-sm font-bold transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
            Rs {Math.round(product.price)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <CardTitle className="text-lg mb-2 group-hover:text-pink-600 transition-colors duration-200">
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-3 group-hover:text-gray-700 transition-colors duration-200">
          {product.description}
        </CardDescription>
        <div className="text-2xl font-bold text-pink-600 animate-pulse-subtle">
          Rs {Math.round(product.price)}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.is_available || isAdding}
          className={`
            w-full relative overflow-hidden group/btn
            transition-all duration-300 transform
            ${justAdded 
              ? 'bg-green-500 hover:bg-green-600 scale-105' 
              : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
            }
            ${isAdding ? 'animate-pulse scale-95' : 'hover:scale-105'}
            hover:shadow-2xl hover:shadow-pink-500/25
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            before:absolute before:inset-0 
            before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
            before:translate-x-[-100%] before:skew-x-12
            hover:before:translate-x-[100%] before:transition-transform before:duration-700
            active:scale-95 active:shadow-inner
          `}
        >
          {/* Ripple effect container */}
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <span className="absolute inset-0 bg-white/10 scale-0 rounded-full transition-transform duration-300 group-hover/btn:scale-150 group-active/btn:scale-100"></span>
          </span>
          
          {/* Button content */}
          <span className="relative flex items-center justify-center gap-2 z-10">
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 transition-transform duration-200 group-hover/btn:rotate-12 group-hover/btn:scale-110" />
                {product.is_available ? 'Add to Cart' : 'Out of Stock'}
              </>
            )}
          </span>
          
          {/* Animated border */}
          <span className="absolute inset-0 rounded-md border-2 border-transparent group-hover/btn:border-white/30 transition-colors duration-300"></span>
        </Button>
      </CardFooter>
    </Card>
  );
};
