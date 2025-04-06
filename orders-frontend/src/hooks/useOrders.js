import { useEffect, useState } from 'react';
import axios from 'axios';

const daysIS = ['Sunnudagur', 'Mánudagur', 'Þriðjudagur', 'Miðvikudagur', 'Fimmtudagur', 'Föstudagur', 'Laugardagur'];

export const useOrders = (currentWeekStart) => {
    const [orders, setOrders] = useState([]);
    const [weekOrders, setWeekOrders] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://api.kallabakari.is/api/orders');
                setOrders(response.data);
                organizeByWeek(response.data, currentWeekStart);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [currentWeekStart]);

    const organizeByWeek = (orders, weekStart) => {
        const normalizedWeekStart = new Date(weekStart);
        normalizedWeekStart.setHours(0, 0, 0, 0);

        const weekDays = [];
        const dates = [];

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(normalizedWeekStart);
            currentDay.setDate(normalizedWeekStart.getDate() + i);
            weekDays.push(daysIS[currentDay.getDay()]);
            dates.push(currentDay.toLocaleDateString('is-IS', { year: 'numeric', month: 'numeric', day: 'numeric' }));
        }

        const ordersByDay = weekDays.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {});

        orders.forEach(order => {
            const orderDate = new Date(order.date);
            orderDate.setHours(0, 0, 0, 0);
            if (orderDate >= normalizedWeekStart && orderDate < new Date(normalizedWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)) {
                const day = daysIS[orderDate.getDay()];
                ordersByDay[day].push(order);
            }
        });

        setWeekOrders({ weekDays, dates, ordersByDay });
    };

    return { orders, weekOrders };
};
