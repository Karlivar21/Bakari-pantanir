// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css'; // Ensure you create a CSS file for styling the sidebar

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Pantanakerfi</h2>
            <ul>
                <li><Link to="/">Heim</Link></li>
                <li><Link to="/orders">Pantanir</Link></li>
                <li><Link to="/supuplan">Súpuplan</Link></li>
                <li><Link to="/contact">Starfsmenn</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
