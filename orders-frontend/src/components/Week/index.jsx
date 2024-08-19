import React from 'react';
import { useNavigate } from 'react-router-dom';

const WeekView = ({ weekOrders }) => {
    const navigate = useNavigate();

    const formatProducts = (order) => {
        const products = [];
    
        order.products.forEach((product) => {
            switch (product.type) {
                case 'cake':
                    const cake = product.details;
                    if (cake.cake === 'Sykurmassamynd') {
                        products.push(`${cake.cake}`);
                    }
                    else {
                        products.push(`${cake.cake} - Stærð: ${cake.size}`);
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

    const handleOrderClick = (order) => {
        navigate(`/order/${order.id}`);
    };

    return (
        <div className="flex flex-wrap justify-center">
            {weekOrders.weekDays && weekOrders.weekDays.map((day, dayIndex) => (
                <div key={day} className="flex flex-col min-h-32 md:min-h-80 items-center border w-1/3 p-4">
                    <h2 className='font-serif text-sm md:text-xl font-bold'>{day}</h2>
                    <h3 className='font-serif text-md md:text-lg'>{weekOrders.dates[dayIndex]}</h3>
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
            ))}
        </div>
    );
};

export default WeekView;
