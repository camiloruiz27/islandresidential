import { Link, Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Welcome(props) {
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        terms_agreed: false
    });

    const submitContact = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => reset(),
        });
    };
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isSectionVisible, setIsSectionVisible] = useState(false);
    const [isOffersVisible, setIsOffersVisible] = useState(false);
    const [isContactVisible, setIsContactVisible] = useState(false);
    const sectionRef = useRef(null);
    const offersRef = useRef(null);
    const contactRef = useRef(null);

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

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsSectionVisible(true);
                    observer.disconnect(); // Animate only once
                }
            },
            { threshold: 0.2 } // Trigger when 20% of section is visible
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        const offersObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsOffersVisible(true);
                    offersObserver.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (offersRef.current) {
            offersObserver.observe(offersRef.current);
        }

        const contactObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsContactVisible(true);
                    contactObserver.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (contactRef.current) {
            contactObserver.observe(contactRef.current);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            if (sectionRef.current) observer.unobserve(sectionRef.current);
            if (offersRef.current) offersObserver.unobserve(offersRef.current);
            if (contactRef.current) contactObserver.unobserve(contactRef.current);
        };
    }, []);

    return (
        <div className="min-h-screen bg-brand-white text-brand-black selection:bg-brand-black selection:text-brand-white font-sans overflow-hidden">
            <Head title="Welcome to Island Residential" />

            {/* Navbar */}
            <nav className={`fixed w-full z-[60] transition-all duration-700 ${scrolled ? 'bg-brand-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link href="/" className="animate-fade-in">
                        <img src="/images/media__1779672706531.png" alt="Island Residential" className="h-16 md:h-20 w-auto object-contain" />
                    </Link>
                    <div className="hidden md:flex space-x-10 text-xs font-bold tracking-[0.2em] animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <Link href={route('properties.index')} className="relative group overflow-hidden py-1">
                            <span>APARTMENTS</span>
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
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 z-[60] relative"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <span className={`block w-6 h-[2px] bg-brand-black transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px] bg-brand-black' : 'bg-brand-black'}`}></span>
                        <span className={`block w-6 h-[2px] bg-brand-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-[2px] bg-brand-black transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px] bg-brand-black' : 'bg-brand-black'}`}></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[55] bg-brand-white/95 backdrop-blur-xl transition-all duration-500 flex flex-col justify-center items-center md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="flex flex-col space-y-10 text-center text-lg font-bold tracking-[0.2em] uppercase">
                    <Link href={route('properties.index')} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500 transition-colors">APARTMENTS</Link>
                    <Link href={route('forms.rental')} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500 transition-colors">APPLY</Link>
                    <Link href={route('forms.maintenance')} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500 transition-colors">MAINTENANCE</Link>
                    <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500 transition-colors">CONTACT US</a>
                </div>
            </div>

            {/* Hero Section */}
            <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black text-brand-white">
                <div
                    className="absolute inset-0 opacity-50 animate-scale-up"
                    style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`, transition: 'transform 0.1s ease-out' }}
                >
                    <img
                        src="/images/island-residential-apartments-cape-breton-coastal-view.jpg"
                        alt="Scenic coastal ocean view in Cape Breton, near Island Residential apartments in Nova Scotia"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
                    <div className="overflow-hidden mb-6">
                        <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter leading-[1.1] animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                            Apartments for Rent in Sydney, NS & Cape Breton
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-12">
                        <h2 className="text-2xl md:text-4xl font-light tracking-tight text-brand-light animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                            Professional property management in Sydney, <br /> NS & Cape Breton offering apartments for rent
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                        <Link
                            href={route('properties.index')}
                            className="group relative px-10 py-5 bg-brand-white text-brand-black font-bold uppercase tracking-[0.2em] text-xs overflow-hidden rounded-full shadow-lg"
                        >
                            <span className="relative z-10 group-hover:text-brand-white transition-colors duration-500">Available Apartments</span>
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
            <section ref={sectionRef} className="py-40 px-6 md:px-12 max-w-[1400px] mx-auto bg-brand-white relative">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <div className={`overflow-hidden rounded-[2.5rem] shadow-2xl ${isSectionVisible ? 'animate-reveal' : 'opacity-0'}`}>
                            <img src="/images/apartments-for-rent-sydney-ns-cape-breton-big-fiddle.jpg" alt="The Big Fiddle in Sydney Nova Scotia, representing the local culture near Island Residential apartments for rent in Cape Breton" className="w-full h-[700px] object-cover hover:scale-105 transition-transform duration-1000" />
                        </div>
                        <div className={`absolute -bottom-10 -right-10 bg-brand-black text-brand-white p-12 max-w-sm shadow-2xl rounded-3xl opacity-0 ${isSectionVisible ? 'animate-slide-in-right' : ''}`} style={isSectionVisible ? { animationDelay: '0.5s', animationFillMode: 'forwards' } : {}}>
                            <p className="font-bold tracking-widest uppercase text-xs mb-4 text-brand-light">Apartments in </p>
                            <h5 className="text-3xl font-light leading-snug">
                                Sydney<br />
                                New Waterford<br />
                                Sydney Mines<br />
                                North Sydney<br />
                                Glace Bay<br />
                                On routes to Cape Breton University
                            </h5>
                        </div>
                    </div>
                    <div className="lg:pl-16">
                        <h2 className={`text-5xl md:text-6xl font-bold tracking-tighter mb-8 opacity-0 ${isSectionVisible ? 'animate-fade-in-up' : ''}`} style={isSectionVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}>Why Rent With<br />Island Residential.</h2>
                        <div className={`w-12 h-[3px] bg-brand-black mb-8 rounded-full opacity-0 ${isSectionVisible ? 'animate-fade-in-up' : ''}`} style={isSectionVisible ? { animationDelay: '0.3s', animationFillMode: 'forwards' } : {}}></div>
                        <p className={`text-xl text-brand-gray font-light leading-relaxed mb-8 opacity-0 ${isSectionVisible ? 'animate-fade-in-up' : ''}`} style={isSectionVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}>
                            We provides professionally managed apartments and rental properties in Sydney. We focus on clean buildings, responsive communication, and proactive service. We limit the number of properties we manage, so we can give tenants the best service.
                        </p>


                        <Link href={route('properties.index')} className={`group inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 bg-brand-light rounded-full hover:bg-brand-gray hover:text-brand-white transition-all duration-300 opacity-0 shadow-sm ${isSectionVisible ? 'animate-fade-in-up' : ''}`} style={isSectionVisible ? { animationDelay: '0.6s', animationFillMode: 'forwards' } : {}}>
                            Browse available apartments
                            <span className="ml-4 transform transition-transform duration-300 group-hover:translate-x-2">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* What We Offer Section */}
            <section ref={offersRef} className="py-24 px-6 md:px-12 bg-brand-white border-t border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-50"></div>
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className={`text-4xl md:text-5xl font-bold tracking-tighter mb-6 opacity-0 ${isOffersVisible ? 'animate-fade-in-up' : ''}`} style={isOffersVisible ? { animationDelay: '0.1s', animationFillMode: 'forwards' } : {}}>What We Offer</h2>
                        <div className={`w-12 h-[3px] bg-brand-black mx-auto rounded-full opacity-0 ${isOffersVisible ? 'animate-fade-in-up' : ''}`} style={isOffersVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}></div>
                        <p className={`mt-8 text-gray-500 font-light max-w-2xl mx-auto text-lg leading-relaxed opacity-0 ${isOffersVisible ? 'animate-fade-in-up' : ''}`} style={isOffersVisible ? { animationDelay: '0.3s', animationFillMode: 'forwards' } : {}}>
                            With dedicated support across Sydney and Cape Breton.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000">
                        {[
                            { title: 'Apartments for rent in Sydney, NS', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                            { title: '1 bedroom apartments for rent', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                            { title: '2 bedroom apartments for rent', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                            { title: 'Off-campus apartments as seen on CBU housing page', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14v6' },
                            { title: 'Pet-friendly rentals in Sydney (select properties)', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                            { title: 'Online maintenance requests', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                            { title: 'Professional property management', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`bg-white/80 backdrop-blur-lg p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 hover:shadow-2xl hover:border-brand-black/5 transition-all duration-500 group transform hover:-translate-y-3 cursor-default opacity-0 ${isOffersVisible ? 'animate-fade-in-up' : ''}`}
                                style={isOffersVisible ? { animationDelay: `${0.4 + (index * 0.15)}s`, animationFillMode: 'forwards' } : {}}
                            >
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-black group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-xl">
                                    <svg className="w-8 h-8 text-brand-black group-hover:text-brand-white group-hover:scale-110 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg leading-snug">{item.title}</h4>
                                <div className="w-8 h-[2px] bg-brand-light mt-6 group-hover:w-full group-hover:bg-brand-black transition-all duration-500"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" ref={contactRef} className="relative py-32 px-6 md:px-12 bg-gray-50 border-t border-gray-200 overflow-hidden mt-12 mb-12 rounded-[3rem] mx-4 md:mx-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">


                <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 relative z-10">
                    <div className={`flex flex-col justify-center opacity-0 ${isContactVisible ? 'animate-fade-in-up' : ''}`} style={isContactVisible ? { animationDelay: '0.1s', animationFillMode: 'forwards' } : {}}>
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-black to-gray-500">Questions about an available apartment?</h2>
                        <div className="w-12 h-[3px] bg-brand-black mb-8 rounded-full"></div>
                        <p className="text-xl text-brand-gray font-light mb-12 leading-relaxed max-w-lg">
                            Contact Island Residential to learn more about apartments for rent in Sydney and across Cape Breton.
                        </p>

                        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-xl">
                            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-brand-black">We regularly assist tenants searching for:</h4>
                            <ul className="space-y-4 font-light text-brand-gray">
                                <li className="flex items-center group"><span className="w-6 h-6 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black mr-4 group-hover:bg-brand-black group-hover:text-brand-white transition-colors text-xs">✓</span> Apartments for rent in Sydney NS</li>
                                <li className="flex items-center group"><span className="w-6 h-6 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black mr-4 group-hover:bg-brand-black group-hover:text-brand-white transition-colors text-xs">✓</span> 1 bedroom apartments for rent</li>
                                <li className="flex items-center group"><span className="w-6 h-6 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black mr-4 group-hover:bg-brand-black group-hover:text-brand-white transition-colors text-xs">✓</span> 2 bedroom apartments for rent</li>
                                <li className="flex items-center group"><span className="w-6 h-6 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black mr-4 group-hover:bg-brand-black group-hover:text-brand-white transition-colors text-xs">✓</span> Off-campus apartments</li>
                                <li className="flex items-center group"><span className="w-6 h-6 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black mr-4 group-hover:bg-brand-black group-hover:text-brand-white transition-colors text-xs">✓</span> Pet friend friendly apartments</li>
                                <li className="flex items-center group"><span className="w-6 h-6 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black mr-4 group-hover:bg-brand-black group-hover:text-brand-white transition-colors text-xs">✓</span> Healthcare professionals relocations</li>
                            </ul>
                        </div>
                    </div>

                    <div className={`bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white relative overflow-hidden opacity-0 ${isContactVisible ? 'animate-fade-in-up' : ''}`} style={isContactVisible ? { animationDelay: '0.3s', animationFillMode: 'forwards' } : {}}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-black to-transparent opacity-10"></div>
                        <h3 className="text-3xl font-bold tracking-tight mb-8 text-brand-black">Send us a message</h3>

                        {recentlySuccessful ? (
                            <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-3xl animate-scale-up backdrop-blur-md">
                                <h4 className="font-bold text-xl mb-2 flex items-center"><span className="mr-2">✨</span> Message Sent!</h4>
                                <p className="font-light opacity-90">Thank you for contacting us. We will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={submitContact} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider pl-4 text-brand-gray">Name *</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-all bg-white hover:bg-gray-50 text-brand-black"
                                        required
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-2 pl-4">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold mb-2 uppercase tracking-wider pl-4 text-brand-gray">Email *</label>
                                        <input
                                            type="email"
                                            className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-all bg-white hover:bg-gray-50 text-brand-black"
                                            required
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-2 pl-4">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-2 uppercase tracking-wider pl-4 text-brand-gray">Phone (Optional)</label>
                                        <input
                                            type="tel"
                                            className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-all bg-white hover:bg-gray-50 text-brand-black"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider pl-4 text-brand-gray">Message *</label>
                                    <textarea
                                        className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-all bg-white hover:bg-gray-50 text-brand-black"
                                        rows="4"
                                        required
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                    ></textarea>
                                    {errors.message && <p className="text-red-500 text-xs mt-2 pl-4">{errors.message}</p>}
                                </div>

                                <label className="flex items-start gap-4 cursor-pointer mt-4 p-4 rounded-2xl bg-white border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <input type="checkbox" className="mt-1 border-gray-300 bg-transparent text-brand-black focus:ring-brand-black rounded" checked={data.terms_agreed} onChange={e => setData('terms_agreed', e.target.checked)} required />
                                    <div>
                                        <div className="font-bold mb-1 tracking-wider uppercase text-xs text-brand-black">Data & Privacy Policy *</div>
                                        <div className="text-xs font-light text-brand-gray leading-relaxed">
                                            I have read and accept the <a href={route('privacy.policy')} target="_blank" className="text-brand-black underline font-bold hover:text-brand-gray transition-colors">Privacy and Data Handling Policy</a>.
                                        </div>
                                    </div>
                                </label>

                                <button type="submit" disabled={processing || !data.terms_agreed} className="w-full group relative px-8 py-5 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg disabled:opacity-50 mt-6 hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-all">
                                    <span className="relative z-10">{processing ? 'Sending...' : 'Send Message'}</span>
                                    <div className="absolute inset-0 bg-gray-800 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 rounded-full"></div>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-brand-black text-brand-white py-20 px-6 md:px-12 rounded-t-[3rem]">
                <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-16 border-t border-brand-white/10 pt-16">
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <img src="/images/media__1779672706531.png" alt="Island Residential Property Management Logo" className="h-12 md:h-36 w-auto object-contain brightness-0 invert" />
                        </Link>
                        <p className="text-brand-light font-light text-lg max-w-sm">Discover <strong>apartments for rent in Sydney, NS</strong>, and throughout <strong>Cape Breton, Nova Scotia</strong>. </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-8 uppercase tracking-[0.2em] text-xs text-gray-400">Navigation</h4>
                        <ul className="space-y-4 text-sm font-light tracking-wide">
                            <li><Link href={route('properties.index')} className="hover:text-brand-white text-gray-300 transition-colors">Apartments for rent</Link></li>
                            <li><Link href={route('forms.rental')} className="hover:text-brand-white text-gray-300 transition-colors">Apply Now</Link></li>
                            <li><Link href={route('forms.maintenance')} className="hover:text-brand-white text-gray-300 transition-colors">Maintenance</Link></li>
                            <li><a href="/#contact" className="hover:text-brand-white text-gray-300 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-8 uppercase tracking-[0.2em] text-xs text-gray-400">Contact</h4>
                        <ul className="space-y-4 text-sm font-light tracking-wide text-gray-300">
                            <li className="hover:text-white transition-colors cursor-pointer">
                                <a href="mailto:rent@islandresidential.ca" className="block w-full h-full">
                                    rent@islandresidential.ca
                                </a>
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">Cape Breton, Nova Scotia</li>
                        </ul>
                    </div>
                </div>

                {/* GEO & AIO Optimized Bottom Section */}
                <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-brand-white/10 text-center md:text-left">
                    <p className="text-xs text-gray-400 leading-loose max-w-5xl">
                        Island Residential offers professionally managed properties, including 1 and 2-bedroom apartments, convenient off-campus housing near Cape Breton University (CBU), and reliable long-term rentals in Sydney, NS. Property management dedicated to your comfort and peace of mind.
                    </p>
                    <p className="mt-6 text-[10px] text-gray-500 uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Island Residential. All rights reserved.
                    </p>
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
