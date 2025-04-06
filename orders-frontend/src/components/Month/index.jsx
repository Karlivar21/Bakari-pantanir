import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatProducts, formatDateIS } from '../../utils/OrderHelpers'; // Assuming you moved helpers

const MonthView = ({ orders }) => {
    const navigate = useNavigate();
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthOrders = (orders || []).filter(order => {
        const orderDate = new Date(order.date);
        if (isNaN(orderDate.getTime())) {
            console.error('Invalid order date:', order.date);
            return false;
        }
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const handleOrderClick = (order) => {
        navigate(`/order/${order.id}`);
    };

    const getCurrentMonthName = () => {
        const monthNames = [
            'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
            'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
        ];
        const today = new Date();
        return monthNames[today.getMonth()];
    };
    
    return (
        <div className="flex flex-col items-center p-8 space-y-8 bg-gray-100 rounded-2xl shadow-inner">
            <h3 className="text-4xl font-serif font-bold text-gray-800">{getCurrentMonthName()}</h3>

            {monthOrders.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-6">
                    {monthOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex flex-col justify-between bg-white rounded-2xl shadow-lg p-6 w-72 min-h-[280px] hover:scale-105 transition-transform"
                        >
                            <div className="space-y-2">
                                <p className="font-serif text-xl font-bold text-blue-700">{order.name}</p>
                                <p className="font-serif text-gray-600">{formatDateIS(new Date(order.date).toLocaleDateString('is-IS'))}</p>
                                <ul className="space-y-1 mt-2">
                                    {formatProducts(order).map((product, index) => (
                                        <li key={index} className="text-gray-700 font-medium">{product}</li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                className="mt-4 bg-blue-500 text-white font-semibold py-2 rounded-xl hover:bg-blue-600 transition-all"
                                onClick={() => handleOrderClick(order)}
                            >
                                Skoða nánar
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-lg mt-10">Engar pantanir þessa mánuðinn</p>
            )}
        </div>
    );
};

export default MonthView;
