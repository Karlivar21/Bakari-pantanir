import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import coverlogo from '../../resources/coverlogo.png';

const navItems = [
    { label: 'Heim', path: '/' },
    { label: 'Pantanir', path: '/orders' },
    { label: 'Allar pantanir', path: '/all-orders' },
    { label: 'Súpuplan', path: '/supuplan' },
    { label: 'Athugasemdir', path: '/comment' },
    { label: 'Fyrirtæki', path: '/companies' },
    { label: 'Fyrirtækjapantanir', path: '/company-orders' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);

    const handleNav = (path) => {
        navigate(path);
        setOpen(false);
    };

    const navContent = (
        <>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNav(item.path)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </nav>
            <div className="px-3 py-4 border-t border-gray-700/60">
                <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-white hover:bg-gray-700/50 transition-colors"
                >
                    Skrá út
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-gray-900 z-40 flex items-center justify-between px-4 border-b border-gray-700/60">
                <img src={coverlogo} alt="Kalla Bakarí" className="h-8 w-auto" />
                <button
                    onClick={() => setOpen(true)}
                    className="text-gray-400 hover:text-white p-1"
                    aria-label="Opna valmynd"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile backdrop */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar panel — fixed overlay on mobile, sticky column on desktop */}
            <div className={`
                fixed md:sticky top-0 inset-y-0 left-0
                w-64 md:w-56 h-screen flex-shrink-0
                bg-gray-900 flex flex-col
                z-50 transition-transform duration-200
                ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>
                <div className="px-5 py-6 border-b border-gray-700/60 flex items-start justify-between">
                    <div>
                        <img src={coverlogo} alt="Kalla Bakarí" className="h-10 w-auto" />
                        <p className="text-gray-500 text-xs mt-2">Pantanakerfi</p>
                    </div>
                    <button
                        className="md:hidden text-gray-400 hover:text-white p-1 mt-1"
                        onClick={() => setOpen(false)}
                        aria-label="Loka valmynd"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {navContent}
            </div>
        </>
    );
};

export default Sidebar;
