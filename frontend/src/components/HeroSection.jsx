import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from './Button';

const HeroSection = () => {
  return (
    <div className="relative bg-earth-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-earth-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-10 sm:pt-16 lg:pt-20">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Fresh From the Farm.</span>{' '}
                <span className="block text-primary-600 xl:inline">Directly To Your Home.</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Discover fresh produce directly from verified farmers. No unnecessary middlemen. Transparent pricing. Trusted sellers.
              </p>
              
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4 text-sm text-gray-600 font-medium">
                <div className="flex items-center">
                  <CheckCircle2 size={18} className="text-primary-500 mr-2" />
                  Verified Farmers
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={18} className="text-primary-500 mr-2" />
                  Transparent Pricing
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={18} className="text-primary-500 mr-2" />
                  Direct Connection
                </div>
              </div>

              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                <Link to="/explore">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
                    Explore Products
                    <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link to="/farmers">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Meet Our Farmers
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1000"
          alt="Farmer in field with fresh produce"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-50 to-transparent lg:hidden"></div>
      </div>
    </div>
  );
};

export default HeroSection;
