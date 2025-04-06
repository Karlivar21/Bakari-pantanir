import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="flex flex-col bg-zinc-900 w-1/5 md:w-1/6 min-h-screen p-6 space-y-8 shadow-md">
            <h2 className="font-serif text-3xl text-white font-bold tracking-wide">
                Pantanakerfi
            </h2>

            <ul className="flex flex-col gap-4 mt-8">
                {[
                    { label: 'Heim', path: '/' },
                    { label: 'Pantanir', path: '/orders' },
                    { label: 'Súpuplan', path: '/supuplan' },
                    { label: 'Athugasemdir', path: '/comment' }
                ].map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <li
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`text-lg md:text-xl font-serif p-3 rounded-lg cursor-pointer transition-all
                                ${isActive ? 'bg-blue-700 text-white font-bold' : 'text-white hover:bg-blue-600 hover:shadow-md'}
                            `}
                        >
                            {item.label}
                        </li>
                    );
                })}
            </ul>

            <div className="mt-auto">
                <button
                    onClick={logout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition-all"
                >
                    Skrá út
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
