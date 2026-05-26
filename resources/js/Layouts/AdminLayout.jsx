import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const NavItem = ({ href, icon, label, active }) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 group ${
            active
                ? 'bg-white text-black shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
    >
        <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${active ? 'text-black' : ''}`}>{icon}</span>
        <span>{label}</span>
        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-black"></span>}
    </Link>
);

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { href: route('admin.dashboard'), label: 'Dashboard', icon: '◎', routeName: 'admin.dashboard' },
        { href: route('admin.apartments.index'), label: 'Apartments', icon: '⊞', routeName: 'admin.apartments.*' },
        { href: route('admin.applications.index'), label: 'Applications', icon: '◻', routeName: 'admin.applications.*' },
        { href: route('admin.maintenance.index'), label: 'Maintenance', icon: '◈', routeName: 'admin.maintenance.*' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-black text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="p-8 border-b border-white/10">
                    <Link href="/" className="block">
                        <img src="/images/media__1779672706531.png" alt="Island Residential" className="h-10 w-auto object-contain brightness-0 invert" />
                    </Link>
                    <p className="text-white/30 text-xs mt-3 tracking-widest uppercase">Admin Panel</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="text-white/20 text-xs uppercase tracking-widest px-4 py-2 mb-1">Management</p>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            active={route().current(item.routeName)}
                        />
                    ))}

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-white/20 text-xs uppercase tracking-widest px-4 py-2 mb-1">Website</p>
                        <NavItem href={route('properties.index')} icon="↗" label="View Properties" active={false} />
                        <NavItem href={route('privacy.policy')} icon="⊹" label="Privacy Policy" active={false} />
                    </div>
                </nav>

                {/* User footer */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                            {auth?.user?.name?.charAt(0) ?? 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{auth?.user?.name}</div>
                            <div className="text-white/40 text-xs truncate">{auth?.user?.email}</div>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm"
                    >
                        <span>⎋</span>
                        <span>Log Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-gray-900">{title}</h1>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <Link
                            href={route('properties.index')}
                            target="_blank"
                            className="hidden sm:flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-gray-900 transition-colors border border-gray-200 px-4 py-2 rounded-full hover:border-gray-900"
                        >
                            View Site ↗
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
