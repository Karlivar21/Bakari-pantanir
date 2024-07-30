// DayView.js
import React from 'react';
import './styles.css'

const DayView = ({ orders, date }) => {
    const dayOrders = orders.filter(order => new Date(order.date).toLocaleDateString('is-IS') === date);
    const formatProducts = (order) => {
        const products = [];

        order.cakes.forEach((cake) => {
            products.push(`${cake.cake} - Stærð: ${cake.size}${cake.filling ? `, Fylling: ${cake.filling}` : ''}${cake.bottom ? `, Botn: ${cake.bottom}` : ''}${cake.smjorkrem ? `, Smjörkrem: ${cake.smjorkrem}` : ''}`);
        });

        order.breads.forEach((bread) => {
            products.push(`${bread.bread} - Magn: ${bread.quantity}`);
        });

        order.minidonuts.forEach((minidonut) => {
            products.push(`Minidonuts - Magn: ${minidonut.quantity}`);
        });

        return products;
    };

    return (
        <div className="day-view">
            <h2>{date}</h2>
            {dayOrders.length > 0 ? (
                <ul>
                    {dayOrders.map((order, index) => (
                        <div className="day-column1" key={index}>
                            <div className='day-details'>
                                {order.name}-
                                {order.phone}- 
                                {order.email}
                            </div>
                            <div className='day-products'>
                            {formatProducts(order).map((product, index) => (
                                        <div key={index}>{product}</div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </ul>
            ) : (
                <p>No orders</p>
            )}
        </div>
    );
};

export default DayView;
