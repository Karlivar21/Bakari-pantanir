import React from 'react';

const MonthView = ({ orders, today }) => {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    return (
        <div className="month-view">
            <h2>Orders for This Month</h2>
            <h3>{today.toLocaleDateString('is-IS', { year: 'numeric', month: 'long' })}</h3>
            {monthOrders.length > 0 ? (
                <ul>
                    {monthOrders.map((order, index) => (
                        <li key={index}>
                            {order.name} - 
                            {order.cakes.length > 0 && ` Cake(s)`}
                            {order.breads.length > 0 && ` Bread(s)`}
                            {order.minidonuts.length > 0 && ` Minidonuts`}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No orders</p>
            )}
        </div>
    );
};

export default MonthView;
