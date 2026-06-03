import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatProducts, formatDateIS } from '../../utils/OrderHelpers';

const monthNames = [
    'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
    'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
];

const MonthView = ({ orders }) => {
    const navigate = useNavigate();
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthOrders = (orders || []).filter(order => {
        const orderDate = new Date(order.date);
        if (isNaN(orderDate.getTime())) return false;
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 capitalize">{monthNames[currentMonth]}</h2>
            {monthOrders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {monthOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <p className="font-semibold text-gray-900">{order.name}</p>
                            <p className="text-xs text-amber-600 mt-0.5">
                                {formatDateIS(new Date(order.date).toLocaleDateString('is-IS'))}
                            </p>
                            <ul className="mt-3 space-y-1">
                                {formatProducts(order).map((product, index) => (
                                    <li key={index} className="text-sm text-gray-600">{product}</li>
                                ))}
                            </ul>
                            <button
                                className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                                onClick={() => navigate(`/order/${order.id}`)}
                            >
                                Skoða nánar
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400">Engar pantanir þessa mánuðinn</p>
            )}
        </div>
    );
};

export default MonthView;
