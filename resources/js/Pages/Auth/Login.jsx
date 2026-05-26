import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 20 - 10,
                y: (e.clientY / window.innerHeight) * 20 - 10
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-brand-white text-brand-black font-sans flex">
            <Head title="Admin Login - Island Residential" />

            {/* Left side: Image and Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-black items-center justify-center">
                <div 
                    className="absolute inset-0 opacity-40"
                    style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`, transition: 'transform 0.1s ease-out' }}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="Architecture" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 p-16 text-brand-white animate-fade-in-up">
                    <img src="/images/media__1779672706531.png" alt="Island Residential" className="h-20 w-auto mb-12 brightness-0 invert" />
                    <h2 className="text-4xl font-light tracking-tighter mb-4">Elevating Property<br/>Standards.</h2>
                    <div className="w-12 h-[2px] bg-brand-white/50 mb-8 rounded-full"></div>
                    <p className="text-brand-white/70 font-light leading-relaxed max-w-sm">
                        Secure access to the Island Residential administration panel. Manage properties, review applications, and handle maintenance requests seamlessly.
                    </p>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-white relative">
                
                {/* Mobile Back button */}
                <Link href="/" className="absolute top-8 left-8 lg:hidden group flex items-center text-xs font-bold tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                    <span className="transform transition-transform duration-300 group-hover:-translate-x-2 mr-2">←</span> 
                    BACK TO SITE
                </Link>

                {/* Mobile Logo */}
                <div className="absolute top-8 right-8 lg:hidden">
                    <img src="/images/media__1779672706531.png" alt="Island Residential" className="h-10 w-auto" />
                </div>

                <div className="w-full max-w-md animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    <div className="mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-2">Welcome Back</p>
                        <h1 className="text-4xl md:text-5xl font-light tracking-tighter mb-4">Admin Portal.</h1>
                        <div className="w-12 h-[2px] bg-brand-black mb-8 rounded-full"></div>
                    </div>

                    {status && <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-sm font-bold tracking-wide uppercase rounded-xl">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold mb-3 uppercase tracking-wider pl-4 text-gray-500">Email Address</label>
                            <input 
                                type="email" 
                                className={`w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors ${errors.email ? 'border-red-300 bg-red-50' : ''}`}
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                required 
                                autoFocus
                                placeholder="admin@islandresidential.ca"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-2 pl-4 font-medium">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-3 uppercase tracking-wider pl-4 text-gray-500">Password</label>
                            <input 
                                type="password" 
                                className={`w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors ${errors.password ? 'border-red-300 bg-red-50' : ''}`}
                                value={data.password} 
                                onChange={e => setData('password', e.target.value)} 
                                required 
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-2 pl-4 font-medium">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 border-gray-300 text-brand-black focus:ring-brand-black rounded transition-colors group-hover:border-brand-black"
                                    checked={data.remember} 
                                    onChange={e => setData('remember', e.target.checked)} 
                                />
                                <span className="ml-3 text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-black transition-colors">Remember me</span>
                            </label>
                        </div>

                        <div className="pt-8">
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full group relative px-10 py-5 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg disabled:opacity-50"
                            >
                                <span className="relative z-10">{processing ? 'Authenticating...' : 'Sign In'}</span>
                                <div className="absolute inset-0 bg-gray-800 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 rounded-full"></div>
                            </button>
                        </div>
                        
                        <div className="text-center mt-8">
                            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">
                                Return to public site
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
