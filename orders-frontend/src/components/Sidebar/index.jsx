import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

const navItems = [
    { label: 'Heim', path: '/' },
    { label: 'Pantanir', path: '/orders' },
    { label: 'Súpuplan', path: '/supuplan' },
    { label: 'Athugasemdir', path: '/comment' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    return (
        <div className="flex flex-col w-56 min-h-screen bg-gray-900 flex-shrink-0">
            <div className="px-5 py-6 border-b border-gray-700/60">
                <p className="font-serif text-amber-400 text-lg font-bold tracking-wide">Kalla Bakari</p>
                <p className="text-gray-500 text-xs mt-0.5">Pantanakerfi</p>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-amber-500 text-gray-900'
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
        </div>
    );
};

export default Sidebar;
