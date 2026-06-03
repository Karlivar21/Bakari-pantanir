import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import DayView from '../Day';
import WeekView from '../Week';
import MonthView from '../Month';
import { useOrders } from '../../hooks/useOrders';

const Home = () => {
    const [view, setView] = useState('week');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const { orders, weekOrders } = useOrders(currentWeekStart);

    const handleChangeDate = (days) => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + days);
            return newDate;
        });
    };

    const handleChangeWeek = (days) => {
        setCurrentWeekStart(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + days);
            return newDate;
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                    <select
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                    >
                        <option value="day">Dagur</option>
                        <option value="week">Vika</option>
                        <option value="month">Mánuður</option>
                    </select>

                    {(view === 'day' || view === 'week') && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => view === 'day' ? handleChangeDate(-1) : handleChangeWeek(-7)}
                                className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                            >
                                ← Fyrri
                            </button>
                            <button
                                onClick={() => view === 'day' ? handleChangeDate(1) : handleChangeWeek(7)}
                                className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                            >
                                Næsta →
                            </button>
                        </div>
                    )}
                </div>

                {view === 'day' && <DayView orders={orders} date={selectedDate.toLocaleDateString('is-IS')} />}
                {view === 'week' && <WeekView weekOrders={weekOrders} />}
                {view === 'month' && <MonthView orders={orders} />}
            </main>
        </div>
    );
};

export default Home;
