// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderList from './components/OrderList';
import Home from './components/Home';
import AddOrder from './components/AddOrder';
import SoupPlanAdmin from './components/Soupplan';
import SignIn from './components/SignIn';
import { AuthProvider } from './auth/AuthContext'; // Import only the AuthProvider
import PrivateRoute from './routes/PrivateRoute';
import AuthInitializer from './auth/AuthInit'; // Import AuthInitializer
import OrderView from './components/Order';
import Comment from './components/Comment';
import { AlertProvider } from './components/Alert/AlertContext';
import './index.css'; // Import Tailwind CSS

const App = () => {
    return (
      <Router>
        <AuthProvider>
                <AuthInitializer>
                    <AlertProvider>
                    <div className="App">
                        <Routes>
                            <Route path="/signin" element={<SignIn />} />
                            <Route element={<PrivateRoute />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/orders" element={<OrderList />} />
                                <Route path="/supuplan" element={<SoupPlanAdmin />} />
                                <Route path="/add-order" element={<AddOrder />} />
                                <Route path="/order/:orderId" element={<OrderView />} />
                                <Route path="/comment" element={<Comment />} />
                            </Route>
                        </Routes>
                    </div>
                    </AlertProvider>
                </AuthInitializer>
          </AuthProvider>
        </Router>
    );
};

export default App;
