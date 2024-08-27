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

    const handleOrderClick = (order) => {
        navigate(`/order/${order.id}`);
    };

    const formatProducts = (order) => {
        const products = [];
    
        order.products.forEach((product) => {
            switch (product.type) {
                case 'cake':
                    const cake = product.details;
                    products.push(`${cake.cake} - Stærð: ${cake.size}${cake.filling ? `, Fylling: ${cake.filling}` : ''}${cake.bottom ? `, Botn: ${cake.bottom}` : ''}${cake.smjorkrem ? `, Smjörkrem: ${cake.smjorkrem}` : ''}`);
                    break;
                case 'bread':
                    const bread = product.details;
                    products.push(`${bread.bread} - Magn: ${bread.quantity}`);
                    break;
                case 'minidonut':
                    const minidonut = product.details;
                    products.push(`Minidonuts - Magn: ${minidonut.quantity}`);
                    break;
                default:
                    products.push(`Unknown product type: ${product.type}`);
            }
        });
    
        return products;
    };

    return (
        <div className="flex bg-gray-800">
            <Sidebar/> 
            <div className="flex flex-col p-6 w-full overflow-hidden"> {/* Added overflow-hidden */}
                <h1 className="text-3xl text-white font-serif font-bold mb-4">Allar pantanir</h1>
                <div className="overflow-x-auto w-full"> {/* Changed width to full */}
                    <table className="w-full divide-y divide-gray-200 bg-white"> {/* Changed width to full */}
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.slice().reverse().map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                    <button className="px-2 py-2 mt-2 bg-blue-500 text-md text-white font-serif rounded-lg" onClick={() => handleOrderClick(order)}>Order Details</button>
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
