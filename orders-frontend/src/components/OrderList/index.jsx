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

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">Allar pantanir</h1>
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
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 w-64"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                    >
                        Leita
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nafn</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sími</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Netfang</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dagsetning</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Greitt</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.slice().reverse().map((order) => (
                                <tr key={order._id} className="hover:bg-amber-50/30 transition-colors">
                                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{order.name}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{order.phone}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{order.email}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">
                                        {formatDate(new Date(order.date).toLocaleDateString())}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${
                                            order.payed
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-red-50 text-red-600'
                                        }`}>
                                            {order.payed ? 'Já' : 'Nei'}
                                        </span>
                                    </td>
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
