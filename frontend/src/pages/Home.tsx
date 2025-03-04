import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhySaveSection from '@/components/SaveFoodData';
import DonationForm from '@/components/DonationForm';
import Footer from '@/components/Footer';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow mt-16">
        <HeroSection />
        <WhySaveSection />
        <DonationForm />
      </main>
      <Footer />
    </div>
  );
};

export default Home;