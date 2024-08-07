// App.js
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderList from './components/OrderList';
import Home from './components/Home';
import AddOrder from './components/AddOrder';
import Sidebar from './components/Sidebar';
import SoupPlanAdmin from './components/Soupplan';
import SignIn from './components/SignIn';
import { AuthProvider, AuthContext } from './AuthContext';
import PrivateRoute from './PrivateRoute';

const App = () => {
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            login(token); // Automatically log in with token
        }
    }, [login]);

    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Sidebar />
                    <Routes>
                        <PrivateRoute path="/" element={<Home />} />
                        <PrivateRoute path="/orders" element={<OrderList />} />
                        <PrivateRoute path="/supuplan" element={<SoupPlanAdmin />} />
                        <Route path="/signin" element={<SignIn />} />
                        <PrivateRoute path="/add-order" element={<AddOrder />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
