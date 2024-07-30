// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrderList from './components/OrderList';
import Home from './components/Home';
import AddOrder from './components/AddOrder';
import Sidebar from './components/Sidebar';
import SoupPlanAdmin from './components/Soupplan';

const About = () => <div>About Page</div>; // Placeholder for About component
const Contact = () => <div>Contact Page</div>; // Placeholder for Contact component

const App = () => {
    return (
        <Router>
            <div className="App">
                <Sidebar/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/supuplan" element={<SoupPlanAdmin />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/add-order" element={<AddOrder />} />
                    {/* Add other routes here */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
