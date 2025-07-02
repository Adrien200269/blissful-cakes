
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  is_available: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Card className="h-full flex flex-col group animate-fade-in hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg relative">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
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
          disabled={!product.is_available}
          className="w-full bg-pink-500 hover:bg-pink-600 transform hover:scale-105 transition-all duration-200 hover:shadow-lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2 animate-bounce-subtle" />
          {product.is_available ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};
