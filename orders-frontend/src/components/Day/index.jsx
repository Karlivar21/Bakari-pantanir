import React from 'react';

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
        <div className="flex flex-col items-center p-6">
            <h2 className="text-2xl font-bold mb-4">{date}</h2>
            {dayOrders.length > 0 ? (
                <div className="flex flex-col w-full max-w-4xl border-2 border-blue-700 rounded-lg p-4 space-y-4 bg-white shadow-lg">
                    {dayOrders.map((order, index) => (
                        <div className="flex flex-col md:flex-row border border-blue-700 rounded-lg p-4 space-y-4 md:space-y-0 md:space-x-4 bg-gray-100" key={index}>
                            <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                                <p className="font-semibold text-lg">{order.name}</p>
                                <p>{order.phone}</p>
                                <p>{order.email}</p>
                            </div>
                            <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                                {formatProducts(order).map((product, index) => (
                                    <p key={index} className="text-sm">{product}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No orders</p>
            )}
        </div>
    );
};

export default DayView;
