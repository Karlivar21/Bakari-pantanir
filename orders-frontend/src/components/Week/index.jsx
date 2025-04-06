import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatProducts, formatDateIS } from '../../utils/OrderHelpers';


const WeekView = ({ weekOrders }) => {
    const navigate = useNavigate();


    const handleOrderClick = (order) => {
        navigate(`/order/${order.id}`);
    };

    return (
        <div className="flex flex-row justify-center flex-wrap">
            {weekOrders.weekDays && weekOrders.weekDays.map((day, dayIndex) => (
                <div 
                key={day} 
                className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-6 m-3 w-64 min-h-[350px] transition-transform hover:scale-105"
              >
                <h2 className="font-serif text-2xl font-bold text-gray-800">{day}</h2>
                <h3 className="font-serif text-lg text-gray-600 mb-4">{formatDateIS(weekOrders.dates[dayIndex])}</h3>
              
                <div className="overflow-y-auto flex-grow w-full space-y-2">
                        {weekOrders.ordersByDay[day].length > 0 ? (
                            <ul>
                                {weekOrders.ordersByDay[day].map((order, orderIndex) => (
                                    <li key={orderIndex}>
                                        {formatProducts(order).map((product, productIndex) => (
                                            <div
                                                onClick={() => handleOrderClick(order)} // Ensure it's a function that gets called on click
                                                className='flex items-center justify-center font-serif text-xs p-0 md:text-lg p-1 text-white bg-blue-500 rounded-lg cursor-pointer m-1 hover:bg-blue-700'
                                                key={productIndex}
                                            >
                                                {product}
                                            </div>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className='font-serif text-lg'>Engar pantanir</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeekView;
