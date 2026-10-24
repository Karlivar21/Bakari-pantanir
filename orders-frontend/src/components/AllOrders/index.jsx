import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import { AuthContext } from '../../auth/AuthContext';

const API = 'https://api.kallabakari.is';

const MONTHS = ['jan','feb','mar','apr','maí','jún','júl','ágú','sep','okt','nóv','des'];
const formatDate = iso => {
    const d = new Date(iso);
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};
const formatISK = n => new Intl.NumberFormat('is-IS', { style: 'currency', currency: 'ISK' }).format(n || 0);

const STATUS_LABELS = { pending: 'Í bið', confirmed: 'Staðfest', completed: 'Lokið', cancelled: 'Afbókað' };
const STATUS_CLS = {
    pending:   'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-600',
};
const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

function formatProduct(p) {
    switch (p.type) {
        case 'cake':      return `${p.details.cake}${p.details.size ? ` (${p.details.size})` : ''}`;
        case 'bread':     return `${p.details.bread} × ${p.details.quantity}`;
        case 'minidonut': return `Minidonuts × ${p.details.quantity}`;
        case 'bakkelsi':  return `${p.details.name} × ${p.details.quantity}`;
        case 'salat':     return `${p.details.name} × ${p.details.quantity}`;
        case 'supa':      return `Súpa dagsins × ${p.details.quantity}`;
        case 'bite':      return `${p.details.name} × ${p.details.quantity}`;
        default:          return `${p.details.other || p.details.name || 'Vara'} × ${p.details.quantity ?? 1}`;
    }
}

export default function AllOrders() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all' | 'online' | 'company'

    useEffect(() => {
        Promise.all([
            axios.get(`${API}/api/orders`),
            axios.get(`${API}/api/company/admin/orders`, { headers: { Authorization: token } }),
        ])
            .then(([onlineRes, companyRes]) => {
                const online = onlineRes.data.map(o => ({ ...o, _kind: 'online' }));
                const company = companyRes.data.map(o => ({ ...o, _kind: 'company' }));
                const merged = [...online, ...company].sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                setRows(merged);
            })
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
            setRows(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch {
            alert('Ekki tókst að uppfæra stöðu');
        } finally {
            setUpdatingId(null);
        }
    };

    const visible = rows.filter(o =>
        filter === 'all' ? true :
        filter === 'online' ? o._kind === 'online' :
        o._kind === 'company'
    );

    const onlineCount = rows.filter(o => o._kind === 'online').length;
    const companyCount = rows.filter(o => o._kind === 'company').length;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-4 pt-[4.5rem] md:p-8 md:pt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">Allar pantanir</h1>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'all',     label: `Allar (${rows.length})` },
                            { key: 'online',  label: `Vefpantanir (${onlineCount})` },
                            { key: 'company', label: `Fyrirtæki (${companyCount})` },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                    filter === key
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-white border border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-700'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tegund</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nafn</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dagsetning</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sótt</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Upphæð</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staða</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={7} className="px-5 py-8 text-sm text-gray-400 text-center">Hleður...</td></tr>
                            ) : visible.length === 0 ? (
                                <tr><td colSpan={7} className="px-5 py-8 text-sm text-gray-400 text-center">Engar pantanir</td></tr>
                            ) : visible.map(order => (
                                <React.Fragment key={order._id}>
                                    <tr className="hover:bg-amber-50/30 transition-colors">
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${
                                                order._kind === 'online'
                                                    ? 'bg-purple-50 text-purple-700'
                                                    : 'bg-sky-50 text-sky-700'
                                            }`}>
                                                {order._kind === 'online' ? 'Vefpöntun' : 'Fyrirtæki'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                                            {order._kind === 'online' ? order.name : order.companyId?.name || '—'}
                                        </td>
                                        <td className="px-4 py-3.5 text-sm text-gray-500">
                                            {formatDate(order.date)}
                                        </td>
                                        <td className="px-4 py-3.5 text-sm text-gray-500">
                                            {order.pickupTime
                                                ? `${order._kind === 'company' && order.deliveryType === 'delivery' ? 'Sent' : 'Sótt'} ${order.pickupTime}`
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3.5 text-sm text-gray-500">
                                            {formatISK(order.totalAmount)}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {order._kind === 'online' ? (
                                                <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${
                                                    order.payed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                                                }`}>
                                                    {order.payed ? 'Greitt' : 'Ógreitt'}
                                                </span>
                                            ) : (
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
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            {order._kind === 'online' ? (
                                                <button
                                                    onClick={() => navigate(`/order/${order.id}`)}
                                                    className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
                                                >
                                                    Skoða →
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                                                    className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
                                                >
                                                    {expanded === order._id ? 'Loka ▲' : 'Vörur ▼'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                    {order._kind === 'company' && expanded === order._id && (
                                        <tr>
                                            <td colSpan={7} className="px-5 pb-4 bg-amber-50/30">
                                                <ul className="space-y-1 pt-2">
                                                    {order.products.map((p, i) => (
                                                        <li key={i} className="text-sm text-gray-700 bg-white border border-amber-100 rounded-lg px-3 py-2">
                                                            {formatProduct(p)}
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
