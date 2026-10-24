import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';

const formatDate = (date) => {
    const [day, month, year] = date.split('/');
    const parsed = new Date(`${year}-${month}-${day}`);
    const months = ['jan', 'feb', 'mar', 'apr', 'maí', 'jún', 'júl', 'ágú', 'sep', 'okt', 'nóv', 'des'];
    return `${parsed.getDate()} ${months[parsed.getMonth()]}`;
};

const PayBadge = ({ payed }) => (
    <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${
        payed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
    }`}>
        {payed ? 'Já' : 'Nei'}
    </span>
);

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://api.kallabakari.is/api/orders')
            .then(res => { setOrders(res.data); setFilteredOrders(res.data); })
            .catch(err => console.error('Error fetching orders:', err));
    }, []);

    const handleSearch = () => {
        if (searchEmail.trim() === '') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(o =>
                o.email.toLowerCase().includes(searchEmail.toLowerCase())
            ));
        }
    };

    const sorted = filteredOrders.slice().reverse();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-4 pt-[4.5rem] md:p-8 md:pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">Pantanir</h1>
                    <button
                        onClick={() => navigate('/add-order')}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        + Ný pöntun
                    </button>
                </div>

                <div className="flex gap-2 mb-5">
                    <input
                        type="text"
                        placeholder="Leita eftir netfangi..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                    >
                        Leita
                    </button>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                    {sorted.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm truncate">{order.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {formatDate(new Date(order.date).toLocaleDateString())}
                                        {order.pickupTime ? ` · ${order.pickupTime}` : ''}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">{order.email}</p>
                                </div>
                                <PayBadge payed={order.payed} />
                            </div>
                            <button
                                onClick={() => navigate(`/order/${order.id}`)}
                                className="mt-3 w-full bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium py-2 rounded-lg transition-colors"
                            >
                                Skoða →
                            </button>
                        </div>
                    ))}
                    {sorted.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">Engar pantanir fundust</p>
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nafn</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sími</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Netfang</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dagsetning</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sótt</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Greitt</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sorted.map((order) => (
                                <tr key={order._id} className="hover:bg-amber-50/30 transition-colors">
                                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{order.name}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{order.phone}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{order.email}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">
                                        {formatDate(new Date(order.date).toLocaleDateString())}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{order.pickupTime || '—'}</td>
                                    <td className="px-5 py-3.5"><PayBadge payed={order.payed} /></td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button
                                            onClick={() => navigate(`/order/${order.id}`)}
                                            className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
                                        >
                                            Skoða →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default OrderList;
