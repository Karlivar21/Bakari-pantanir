// WeekView.js
import React from 'react';
import './styles.css'
const WeekView = ({ weekOrders }) => {
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
        <div className="week-view">
            {weekOrders.weekDays && weekOrders.weekDays.map((day, index) => (
                <div key={day} className={`day-column ${index === 0 ? 'today-column' : ''}`}>
                    <h2>{day}</h2>
                    <h3>{weekOrders.dates[index]}</h3>
                    {weekOrders.ordersByDay[day].length > 0 ? (
                        <ul>
                            {weekOrders.ordersByDay[day].map((order, index) => (
                                <li key={index}>
                                    {formatProducts(order).map((product, index) => (
                                        <div key={index}>{product}</div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No orders</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default WeekView;
