import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar'; // Import the Sidebar component

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
        <div className="flex min-h-screen">
            <Sidebar/> {/* Sidebar takes 20% of the width */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-4">Allar pantanir</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatProducts(order).map((product, index) => (
                                            <div key={index} className="text-sm">{product}</div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_message ? order.user_message : 'No Message'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                    onClick={handleAddOrder}
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default OrderList;
