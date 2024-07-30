import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import DayView from '../Day';
import WeekView from '../Week';
import MonthView from '../Month';
import './styles.css';

const Home = () => {
    const [orders, setOrders] = useState([]);
    const [weekOrders, setWeekOrders] = useState([]);
    const [view, setView] = useState('week');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

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
        const days = ['Sunnudagur', 'Mánudagur', 'Þriðjudagur', 'Miðvikudagur', 'Fimmtudagur', 'Föstudagur', 'Laugardagur'];
        const weekDays = [];
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(weekStart.getDate() + i);
            weekDays.push(days[currentDay.getDay()]);
            dates.push(currentDay.toLocaleDateString('is-IS', { year: 'numeric', month: 'numeric', day: 'numeric' }));
        }

        const ordersByDay = weekDays.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {});

        orders.forEach(order => {
            const orderDate = new Date(order.date);
            if (orderDate >= weekStart && orderDate < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)) {
                const day = days[orderDate.getDay()];
                ordersByDay[day].push(order);
            }
        });

        setWeekOrders({ weekDays, dates, ordersByDay });
    };

    const handleNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);
        setSelectedDate(nextDay);
    };

    const handlePrevDay = () => {
        const prevDay = new Date(selectedDate);
        prevDay.setDate(selectedDate.getDate() - 1);
        setSelectedDate(prevDay);
    };

    const handleNextWeek = () => {
        const nextWeek = new Date(currentWeekStart);
        nextWeek.setDate(currentWeekStart.getDate() + 7);
        setCurrentWeekStart(nextWeek);
    };

    const handlePrevWeek = () => {
        const prevWeek = new Date(currentWeekStart);
        prevWeek.setDate(currentWeekStart.getDate() - 7);
        setCurrentWeekStart(prevWeek);
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="view-selector">
                    <select onChange={(e) => setView(e.target.value)} value={view}>
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>
                <div className="view-container">
                    {view === 'day' && <DayView orders={orders} date={selectedDate.toLocaleDateString('is-IS')} />}
                    {view === 'week' && <WeekView weekOrders={weekOrders} />}
                    {view === 'month' && <MonthView orders={orders} />}
                </div>
                <div className="navigation-buttons">
                    {view === 'day' && (
                        <>
                            <button onClick={handlePrevDay}>Previous</button>
                            <button onClick={handleNextDay}>Next</button>
                        </>
                    )}
                    {view === 'week' && (
                        <>
                            <button onClick={handlePrevWeek}>Previous</button>
                            <button onClick={handleNextWeek}>Next</button>
                        </>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default Home;
