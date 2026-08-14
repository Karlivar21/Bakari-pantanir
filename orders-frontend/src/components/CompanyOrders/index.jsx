import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { AuthContext } from '../../auth/AuthContext';

const API = 'https://api.kallabakari.is';

const formatISK = n => new Intl.NumberFormat('is-IS', { style: 'currency', currency: 'ISK' }).format(n);

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const months = ['jan','feb','mar','apr','maí','jún','júl','ágú','sep','okt','nóv','des'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
};

function formatSingleProduct(p) {
    switch (p.type) {
        case 'cake': return `${p.details.cake}${p.details.size ? ` (${p.details.size})` : ''}`;
        case 'bread': return `${p.details.bread} × ${p.details.quantity}`;
        case 'minidonut': return `Minidonuts × ${p.details.quantity}`;
        case 'bite':     return `${p.details.name} × ${p.details.quantity}`;
        case 'bakkelsi': return `${p.details.name} × ${p.details.quantity}`;
        case 'salat':    return `${p.details.name} × ${p.details.quantity}`;
        case 'supa':     return `Súpa dagsins × ${p.details.quantity}`;
        default: return `${p.details.other || p.details.name || 'Vara'} × ${p.details.quantity ?? 1}`;
    }
}

const STATUS_LABELS = { pending: 'Í bið', confirmed: 'Staðfest', completed: 'Lokið', cancelled: 'Afbókað' };
const STATUS_CLS = {
    pending:   'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-600',
};

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function CompanyOrders() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        axios.get(`${API}/api/company/admin/orders`, { headers: { Authorization: token } })
            .then(res => setOrders(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token]);

    const handleStatusChange = async (orderId, status) => {
        setUpdatingId(orderId);
        try {
            await axios.patch(
                `${API}/api/company/admin/orders/${orderId}/status`,
                { status },
                { headers: { Authorization: token } }
            );
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch {
            alert('Ekki tókst að uppfæra stöðu');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-8">
                <h1 className="text-xl font-semibold text-gray-900 mb-6">Fyrirtækjapantanir</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fyrirtæki</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dagsetning</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Afhending</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Upphæð</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staða</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={6} className="px-5 py-8 text-sm text-gray-400 text-center">Hleður...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={6} className="px-5 py-8 text-sm text-gray-400 text-center">Engar fyrirtækjapantanir</td></tr>
                            ) : orders.slice().reverse().map(order => (
                                <React.Fragment key={order._id}>
                                    <tr className="hover:bg-amber-50/30 transition-colors">
                                        <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                                            {order.companyId?.name || '—'}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-gray-500">
                                            {formatDate(order.date)}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-gray-500">
                                            {order.pickupTime
                                                ? `${order.deliveryType === 'delivery' ? 'Sent' : 'Sótt'} kl. ${order.pickupTime}`
                                                : '—'}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-gray-500">
                                            {formatISK(order.totalAmount)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <select
                                                value={order.status}
                                                disabled={updatingId === order._id}
                                                onChange={e => handleStatusChange(order._id, e.target.value)}
                                                className={`text-xs font-medium px-2 py-1 rounded-lg border-0 focus:ring-2 focus:ring-amber-300 ${STATUS_CLS[order.status] || ''}`}
                                            >
                                                {STATUSES.map(s => (
                                                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button
                                                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                                                className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
                                            >
                                                {expanded === order._id ? 'Loka ▲' : 'Vörur ▼'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expanded === order._id && (
                                        <tr>
                                            <td colSpan={6} className="px-5 pb-4 bg-amber-50/30">
                                                <ul className="space-y-1 pt-2">
                                                    {order.products.map((p, i) => (
                                                        <li key={i} className="text-sm text-gray-700 bg-white border border-amber-100 rounded-lg px-3 py-2">
                                                            {formatSingleProduct(p)}
                                                        </li>
                                                    ))}
                                                </ul>
                                                {order.note && (
                                                    <p className="text-xs text-gray-400 italic mt-2 px-1">"{order.note}"</p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
