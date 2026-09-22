import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Sprout, ArrowRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SectionHeading from '../components/SectionHeading';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import FarmerCard from '../components/FarmerCard';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';
import { categories } from '../data/mockData';

const Home = () => {
  const { products, farmers } = useAppContext();
  const featuredProducts = products.slice(0, 4);
  const featuredFarmers = farmers.slice(0, 3);

  return (
    <div>
      <HeroSection />

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Explore Fresh Produce" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <SectionHeading title="Fresh From Our Farmers" />
            <Link to="/explore" className="hidden sm:block">
              <Button variant="ghost" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                View All Products <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/explore">
              <Button variant="outline" fullWidth>
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="How Farm2Home Works" 
            subtitle="A simple, transparent process to get fresh food directly from the source."
            centered
          />
          
          <div className="relative mt-16">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-primary-200 z-0">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-400"></div>
              <div className="absolute left-[33.33%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-400"></div>
              <div className="absolute left-[66.66%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-400"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-400"></div>
            </div>
            
            {/* Connecting line for mobile */}
            <div className="lg:hidden absolute top-8 bottom-8 left-1/2 w-0.5 bg-primary-200 -translate-x-1/2 z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
              {[
                { step: '01', title: 'Farmer Lists Product', icon: Sprout, desc: 'Verified farmers add their fresh produce to our platform.' },
                { step: '02', title: 'Customer Discovers', icon: SearchIcon, desc: 'Browse and find fresh food from farmers near you.' },
                { step: '03', title: 'Place Order', icon: ShoppingCartIcon, desc: 'Order directly with transparent pricing and no hidden fees.' },
                { step: '04', title: 'Direct Delivery', icon: Truck, desc: 'Get fresh produce delivered straight to your home.' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center relative">
                  <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-6 shadow-sm border-4 border-white relative z-10">
                    <item.icon size={28} />
                  </div>
                  <div className="bg-white relative z-10 w-full px-2">
                    <div className="text-primary-600 font-bold text-sm tracking-wider mb-2">STEP {item.step}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Farmers Section */}
      <section className="py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Meet the Farmers Behind Your Food" 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {featuredFarmers.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-900 rounded-3xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Know Where Your Food Comes From
                </h2>
                <div className="space-y-6">
                  {[
                    { title: 'Verified farmer identities', desc: 'Every farmer is physically and digitally verified before joining.' },
                    { title: 'Transparent pricing', desc: 'See exactly how much the farmer earns from your purchase.' },
                    { title: 'Product traceability', desc: 'Track your food from the specific farm right to your doorstep.' }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <ShieldCheck className="h-6 w-6 text-primary-400" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-bold text-white">{feature.title}</h4>
                        <p className="mt-1 text-primary-100">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-64 lg:h-auto hidden lg:block">
                <img 
                  src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800" 
                  alt="Farmer holding fresh produce" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Farm2Home (3 Columns) */}
      <section className="py-20 bg-earth-50 border-t border-earth-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Why Farm2Home?" centered />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-primary-700 mb-6 border-b border-gray-100 pb-4">FOR FARMERS</h3>
              <ul className="space-y-4">
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Direct market access</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Better earning potential</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Transparent selling</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Direct customer connection</span></li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-primary-700 mb-6 border-b border-gray-100 pb-4">FOR CUSTOMERS</h3>
              <ul className="space-y-4">
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Fresh produce</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Transparent pricing</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Verified sellers</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Shorter supply chain</span></li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-primary-700 mb-6 border-b border-gray-100 pb-4">FOR COMMUNITY</h3>
              <ul className="space-y-4">
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Supports local farmers</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Reduces unnecessary intermediaries</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Encourages digital agriculture</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5"/> <span>Sustainable ecosystem</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary-600 text-center relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-white mb-6">Support Farmers. Eat Fresh.</h2>
          <p className="text-xl text-primary-100 mb-10">
            Buy directly from farmers and bring fresh produce to your home today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/explore">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary-700 hover:bg-gray-50 border border-transparent">
                Explore Products
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-primary-700 hover:text-white">
                Join as a Farmer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Quick helper icons for "How it works"
const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const ShoppingCartIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);
const CheckCircle2 = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);

export default Home;
