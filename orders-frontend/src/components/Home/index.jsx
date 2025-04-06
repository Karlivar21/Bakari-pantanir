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
        <div className="flex min-h-screen">
            <Sidebar className="w-1/5" />
            
            <div className="flex-1 p-6 space-y-6">
                {/* Top control bar */}
                <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md p-4 rounded-2xl mb-6">
                    {/* View selector */}
                    <select
                        onChange={(e) => setView(e.target.value)}
                        value={view}
                        className="text-blue-600 text-lg md:text-xl font-semibold w-40 rounded-xl border border-gray-300 p-2 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="day">Dagur</option>
                        <option value="week">Vika</option>
                        <option value="month">Mánuður</option>
                    </select>

                    {/* Navigation buttons */}
                    {(view === 'day' || view === 'week') && (
                        <NavigationButtons
                            onPrev={() => view === 'day' ? handleChangeDate(-1) : handleChangeWeek(-7)}
                            onNext={() => view === 'day' ? handleChangeDate(1) : handleChangeWeek(7)}
                        />
                    )}
                </div>

                {/* Main content */}
                <div className="flex flex-col items-center">
                    {view === 'day' && <DayView orders={orders} date={selectedDate.toLocaleDateString('is-IS')} />}
                    {view === 'week' && <WeekView weekOrders={weekOrders} />}
                    {view === 'month' && <MonthView orders={orders} />}
                </div>
            </div>
        </div>
    );
};

const NavigationButtons = ({ onPrev, onNext }) => (
    <div className="flex gap-4 mt-4 md:mt-0">
        <button
            onClick={onPrev}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all duration-200"
        >
            Fyrri
        </button>
        <button
            onClick={onNext}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all duration-200"
        >
            Næsti
        </button>
    </div>
);

export default Home;
