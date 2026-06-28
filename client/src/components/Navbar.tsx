import { MenuIcon, XIcon, LogOut, Image, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const userInitial = user && user.name ? user.name.charAt(0).toUpperCase() : "U";
    const userName = user && user.name ? user.name : "User";
    const userEmail = user && user.email ? user.email : "";

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
        } catch (e) {
            console.error("Logout request failed", e);
        }
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        setTimeout(() => {
            window.location.href = "/";
        }, 800);
    };

    return (
        <>
            <motion.nav className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to='/'>
                    <img src="/logo.svg" alt="" className="h-8.5 w-auto" />
                </Link>

                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    <Link to='/' className="hover:text-pink-300 transition">Home</Link>
                    <Link to='/generate' className="hover:text-pink-300 transition">Generate</Link>
                    <Link to='/my-generation' className="hover:text-pink-300 transition">My Generations</Link>
                    <Link to='#' className="hover:text-pink-300 transition">My Contact</Link>
                </div>

                <div className="hidden md:flex items-center">
                    {isLoggedIn ? (
                        <div className="relative">
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center justify-center size-10 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold cursor-pointer border-2 border-white/10 hover:border-white/30 transition-all select-none"
                            >
                                {userInitial}
                            </button>
                            
                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                                    <motion.div 
                                        className="absolute right-0 mt-3 w-56 rounded-xl bg-neutral-900/95 border border-white/10 text-zinc-200 py-2 shadow-2xl z-50 backdrop-blur-md"
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <div className="px-4 py-2.5 border-b border-white/10">
                                            <p className="text-sm font-semibold text-white truncate">{userName}</p>
                                            <p className="text-xs text-zinc-400 truncate">{userEmail}</p>
                                        </div>
                                        <div className="p-1">
                                            <button 
                                                onClick={() => { navigate("/generate"); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition text-left"
                                            >
                                                <Sparkles size={16} className="text-pink-500" />
                                                Generate
                                            </button>
                                            <button 
                                                onClick={() => { navigate("/my-generation"); setIsDropdownOpen(false); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition text-left"
                                            >
                                                <Image size={16} className="text-indigo-400" />
                                                My Generations
                                            </button>
                                            <hr className="my-1 border-white/10" />
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition text-left"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full">
                            Get Started
                        </button>
                    )}
                </div>

                <button onClick={() => setIsOpen(true)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </motion.nav>

            <div className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Link onClick={() => setIsOpen(false)} to='/' className="hover:text-pink-300 transition">Home</Link>
                <Link onClick={() => setIsOpen(false)} to='/generate' className="hover:text-pink-300 transition">Generate</Link>
                <Link onClick={() => setIsOpen(false)} to='/my-generation' className="hover:text-pink-300 transition">My Generations</Link>
                <Link onClick={() => setIsOpen(false)} to='#' className="hover:text-pink-300 transition">My Contact</Link>
                {isLoggedIn ? (
                    <button 
                        onClick={() => { setIsOpen(false); handleLogout(); }} 
                        className="hover:text-red-400 text-red-500 transition font-medium"
                    >
                        Logout
                    </button>
                ) : (
                    <Link onClick={() => setIsOpen(false)} to='/login' className="hover:text-pink-300 transition">Login</Link>
                )}
                <button onClick={() => setIsOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}