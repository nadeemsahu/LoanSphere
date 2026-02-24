import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import DashboardPreview from './components/DashboardPreview';
import About from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './styles/Home.css';

const Homepage = () => {
    return (
        <main className="homepage-container" id="main-content">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <DashboardPreview />
            <About />
            <div id="legal">
                <PrivacyPolicy />
                <Terms />
            </div>
            <Contact />
            <Footer />
        </main>
    );
};

export default Homepage;
