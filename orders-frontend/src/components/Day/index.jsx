import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatProducts, formatDateIS } from '../../utils/OrderHelpers';

const DayView = ({ orders, date }) => {
    const navigate = useNavigate();
    const dayOrders = orders.filter(order => new Date(order.date).toLocaleDateString('is-IS') === date);

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{formatDateIS(date)}</h2>
            {dayOrders.length > 0 ? (
                <div className="space-y-3 max-w-2xl">
                    {dayOrders.map((order, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start justify-between gap-4">
                            <div>
                                <p className="font-semibold text-gray-900">{order.name}</p>
                                <p className="text-sm text-gray-500 mt-0.5">{order.phone} · {order.email}</p>
                                <div className="mt-2 space-y-0.5">
                                    {formatProducts(order).map((product, idx) => (
                                        <p key={idx} className="text-sm text-gray-600">{product}</p>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/order/${order.id}`)}
                                className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                                Skoða
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400">Engar pantanir þennan dag</p>
            )}
        </div>
    );
};

export default DayView;
