const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    black: '#0a0a0a',
                    white: '#fafafa',
                    gray: '#333333',
                    light: '#e5e5e5'
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 1s ease-out forwards',
                'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scale-up': 'scaleUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'reveal': 'reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleUp: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                reveal: {
                    '0%': { clipPath: 'inset(100% 0 0 0)' },
                    '100%': { clipPath: 'inset(0 0 0 0)' },
                }
            }
        },
    },

    plugins: [require('@tailwindcss/forms')],
};
