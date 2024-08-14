import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext'; // Adjust the path as necessary

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout(); // Call the logout function from context
    };

    // Handler for navigating to different routes
    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="flex flex-col bg-gray-700 w-1/4 md:w-1/6 min-h-screen">
            <h2 className='font-serif p-2 text-white font-bold text-lg md:text-2xl mb-5'>Pantanakerfi</h2>
            <ul className="flex-grow">
                <li
                    className='font-serif text-white text-lg md:text-xl border p-2 cursor-pointer hover:bg-gray-600'
                    onClick={() => handleNavigation('/')}
                >
                    Heim
                </li>
                <li
                    className='font-serif text-white text-lg md:text-xl border p-2 cursor-pointer hover:bg-gray-600'
                    onClick={() => handleNavigation('/orders')}
                >
                    Pantanir
                </li>
                <li
                    className='font-serif text-white text-lg md:text-xl border p-2 cursor-pointer hover:bg-gray-600'
                    onClick={() => handleNavigation('/supuplan')}
                >
                    Súpuplan
                </li>
                <li
                    className='font-serif text-white text-lg md:text-xl border p-2 cursor-pointer hover:bg-gray-600'
                    onClick={() => handleNavigation('/comment')}
                >
                    Athugasemdir
                </li>
            </ul>
            <button
                className='bg-blue-600 text-white text-lg md:text-xl mt-auto py-2 px-4 rounded-lg m-4'
                onClick={handleLogout}
            >
                Skrá út
            </button>
        </div>
    );
};

export default Sidebar;
