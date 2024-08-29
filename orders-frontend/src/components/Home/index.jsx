import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import DayView from '../Day';
import WeekView from '../Week';
import MonthView from '../Month';

const Home = () => {
    const [orders, setOrders] = useState([]);
    const [weekOrders, setWeekOrders] = useState({});
    const [view, setView] = useState('week');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://api.kallabakari.is/api/orders');
                setOrders(response.data);
                console.log('Orders:', response.data); // Debugging log
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
    
        // Normalize the weekStart date to remove the time component
        const normalizedWeekStart = new Date(weekStart);
        normalizedWeekStart.setHours(0, 0, 0, 0);
    
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(normalizedWeekStart);
            currentDay.setDate(normalizedWeekStart.getDate() + i);
            weekDays.push(days[currentDay.getDay()]);
            dates.push(currentDay.toLocaleDateString('is-IS', { year: 'numeric', month: 'numeric', day: 'numeric' }));
        }
    
        const ordersByDay = weekDays.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {});
    
        orders.forEach(order => {
            const orderDate = new Date(order.date);
            // Normalize the orderDate to remove the time component
            orderDate.setHours(0, 0, 0, 0);
            if (orderDate >= normalizedWeekStart && orderDate < new Date(normalizedWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)) {
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
        <div className="flex min-h-screen bg-gray-800">
            <Sidebar className="w-1/5" /> {/* Sidebar takes 20% of the width */}
            <div className="flex-1 p-4">
                <div className="flex justify-center mb-5">
                    <select
                        onChange={(e) => setView(e.target.value)}
                        value={view}
                        className="text-blue-500 text-lg w-36 rounded-lg border border-gray-300 p-1"
                    >
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>
                <div className="flex flex-col items-center">
                    {view === 'day' && <DayView orders={orders} date={selectedDate.toLocaleDateString('is-IS')} />}
                    {view === 'week' && <WeekView weekOrders={weekOrders} />}
                    {view === 'month' && <MonthView orders={orders}/>}
                </div>
                <div className="flex justify-between mt-5">
                    {view === 'day' && (
                        <>
                            <button
                                onClick={handlePrevDay}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextDay}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Next
                            </button>
                        </>
                    )}
                    {view === 'week' && (
                        <>
                            <button
                                onClick={handlePrevWeek}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextWeek}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Next
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
