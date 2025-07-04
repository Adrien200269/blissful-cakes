
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Star, MapPin, Phone, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-40 animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-pink-300 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-purple-300 rounded-full opacity-30 animate-float"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link to="/">
            <Button variant="ghost" className="text-gray-700 hover:bg-white/30 hover:text-pink-600 transition-all duration-300 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 space-y-8">
              {/* Animated Title */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-4 animate-fade-in">
                  <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
                  <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                  <Heart className="w-8 h-8 text-purple-500 animate-pulse animation-delay-500" />
                </div>
                
                <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6 animate-fade-in animation-delay-200">
                  About Us
                </h1>
                
                <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto lg:mx-0 rounded-full animate-scale-in animation-delay-500"></div>
              </div>

              {/* Content with staggered animations */}
              <div className="text-gray-700 space-y-6 leading-relaxed font-inter">
                <p className="text-lg animate-fade-in animation-delay-700 hover:text-gray-800 transition-colors duration-300">
                  Welcome to <span className="font-bold text-pink-600">Blissful Cakes Pokhara</span>, your premier destination for 
                  delicious and beautifully crafted cakes in the heart of Pokhara! 
                  Established with a deep passion for baking and creativity, we take pride 
                  in offering a wide variety of delectable treats tailored to suit every 
                  occasion.
                </p>

                <p className="text-lg animate-fade-in animation-delay-1000 hover:text-gray-800 transition-colors duration-300">
                  From intricately designed custom cakes and delightful 
                  cupcakes to unique berry cakes and elegant wine-themed desserts, 
                  our bakery is dedicated to turning your special moments into 
                  unforgettable memories. Each cake is baked with the finest ingredients, 
                  authentic recipes, and genuine love.
                </p>

                <p className="text-lg animate-fade-in animation-delay-1500 hover:text-gray-800 transition-colors duration-300">
                  Located conveniently in Pokhara, we are committed to serving our 
                  community with love and dedication. Whether you're celebrating a 
                  birthday, anniversary, or other milestone, our skilled bakers are here 
                  to bring your vision to life.
                </p>

                {/* Contact Information with Icons */}
                <div className="mt-12 animate-fade-in animation-delay-2000">
                  <h3 className="text-2xl font-playfair font-semibold mb-6 text-gray-800 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
                    Get in Touch
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <Phone className="w-6 h-6 text-pink-500 animate-bounce-subtle" />
                      <div>
                        <p className="font-semibold text-gray-800">Phone</p>
                        <p className="text-gray-600">9815095078 / 9805053518</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <Instagram className="w-6 h-6 text-purple-500 animate-bounce-subtle animation-delay-200" />
                      <div>
                        <p className="font-semibold text-gray-800">Instagram</p>
                        <p className="text-gray-600">@blissfulcakes_pokhara</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 md:col-span-2">
                      <MapPin className="w-6 h-6 text-green-500 animate-bounce-subtle animation-delay-500" />
                      <div>
                        <p className="font-semibold text-gray-800">Location</p>
                        <p className="text-gray-600">Pokhara, Nepal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Logo */}
            <div className="flex-shrink-0 animate-fade-in animation-delay-300">
              <div className="relative group">
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-gentle"></div>
                
                {/* Logo container */}
                <div className="relative bg-white rounded-full p-8 shadow-2xl border-4 border-white/50 hover:border-pink-200 transition-all duration-500 hover:shadow-3xl group-hover:scale-110">
                  <img 
                    src="/lovable-uploads/9d3d417e-75ad-4e57-999f-fc0e4ca2def0.png" 
                    alt="Blissful Cakes Logo" 
                    className="w-48 h-48 md:w-64 md:h-64 object-contain animate-float group-hover:animate-bounce-gentle transition-all duration-500"
                  />
                  
                  {/* Sparkle effects */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute bottom-8 left-8 w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-1000 opacity-60"></div>
                  <div className="absolute top-1/2 left-4 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-1500 opacity-70"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative section */}
        <div className="mt-16 text-center animate-fade-in animation-delay-2500">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Heart className="w-6 h-6 text-white animate-pulse" />
            <span className="text-white font-playfair text-xl font-semibold">
              Making Your Celebrations Blissful
            </span>
            <Heart className="w-6 h-6 text-white animate-pulse animation-delay-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
