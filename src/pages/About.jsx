
import { motion } from 'framer-motion';
import { Heart, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Heart, label: 'Happy Customers', value: '10,000+' },
    { icon: Users, label: 'Team Members', value: '50+' },
    { icon: Award, label: 'Years Experience', value: '15+' },
    { icon: Globe, label: 'Countries Served', value: '25+' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse-gentle animation-delay-1000"></div>
        <div className="absolute top-40 -right-32 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-bounce-gentle animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl animate-pulse-subtle animation-delay-1500"></div>
      </div>

      <motion.div 
        className="container mx-auto px-4 py-16 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div className="text-center mb-20" variants={itemVariants}>
          <motion.div 
            className="mb-8 flex justify-center"
            variants={floatingVariants}
            animate="animate"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl animate-logo-glow">
                <Heart className="w-16 h-16 text-white animate-pulse" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-20 animate-pulse"></div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="font-playfair text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient leading-tight"
            variants={itemVariants}
          >
            About Our Story
          </motion.h1>
          
          <motion.p 
            className="font-inter text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            We're passionate creators dedicated to bringing you extraordinary experiences 
            through innovative design and heartfelt craftsmanship.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.1,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <div className="relative mb-4 flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-6">
                  <stat.icon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="font-playfair text-3xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="font-inter text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="grid md:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/placeholder.svg"
                  alt="Our team"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce-subtle">
                <Award className="w-12 h-12 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div className="space-y-8" variants={itemVariants}>
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Crafting Dreams Into{' '}
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Reality
                </span>
              </h2>
              
              <div className="space-y-6 font-inter text-lg text-gray-700 leading-relaxed">
                <p className="hover:text-gray-900 transition-colors duration-300 cursor-default">
                  Since our founding, we've been on a mission to transform ordinary moments 
                  into extraordinary memories. Our journey began with a simple belief: that 
                  everyone deserves access to beauty, quality, and innovation.
                </p>
                
                <p className="hover:text-gray-900 transition-colors duration-300 cursor-default">
                  Today, we're proud to serve customers worldwide, combining traditional 
                  craftsmanship with cutting-edge technology to deliver products that not 
                  only meet your needs but exceed your wildest expectations.
                </p>
                
                <p className="hover:text-gray-900 transition-colors duration-300 cursor-default">
                  Every product we create, every service we provide, and every interaction 
                  we have is guided by our core values of integrity, excellence, and 
                  genuine care for our community.
                </p>
              </div>
            </div>

            <motion.div 
              className="flex flex-wrap gap-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                Learn More
              </div>
              <div className="border-2 border-pink-500 text-pink-600 px-8 py-4 rounded-full font-medium hover:bg-pink-500 hover:text-white transition-all duration-300 cursor-pointer hover:scale-105">
                Get in Touch
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
