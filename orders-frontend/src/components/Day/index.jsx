import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

const DayView = ({ orders, date }) => {
    const navigate = useNavigate();

    const dayOrders = orders.filter(order => new Date(order.date).toLocaleDateString('is-IS') === date);

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

    const handleOrderClick = (uniqueId) => {
        console.log('Order clicked:', uniqueId); // Debugging log
        navigate(`/order/${uniqueId}`);
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-2xl font-bold mb-4">{date}</h2>
            {dayOrders.length > 0 ? (
                <div className="flex flex-col w-full max-w-4xl border-2 border-blue-700 rounded-lg p-4 space-y-4 bg-gray-100 shadow-lg">
                    {dayOrders.map((order, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row rounded-lg p-4 space-y-4 md:space-y-0 md:space-x-4 bg-gray-100"
                        >
                            <div className="flex-1 bg-white p-4 rounded-lg">
                                <p className="font-semibold text-lg">{order.name}</p>
                                <p>{order.phone}</p>
                                <p>{order.email}</p>
                                <button
                                    onClick={() => handleOrderClick(order.id)}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    View Details
                                </button>
                            </div>
                            <div className="flex-1 bg-white p-4 rounded-lg">
                                {formatProducts(order).map((product, idx) => (
                                    <p key={idx} className="font-serif text-lg">{product}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No orders</p>
            )}
        </div>
    );
};

export default DayView;
