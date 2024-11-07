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

    // Debugging log for filtered monthOrders
    const handleOrderClick = (order) => {
        navigate(`/order/${order.id}`);
    };

    const formatDate = (date) => {
        // Assume the date is in 'DD/MM/YYYY' format
        const [day, month, year] = date.split('/');

        // Create a Date object from the components
        const parsedDate = new Date(`${year}-${month}-${day}`);

        // Array of month names in Icelandic
        const monthNames = [
            'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
            'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
        ];

        // Get the month and format the date accordingly
        const formattedMonth = monthNames[parsedDate.getMonth()];
        return `${parsedDate.getDate()} ${formattedMonth}`;
    };

    const formatDate2 = (date) => {
        // Assume the date is in 'DD/MM/YYYY' format
        const [day, month, year] = date.split('/');

        // Create a Date object from the components
        const parsedDate = new Date(`${year}-${month}-${day}`);

        // Array of month names in Icelandic
        const monthNames = [
            'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
            'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
        ];

        // Get the month and format the date accordingly
        const formattedMonth = monthNames[parsedDate.getMonth()];
        return `${parsedDate.getDate()} ${formattedMonth}`;
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-200 p-5 rounded-xl">
            <h3 className='font-serif font-bold text-4xl'>{formatDate(today.toLocaleDateString())}</h3>
            {monthOrders.length > 0 ? (
                <ul className='flex flex-wrap items-center justify-center'>
                    {monthOrders.map((order, index) => (
                        <div className='bg-gray-500 w-1/4 m-2 p-2 rounded-lg'>
                            <li className="m-3" key={index}>
                                <p className='font-serif text-white text-lg'>{order.name}</p>
                                <p className='font-serif text-white'>{formatDate2(new Date(order.date).toLocaleDateString())}</p>
                                <ul>
                                    {formatProducts(order).map((product, index) => (
                                        <li key={index} className='font-bold font-serif text-white'>{product}</li>
                                    ))}
                                </ul>
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
