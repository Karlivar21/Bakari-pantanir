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

    const formatDate = (date) => {
        // Assume the date is in 'DD/MM/YYYY' format
        const [day, month, year] = date.split('/');

        // Create a Date object from the components
        const parsedDate = new Date(`${year}-${month}-${day}`);

        // Array of month names in Icelandic
        const monthNames = [
            'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
            'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
        ];

        // Get the month and format the date accordingly
        const formattedMonth = monthNames[parsedDate.getMonth()];
        return `${parsedDate.getDate()} ${formattedMonth}`;
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
                    if (cake.cake === 'Sykurmassamynd') {
                        products.push(`${cake.cake}`);
                    } else {
                        products.push(`${cake.cake} - Stærð: ${cake.size}${cake.filling ? `, Fylling: ${cake.filling}` : ''}${cake.bottom ? `, Botn: ${cake.bottom}` : ''}${cake.smjorkrem ? `, Smjörkrem: ${cake.smjorkrem}` : ''}${cake.text? `, Texti: ${cake.text}` : ''}${cake.skreyting? `, Skreyting: ${cake.skreyting}` : ''}`);
                    }
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
                    products.push(`${product.details.other} - Magn: ${product.details.quantity}`);
            }
        });

        return products;
    };

    if (!order) {
        return <p>Loading order details...</p>; // Show a loading message while the order is being fetched
    }


    return (
        <div className="flex bg-gray-800">
            <Sidebar />
            <div className="flex flex-col items-center ml-12 mt-5 p-6">
                <h2 className="text-2xl text-white font-serif font-bold mb-4">Pöntunar upplýsingar</h2>
                <div className="rounded-lg p-4 bg-white shadow-lg">
                    <div className="flex flex-col border border-blue-700 rounded-lg p-4 space-y-4 bg-gray-100">
                        <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                            <p className="font-semibold font-serif text-lg">{order.name}</p>
                            <p className="font-serif">Símanúmer: {order.phone}</p>
                            <p className="font-serif">Netfang: {order.email}</p>
                            <p className="font-serif">Dagsetning: {formatDate(new Date(order.date).toLocaleDateString())}</p>
                            <p className='font-serif'>Greitt: {order.payed ? 'Já' : 'Nei'}</p>
                            <p className="font-serif">Athugasemdir: {order.user_message}</p>
                        </div>
                        <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                            {formatProducts(order).map((product, index) => (
                                <p className="font-serif text-lg" key={index}>{product}</p>
                            ))}
                        </div>
                        {order.image && (
                            <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                                        <a 
                                            href={`https://api.kallabakari.is/${order.image}`} // Corrected URL to point to full image path
                                            download={order.image.split('/').pop()} // Extracts filename from the URL and uses it as the download name
                                            className='flex bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                                        >
                                            Download Image
                                        </a>
                            </div>
                        )}
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
