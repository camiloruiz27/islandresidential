import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import CookieBanner from '@/Components/CookieBanner';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Island Residential';

createInertiaApp({
    title: (title) => title.includes(appName) ? title : `${title} | ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <CookieBanner isProduction={props.initialPage.props.isProduction} />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
