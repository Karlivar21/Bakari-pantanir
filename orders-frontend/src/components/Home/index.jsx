import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import './styles.css';

const Home = () => {
    const [orders, setOrders] = useState([]);
    const [weekOrders, setWeekOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://137.184.137.28:5010/api/orders');
                setOrders(response.data);
                organizeByDay(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const organizeByDay = (orders) => {
        const today = new Date();
        const days = ['Sunnudagur', 'Mánudagur', 'Þriðjudagur', 'Miðvikudagur', 'Fimmtudagur', 'Föstudagur', 'Laugardagur'];

        // Generate the week days and dates array starting from today
        const weekDays = [];
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(today);
            currentDay.setDate(today.getDate() + i);
            weekDays.push(days[currentDay.getDay()]);
            dates.push(currentDay.toLocaleDateString('is-IS', { year: 'numeric', month: 'numeric', day: 'numeric' }));
        }

        // Organize orders by day
        const ordersByDay = weekDays.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {});

        orders.forEach(order => {
            const orderDate = new Date(order.date);
            if (orderDate >= today && orderDate <= new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)) {
                const day = days[orderDate.getDay()];
                ordersByDay[day].push(order);
            }
        });

        setWeekOrders({ weekDays, dates, ordersByDay });
    };

    return (
        <div className="home-container">
            <Sidebar />
            <div className="home-content">
                <div className="week-overview">
                    {weekOrders.weekDays && weekOrders.weekDays.map((day, index) => (
                        <div key={day} className={`day-column ${index === 0 ? 'today-column' : ''}`}>
                            <h2>{day}</h2>
                            <h3>{weekOrders.dates[index]}</h3>
                            {weekOrders.ordersByDay[day].length > 0 ? (
                                <ul>
                                    {weekOrders.ordersByDay[day].map((order, index) => (
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
