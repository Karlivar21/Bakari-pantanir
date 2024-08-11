import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';

const OrderView = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null); // Set initial state to null to handle loading state

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://api.kallabakari.is/api/orders');
                console.log('OrderId:', orderId); // Debugging log
                const foundOrder = response.data.find((order) => order.id === orderId);
                setOrder(foundOrder);
                console.log('Fetched Order:', foundOrder); // Debugging log
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [orderId]); // Add orderId as a dependency

    const handleRemoveOrder = async () => {
        try {
            await axios.delete(`https://api.kallabakari.is/api/orders/${orderId}`);
            alert('Order removed successfully');
            navigate('/'); // Redirect to the main view after deletion
        } catch (error) {
            console.error('Error removing the order:', error);
            alert('Failed to remove the order');
        }
    };

    const formatProducts = (order) => {
        if (!order || !order.products) {
            return []; // Return an empty array if order or order.products is undefined
        }

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

    if (!order) {
        return <p>Loading order details...</p>; // Show a loading message while the order is being fetched
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col items-center p-6">
                <h2 className="text-2xl font-serif font-bold mb-4">Order Details</h2>
                <div className="rounded-lg p-4 bg-white shadow-lg">
                    <div className="flex flex-col border border-blue-700 rounded-lg p-4 space-y-4 bg-gray-100">
                        <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                            <p className="font-semibold font-serif text-lg">{order.name}</p>
                            <p className="font-serif">Símanúmer: {order.phone}</p>
                            <p className="font-serif">Netfang: {order.email}</p>
                            <p className="font-serif">Dagsetning: {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                            {formatProducts(order).map((product, index) => (
                                <p className="font-serif text-lg" key={index}>{product}</p>
                            ))}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handleRemoveOrder}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
                >
                    Remove Order
                </button>
            </div>
        </div>
    );
};

export default OrderView;
