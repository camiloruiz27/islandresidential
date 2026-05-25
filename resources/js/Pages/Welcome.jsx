import { Link, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome(props) {
    const [scrolled, setScrolled] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 20 - 10,
                y: (e.clientY / window.innerHeight) * 20 - 10
            });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="min-h-screen bg-brand-white text-brand-black selection:bg-brand-black selection:text-brand-white font-sans overflow-hidden">
            <Head title="Welcome to Island Residential" />

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? 'bg-brand-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link href="/" className="animate-fade-in">
                        <img src="/images/media__1779672706531.png" alt="Island Residential" className="h-16 md:h-20 w-auto object-contain" />
                    </Link>
                    <div className="hidden md:flex space-x-10 text-xs font-bold tracking-[0.2em] animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <Link href={route('properties.index')} className="relative group overflow-hidden py-1">
                            <span>PROPERTIES</span>
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-full"></span>
                        </Link>
                        <Link href={route('forms.rental')} className="relative group overflow-hidden py-1">
                            <span>APPLY</span>
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-full"></span>
                        </Link>
                        <Link href={route('forms.maintenance')} className="relative group overflow-hidden py-1">
                            <span>MAINTENANCE</span>
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-full"></span>
                        </Link>
                        {props.auth.user ? (
                            <Link href={route('admin.dashboard')} className="hover:opacity-70 transition-opacity">ADMIN</Link>
                        ) : (
                            <Link href={route('login')} className="hover:opacity-70 transition-opacity">LOGIN</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black text-brand-white">
                <div 
                    className="absolute inset-0 opacity-50 animate-scale-up"
                    style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`, transition: 'transform 0.1s ease-out' }}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                        alt="Premium Apartment" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
                    <div className="overflow-hidden mb-6">
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[1.1] animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                            Apartments for rent
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-12">
                        <h2 className="text-2xl md:text-4xl font-light tracking-tight text-brand-light animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                            as seen on the Cape Breton University<br/>off campus housing
                        </h2>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                        <Link 
                            href={route('properties.index')} 
                            className="group relative px-10 py-5 bg-brand-white text-brand-black font-bold uppercase tracking-[0.2em] text-xs overflow-hidden rounded-full shadow-lg"
                        >
                            <span className="relative z-10 group-hover:text-brand-white transition-colors duration-500">Discover Properties</span>
                            <div className="absolute inset-0 bg-brand-black transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 rounded-full"></div>
                        </Link>
                        <Link 
                            href={route('forms.rental')} 
                            className="group relative px-10 py-5 bg-brand-black/90 backdrop-blur-sm text-brand-white font-bold uppercase tracking-[0.2em] text-xs overflow-hidden rounded-full shadow-lg border border-brand-black/90"
                        >
                            <span className="relative z-10 group-hover:text-brand-black transition-colors duration-500">Apply Now</span>
                            <div className="absolute inset-0 bg-brand-white transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 rounded-full"></div>
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-fade-in-up opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
                    <div className="w-[2px] h-24 bg-brand-white/20 relative overflow-hidden rounded-full">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-white animate-[slideDown_2s_infinite] rounded-full"></div>
                    </div>
                </div>
            </header>

            {/* Elevated Design Section */}
            <section className="py-40 px-6 md:px-12 max-w-[1400px] mx-auto bg-brand-white relative">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative animate-fade-in-up">
                        <div className="overflow-hidden animate-reveal rounded-[2.5rem] shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Minimalist Interior" className="w-full h-[700px] object-cover hover:scale-105 transition-transform duration-1000" />
                        </div>
                        <div className="absolute -bottom-10 -right-10 bg-brand-black text-brand-white p-12 max-w-sm shadow-2xl rounded-3xl animate-slide-in-right opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                            <p className="font-bold tracking-widest uppercase text-xs mb-4 text-brand-light">The Standard</p>
                            <h3 className="text-3xl font-light leading-snug">Curated spaces for modern living in Nova Scotia.</h3>
                        </div>
                    </div>
                    <div className="lg:pl-16">
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>Elevating Property<br/>Standards.</h2>
                        <div className="w-12 h-[3px] bg-brand-black mb-8 rounded-full animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}></div>
                        <p className="text-xl text-brand-gray font-light leading-relaxed mb-12 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                            At Island Residential, we believe in a minimalist, professional, and transparent approach to property management. Experience high-end living near Cape Breton University and beyond.
                        </p>
                        <Link href={route('properties.index')} className="group inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 bg-brand-light rounded-full hover:bg-brand-gray hover:text-brand-white transition-all duration-300 animate-fade-in-up opacity-0 shadow-sm" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                            Explore Our Portfolio 
                            <span className="ml-4 transform transition-transform duration-300 group-hover:translate-x-2">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-brand-black text-brand-white py-32 px-6 md:px-12 rounded-t-[3rem]">
                <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-16 border-t border-brand-white/10 pt-16">
                    <div className="md:col-span-2">
                        <div className="text-4xl font-bold tracking-tighter mb-6">ISLAND <span className="font-light">RESIDENTIAL</span></div>
                        <p className="text-brand-light font-light text-lg max-w-sm">Setting the benchmark for premium property services in Nova Scotia, Canada.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-8 uppercase tracking-[0.2em] text-xs text-gray-400">Navigation</h4>
                        <ul className="space-y-4 text-sm font-light tracking-wide">
                            <li><Link href={route('properties.index')} className="hover:text-brand-white text-gray-300 transition-colors">Properties</Link></li>
                            <li><Link href={route('forms.rental')} className="hover:text-brand-white text-gray-300 transition-colors">Apply Now</Link></li>
                            <li><Link href={route('forms.maintenance')} className="hover:text-brand-white text-gray-300 transition-colors">Maintenance</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-8 uppercase tracking-[0.2em] text-xs text-gray-400">Contact</h4>
                        <ul className="space-y-4 text-sm font-light tracking-wide text-gray-300">
                            <li className="hover:text-white transition-colors cursor-pointer">info@islandresidential.ca</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Nova Scotia, Canada</li>
                        </ul>
                    </div>
                </div>
            </footer>
            
            <style>{`
                @keyframes slideDown {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }
            `}</style>
        </div>
    );
}
