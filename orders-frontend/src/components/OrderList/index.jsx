import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar'; // Import the Sidebar component
import './styles.css'; // Ensure you create a CSS file for styling the order list

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://api.kallabakari.is/api/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleAddOrder = () => {
        navigate('/add-order');
    };

    const formatProducts = (order) => {
        const products = [];

        order.cakes.forEach((cake) => {
            products.push(`${cake.cake} - Stærð: ${cake.size}${cake.filling ? `, Fylling: ${cake.filling}` : ''}${cake.bottom ? `, Botn: ${cake.bottom}` : ''}${cake.smjorkrem ? `, Smjörkrem: ${cake.smjorkrem}` : ''}`);
        });

        order.breads.forEach((bread) => {
            products.push(`${bread.bread} - Magn: ${bread.quantity}`);
        });

        order.minidonuts.forEach((minidonut) => {
            products.push(`Minidonuts - Magn: ${minidonut.quantity}`);
        });

        return products;
    };

    return (
        <div className="order-list-container">
            <Sidebar /> {/* Add the Sidebar component here */}
            <div className="order-list-content">
                <h1>Allar pantanir</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Products</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.name}</td>
                                <td>{order.phone}</td>
                                <td>{order.email}</td>
                                <td>{new Date(order.date).toLocaleDateString()}</td>
                                <td>
                                    {formatProducts(order).map((product, index) => (
                                        <div key={index}>{product}</div>
                                    ))}
                                </td>
                                <td>{order.user_message ? order.user_message : 'No Message'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="fab" onClick={handleAddOrder}>+</button>
            </div>
        </div>
    );
};

export default OrderList;
