import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import HowItWorks from "../components/Home/HowItWorks";
import Testimonials from "../components/Home/Testimonials";
import Pricing from "../components/Home/Pricing";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";
import { useContext } from "react";
import {AppContext} from "../context/AppContext"
export default function Landing() {
    const {userData} = useContext(AppContext)
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Navbar user={userData} />
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <Pricing />
            <CTA />
            <Footer />
        </div>
    );
}

