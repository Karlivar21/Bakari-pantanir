import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatProducts, formatDateIS } from '../../utils/OrderHelpers';


const DayView = ({ orders, date }) => {
    const navigate = useNavigate();

    const dayOrders = orders.filter(order => new Date(order.date).toLocaleDateString('is-IS') === date);

    const handleOrderClick = (uniqueId) => {
        console.log('Order clicked:', uniqueId); // Debugging log
        navigate(`/order/${uniqueId}`);
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-2xl text-black font-bold mb-4">{formatDateIS(date)}</h2>
            {dayOrders.length > 0 ? (
                <div className="flex flex-col w-full max-w-4xl border-2 border-blue-700 rounded-lg p-4 space-y-4 bg-gray-100 shadow-lg">
                    {dayOrders.map((order, index) => (
                        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 space-y-4 md:space-y-0 md:space-x-6">
                        <div className="flex-1 space-y-2">
                          <p className="font-bold text-xl">{order.name}</p>
                          <p className="text-gray-600">{order.phone}</p>
                          <p className="text-gray-600">{order.email}</p>
                          <button
                            onClick={() => handleOrderClick(order.id)}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-all"
                          >
                            Skoða nánar
                          </button>
                        </div>
                      
                        <div className="flex-1 space-y-2">
                          {formatProducts(order).map((product, idx) => (
                            <p key={idx} className="text-gray-700">{product}</p>
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
