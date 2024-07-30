// MonthView.js
import React from 'react';

const MonthView = ({ orders }) => {
    const monthOrders = orders.reduce((acc, order) => {
        const orderDate = new Date(order.date);
        const month = orderDate.toLocaleDateString('is-IS', { month: 'numeric', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(order);
        return acc;
    }, {});

    return (
        <div className="month-view">
            {Object.keys(monthOrders).map(month => (
                <div key={month} className="month-column">
                    <h2>{month}</h2>
                    <ul>
                        {monthOrders[month].map((order, index) => (
                            <li key={index}>
                                {order.name} - 
                                {order.cakes.length > 0 && ` Cake(s)`}
                                {order.breads.length > 0 && ` Bread(s)`}
                                {order.minidonuts.length > 0 && ` Minidonuts`}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default MonthView;
