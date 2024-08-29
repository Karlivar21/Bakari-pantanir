import React from 'react';
import { useNavigate } from 'react-router-dom';

const MonthView = ({ orders }) => {
    const navigate = useNavigate();
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Add debugging to check the orders array
    console.log('Orders:', orders);

    // Filter orders to only include those in the current month and year
    const monthOrders = (orders || []).filter(order => {
        const orderDate = new Date(order.date);
        console.log('Order Date:', orderDate, 'Valid:', !isNaN(orderDate.getTime()));
        if (isNaN(orderDate.getTime())) {
            console.error('Invalid order date:', order.date);
            return false; // Exclude invalid dates
        }
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    // Debugging log for filtered monthOrders
    const handleOrderClick = (order) => {
        navigate(`/order/${order.id}`);
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-200 p-5 rounded-xl">
            <h2 className='font-serif font-bold text-3xl'>Pantanir</h2>
            <h3 className='font-serif text-2xl'>{today.toLocaleDateString('is-IS', { year: 'numeric', month: 'long' })}</h3>
            {monthOrders.length > 0 ? (
                <ul className='flex flex-wrap items-center justify-center'>
                    {monthOrders.map((order, index) => (
                        <div className='bg-gray-500 w-1/4 m-2 p-2 rounded-lg'>
                            <li className="m-3" key={index}>
                                <p className='font-serif text-white text-lg'>{order.name}</p>
                                <p className='font-serif text-white'>{order.email}</p>
                                <p className='font-serif text-white'>{new Date(order.date).toLocaleDateString()}</p>
                            </li>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => handleOrderClick(order)}>View Details</button>
                        </div>
                    ))}
                </ul>
            ) : (
                <p>No orders</p>
            )}
        </div>
    );
};

export default MonthView;
