import { Route, Routes, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import YtPreview from "./pages/YtPreview";
import Login from "./components/Login";
import { useEffect } from "react";

export default function App() {

    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                return;
            }
        }
        window.scrollTo(0, 0);
    }, [location.pathname, location.hash]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentStatus = params.get('payment');
        if (paymentStatus === 'success') {
            toast.success('Payment successful! Your credits have been updated.');
            const newSearch = new URLSearchParams(location.search);
            newSearch.delete('payment');
            const newSearchString = newSearch.toString();
            const newPath = location.pathname + (newSearchString ? `?${newSearchString}` : '');
            window.history.replaceState({}, document.title, newPath);
        } else if (paymentStatus === 'cancelled') {
            toast.error('Payment cancelled.');
            const newSearch = new URLSearchParams(location.search);
            newSearch.delete('payment');
            const newSearchString = newSearch.toString();
            const newPath = location.pathname + (newSearchString ? `?${newSearchString}` : '');
            window.history.replaceState({}, document.title, newPath);
        }
    }, [location.search, location.pathname]);

    return (
        <>
            <Toaster position="top-center" />
            <LenisScroll />
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/generate/:id" element={<Generate />} />
                <Route path="/my-generation" element={<MyGeneration />} />
                <Route path="/preview" element={<YtPreview />} />
                <Route path="/login" element={<Login />} />
            </Routes>
            <Footer />
        </>
    );
}