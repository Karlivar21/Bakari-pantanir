import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatProducts, formatDateIS } from '../../utils/OrderHelpers';

const WeekView = ({ weekOrders }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {weekOrders.weekDays && weekOrders.weekDays.map((day, dayIndex) => (
                <div
                    key={day}
                    className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-4 min-h-[300px]"
                >
                    <div className="mb-3 pb-2 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800 text-sm">{day}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDateIS(weekOrders.dates[dayIndex])}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1">
                        {weekOrders.ordersByDay[day].length > 0 ? (
                            weekOrders.ordersByDay[day].map((order, orderIndex) => (
                                <div key={orderIndex}>
                                    {formatProducts(order).map((product, productIndex) => (
                                        <button
                                            key={productIndex}
                                            onClick={() => navigate(`/order/${order.id}`)}
                                            className="w-full text-left text-xs px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg transition-colors mb-1"
                                        >
                                            {product}
                                        </button>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 mt-2">Engar pantanir</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeekView;
