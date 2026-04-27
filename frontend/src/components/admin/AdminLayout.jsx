import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const dashboardIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const usersIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

function buildNavItems(role) {
    const items = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: dashboardIcon }
    ];
    if (role === 'superadmin') {
        items.push({ to: '/admin/users', label: 'Utenti Admin', icon: usersIcon });
    }
    return items;
}

export default function AdminLayout() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = buildNavItems(admin?.role);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar desktop */}
            <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-200 fixed inset-y-0 left-0 z-30">
                <SidebarContent navItems={navItems} onNavigate={() => {}} />
            </aside>

            {/* Sidebar mobile drawer */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-40 flex">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative w-64 bg-slate-900 text-slate-200 flex flex-col">
                        <SidebarContent navItems={navItems} onNavigate={() => setSidebarOpen(false)} />
                    </aside>
                </div>
            )}

            {/* Main */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
                        aria-label="Apri menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex-1" />

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen(o => !o)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center font-semibold">
                                {admin?.username?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <div className="text-sm font-medium text-slate-800">{admin?.username}</div>
                                <div className="text-xs text-slate-500 capitalize">{admin?.role}</div>
                            </div>
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <div className="text-sm font-medium text-slate-800">{admin?.username}</div>
                                        <div className="text-xs text-slate-500">{admin?.role}</div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Esci
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function SidebarContent({ navItems, onNavigate }) {
    return (
        <>
            <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
                <img
                    src="/logo_ideal.png"
                    alt="Idealstampa"
                    className="h-10 w-auto object-contain filter brightness-0 invert"
                />
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white leading-tight truncate">Idealstampa</div>
                    <div className="text-xs text-slate-400">Admin Panel</div>
                </div>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onNavigate}
                        end={item.to === '/admin/dashboard'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                                isActive
                                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 text-teal-300 border border-teal-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-6 py-4 border-t border-slate-800 text-xs text-slate-500">
                &copy; {new Date().getFullYear()} Idealstampa
            </div>
        </>
    );
}
