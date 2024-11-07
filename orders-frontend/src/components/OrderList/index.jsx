import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar'; // Import the Sidebar component

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [searchEmail, setSearchEmail] = useState(''); // State to store search input
    const [filteredOrders, setFilteredOrders] = useState([]); // State to store filtered orders
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://api.kallabakari.is/api/orders');
                setOrders(response.data);
                setFilteredOrders(response.data); // Initialize filtered orders with all orders
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

    const handleSearch = () => {
        if (searchEmail.trim() === '') {
            // If search input is empty, reset to show all orders
            setFilteredOrders(orders);
        } else {
            // Filter orders based on email
            const filtered = orders.filter(order =>
                order.email.toLowerCase().includes(searchEmail.toLowerCase())
            );
            setFilteredOrders(filtered);
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
            <Sidebar />
            <div className="flex flex-col p-6 w-full overflow-hidden">
                <h1 className="text-3xl text-white font-serif font-bold mb-4">Allar pantanir</h1>

                {/* Search Input and Button */}
                <div className="mb-4 flex items-center">
                    <input
                        type="text"
                        placeholder="Search by email"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Search
                    </button>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="w-full divide-y divide-gray-200 bg-white">
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
                            {filteredOrders.slice().reverse().map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(new Date(order.date).toLocaleDateString())}</td>
                                    <td className="px-2 py-2 mt-2 bg-blue-500 text-md text-white font-serif rounded-lg cursor-pointer" onClick={() => handleOrderClick(order)}>
                                        Order Details
                                    </td>
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
