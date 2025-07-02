import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { CheckoutModal } from './CheckoutModal';

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="relative group overflow-hidden bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-pink-200 hover:border-pink-300 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            
            <ShoppingCart className="w-4 h-4 text-pink-600 group-hover:text-pink-700 transition-colors duration-200 group-hover:animate-bounce" />
            
            {totalItems > 0 && (
              <>
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-white animate-pulse shadow-lg">
                  {totalItems}
                </Badge>
                {/* Ripple effect */}
                <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-pink-400 animate-ping opacity-30"></div>
              </>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] bg-gradient-to-br from-white to-pink-50/30">
          <SheetHeader className="border-b border-pink-100 pb-4">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
              Shopping Cart ({totalItems} items)
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="relative mb-6">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 animate-float" />
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-pink-200 rounded-full animate-float-delayed opacity-60"></div>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-400 text-sm">Add some delicious cakes to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="group flex items-center space-x-4 p-4 border border-pink-100 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={item.image_url || '/placeholder.svg'}
                          alt={item.name}
                          className="w-16 h-16 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 group-hover:text-pink-700 transition-colors duration-200">{item.name}</h3>
                        <p className="text-sm text-pink-600 font-semibold">Rs {Math.round(item.price)}</p>
                        
                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 border-pink-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 hover:scale-110"
                          >
                            <Minus className="w-3 h-3 text-pink-600" />
                          </Button>
                          
                          <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-sm font-semibold text-pink-700 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 border-pink-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 hover:scale-110"
                          >
                            <Plus className="w-3 h-3 text-pink-600" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                          Rs {Math.round(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {items.length > 0 && (
              <div className="border-t border-pink-100 pt-4 space-y-4 bg-gradient-to-r from-pink-50/50 to-purple-50/50 rounded-t-xl p-4 -mx-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total:</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent animate-pulse-subtle">
                      Rs {Math.round(totalPrice)}
                    </div>
                    <div className="text-xs text-gray-500">Including all items</div>
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </>
  );
};