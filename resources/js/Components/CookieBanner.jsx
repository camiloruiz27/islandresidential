import { useState, useEffect } from 'react';

const COOKIE_KEY = 'ir_cookie_consent'; // island residential cookie consent

/**
 * Loads the Microsoft Clarity script dynamically.
 */
function loadClarity() {
    if (window.clarity) return; // already loaded
    (function(c, l, a, r, i, t, y) {
        c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "wx4qcxtfu3");
}

export default function CookieBanner({ isProduction }) {
    const [consent, setConsent] = useState(null); // null = not decided yet
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!isProduction) return; // never show in local environment

        const saved = localStorage.getItem(COOKIE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            setConsent(parsed);
            if (parsed.optional) loadClarity();
        } else {
            // Show banner after a short delay so it doesn't flash immediately
            const t = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(t);
        }
    }, [isProduction]);

    const accept = () => {
        const value = { analytics: true, optional: true };
        localStorage.setItem(COOKIE_KEY, JSON.stringify(value));
        setConsent(value);
        setVisible(false);
        loadClarity();
    };

    const rejectOptional = () => {
        const value = { analytics: true, optional: false };
        localStorage.setItem(COOKIE_KEY, JSON.stringify(value));
        setConsent(value);
        setVisible(false);
        // Google Analytics already loaded by Blade (mandatory), Clarity NOT loaded
    };

    if (!isProduction || !visible) return null;

    return (
        <>
            {/* Backdrop blur on mobile */}
            <div className="fixed inset-0 z-[999] pointer-events-none bg-black/5 backdrop-blur-[1px] sm:bg-transparent sm:backdrop-blur-none" />

            {/* Banner */}
            <div
                className="fixed bottom-0 left-0 right-0 z-[1000] p-4 sm:p-6 animate-fade-in-up"
                style={{ animationDuration: '0.4s', animationFillMode: 'forwards' }}
            >
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 sm:p-6">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                            🍪
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold tracking-tight mb-1">We use cookies</p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                We use <span className="font-semibold text-gray-700">Google Analytics</span> (required) to understand site performance.
                                Optionally, <span className="font-semibold text-gray-700">Microsoft Clarity</span> helps us improve usability through session recordings and heatmaps.
                                You can choose what to allow below.{' '}
                                <a href="/privacy-policy" className="underline hover:text-black transition-colors">Privacy Policy</a>
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 w-full sm:w-auto">
                            <button
                                onClick={rejectOptional}
                                className="text-xs font-bold uppercase tracking-[0.12em] px-5 py-2.5 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors whitespace-nowrap"
                            >
                                Analytics only
                            </button>
                            <button
                                onClick={accept}
                                className="text-xs font-bold uppercase tracking-[0.12em] px-5 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition-colors whitespace-nowrap"
                            >
                                Accept all
                            </button>
                        </div>
                    </div>

                    {/* Subtle info bar */}
                    <div className="bg-gray-50 border-t border-gray-100 px-5 sm:px-6 py-2.5 flex flex-wrap gap-x-5 gap-y-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                            Google Analytics — Required
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
                            Microsoft Clarity — Optional
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
