import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateIS } from '../../utils/OrderHelpers';

const summariseProducts = (order) => {
    const raw = typeof order.products === 'string' ? JSON.parse(order.products) : order.products;
    return (raw ?? []).map((p) => {
        switch (p.type) {
            case 'cake':      return `${p.details.cake}${p.details.size ? ` – ${p.details.size}` : ''}`;
            case 'bread':     return `${p.details.bread} × ${p.details.quantity}`;
            case 'minidonut': return `Mini-donuts × ${p.details.quantity}`;
            case 'bite':      return `${p.details.name} × ${p.details.quantity}`;
            default:          return p.details?.name ?? p.type;
        }
    });
};

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

                    <div className="flex-1 overflow-y-auto space-y-1.5">
                        {weekOrders.ordersByDay[day].length > 0 ? (
                            weekOrders.ordersByDay[day].map((order, i) => {
                                const lines = summariseProducts(order);
                                return (
                                    <button
                                        key={i}
                                        onClick={() => navigate(`/order/${order.id}`)}
                                        className="w-full text-left px-2.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                                    >
                                        <p className="text-xs font-semibold text-amber-900 truncate">{order.name}</p>
                                        <p className="text-xs text-amber-700 mt-0.5 leading-snug">
                                            {lines.join(', ')}
                                        </p>
                                    </button>
                                );
                            })
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
