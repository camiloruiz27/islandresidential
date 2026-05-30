import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ apartments }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-brand-white text-brand-black font-sans overflow-hidden selection:bg-brand-black selection:text-brand-white">
            <Head title="Available Properties - Island Residential" />

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? 'bg-brand-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link href="/" className="animate-fade-in">
                        <img src="/images/media__1779672706531.png" alt="Island Residential" className="h-16 md:h-20 w-auto object-contain" />
                    </Link>
                    <Link href="/" className="group flex items-center text-xs font-bold tracking-[0.2em] animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <span className="transform transition-transform duration-300 group-hover:-translate-x-2 mr-2">←</span>
                        BACK
                    </Link>
                </div>
            </nav>

            <main className="pt-40 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto">
                <div className="mb-24 animate-fade-in-up">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] animate-reveal">
                        Available <br />
                        <span className="text-gray-400 font-light">Apartments.</span>
                    </h1>
                    <div className="w-12 h-[3px] bg-brand-black mb-8 rounded-full"></div>
                    <p className="text-xl text-brand-gray font-light max-w-xl leading-relaxed">
                        Browse apartments for rent in Sydney, Nova Scotia and across Cape Breton. Island Residential offers professionally.
                    </p>
                </div>

                {apartments.length === 0 ? (
                    <div className="text-center py-40 border border-gray-200 rounded-[2.5rem] animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                        <p className="text-xl text-brand-gray font-light mb-6">No properties are currently available.</p>
                        <Link href={route('forms.rental')} className="group relative inline-flex items-center justify-center px-10 py-5 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg">
                            <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-10">Join Waiting List</span>
                            <span className="absolute inset-0 z-10 flex items-center justify-center transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">Apply Now</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-24">
                        {apartments.map((apt, index) => (
                            <Link
                                key={apt.id}
                                href={route('properties.show', apt.id)}
                                className="group cursor-pointer animate-fade-in-up opacity-0 block"
                                style={{ animationDelay: `${0.2 + (index * 0.1)}s`, animationFillMode: 'forwards' }}
                            >
                                <div className="relative overflow-hidden mb-8 bg-gray-100 aspect-[4/5] animate-reveal rounded-[2.5rem] shadow-sm hover:shadow-xl transition-shadow duration-500">
                                    {apt.images && apt.images.length > 0 ? (
                                        <img
                                            src={apt.images[0]}
                                            alt={apt.title}
                                            className="w-full h-full object-cover transform transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-light tracking-widest uppercase text-sm">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6 bg-brand-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] transform -translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 shadow-md">
                                        View Details
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-b border-gray-200 pb-6 mb-4 transform transition-all duration-500 group-hover:border-brand-black">
                                    <div>
                                        <h3 className="text-3xl font-light tracking-tight mb-2 group-hover:font-medium transition-all">{apt.title}</h3>
                                        <p className="text-brand-gray text-sm tracking-wide uppercase">{apt.location || 'Nova Scotia, Canada'}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold tracking-tighter mb-1">${apt.price}</div>
                                        <div className="text-xs text-gray-400 font-bold tracking-[0.2em] uppercase">Per Month</div>
                                    </div>
                                </div>
                                <div className="flex gap-8 text-sm font-bold tracking-wider text-brand-black uppercase">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-brand-black"></span> {apt.bedrooms} Beds
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-gray-300"></span> {apt.bathrooms} Baths
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
