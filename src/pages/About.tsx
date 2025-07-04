
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 animate-gradient">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 rounded-lg p-8 shadow-lg animate-scale-in backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Text Content */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-fade-in animation-delay-200 font-playfair">
                About Us
              </h1>
              
              <div className="text-gray-700 space-y-4 leading-relaxed">
                <p className="animate-fade-in animation-delay-300 hover:text-gray-900 transition-colors duration-300">
                  Welcome to Blissful Cakes Pokhara, your premier destination for 
                  delicious and beautifully crafted cakes in the heart of Pokhara! 
                  Established with a deep passion for baking and creativity, we take pride 
                  in offering a wide variety of delectable treats tailored to suit every 
                  occasion. From intricately designed custom cakes and delightful 
                  cupcakes to unique berrie cakes and elegant wine-themed desserts.
                </p>

                <p className="animate-fade-in animation-delay-500 hover:text-gray-900 transition-colors duration-300">
                  Our bakery is dedicated to turning your special moments into 
                  unforgettable memories. Each cake is baked with the finest ingredients, 
                  authentic recipes, and genuine love and attention that will impress 
                  your guests.
                </p>

                <p className="animate-fade-in animation-delay-700 hover:text-gray-900 transition-colors duration-300">
                  Located conveniently in Pokhara, we are committed to serving our 
                  community with love and dedication. Whether you're celebrating a 
                  birthday, anniversary, or other milestone, our skilled bakers are here 
                  to bring your vision to life. You can reach us at 9815095078 or 
                  9805053518 for orders and inquiries, or visit our online cake shop 
                  for a seamless shopping experience. Stay connected with us on 
                  Instagram @blissfulcakes_pokhara and on Facebook. Or, lly, where we 
                  regularly share the latest updates, behind-the-scenes moments, and 
                  special promotions for our valued customers. Come join the Blissful 
                  experience at Blissful Cakes Pokhara, and let us make your next 
                  celebration today!
                </p>

                <div className="mt-8 animate-fade-in animation-delay-1000">
                  <h3 className="text-xl font-semibold mb-4 font-playfair animate-pulse-subtle">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <p className="hover:text-pink-600 transition-colors duration-300 cursor-pointer animate-fade-in animation-delay-1500">
                      <strong>Phone:</strong> 9815095078 / 9805053518
                    </p>
                    <p className="hover:text-pink-600 transition-colors duration-300 cursor-pointer animate-fade-in animation-delay-1500">
                      <strong>Instagram:</strong> @blissfulcakes_pokhara
                    </p>
                    <p className="hover:text-pink-600 transition-colors duration-300 cursor-pointer animate-fade-in animation-delay-2000">
                      <strong>Location:</strong> Pokhara, Nepal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 animate-fade-in animation-delay-300">
              <img 
                src="/lovable-uploads/9d3d417e-75ad-4e57-999f-fc0e4ca2def0.png" 
                alt="Blissful Cakes Logo" 
                className="w-64 h-64 object-contain animate-float hover:animate-float-delayed transition-all duration-500 hover:scale-110 drop-shadow-lg hover:drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
