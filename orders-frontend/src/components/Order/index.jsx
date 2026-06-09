import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import ProductForm from '../ProductForm';
import axios from 'axios';
import { useAlert } from '../Alert/AlertContext';

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400';

const formatDate = (date) => {
    const [day, month, year] = date.split('/');
    const parsed = new Date(`${year}-${month}-${day}`);
    const months = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'];
    return `${parsed.getDate()} ${months[parsed.getMonth()]}`;
};

const formatSingleProduct = (product) => {
    switch (product.type) {
        case 'cake': {
            const c = product.details;
            if (c.cake === 'Sykurmassamynd') return c.cake;
            return `${c.cake} – Stærð: ${c.size}${c.filling ? `, Fylling: ${c.filling}` : ''}${c.bottom ? `, Botn: ${c.bottom}` : ''}${c.smjorkrem ? `, Smjörkrem: ${c.smjorkrem}` : ''}${c.text ? `, Texti: ${c.text}` : ''}${c.skreyting ? `, Skreyting: ${c.skreyting}` : ''}`;
        }
        case 'bread': return `${product.details.bread} – Magn: ${product.details.quantity}`;
        case 'minidonut': return `Minidonuts – Magn: ${product.details.quantity}`;
        case 'bite': {
            const b = product.details;
            return `Smáréttur: ${b.name} – Magn: ${b.quantity}`;
        }
        default: return `${product.details?.other || product.details?.name || 'Vara'} – Magn: ${product.details?.quantity ?? 0}`;
    }
};

const OrderView = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedOrder, setEditedOrder] = useState({});
    const { showAlert } = useAlert();

    useEffect(() => {
        axios.get('https://api.kallabakari.is/api/orders')
            .then(res => {
                const found = res.data.find((o) => o.id === orderId);
                setOrder(found);
                setEditedOrder(found);
            })
            .catch(err => console.error('Error fetching orders:', err));
    }, [orderId]);

    const handleRemoveOrder = async () => {
        if (!window.confirm('Ertu viss um að þú viljir eyða þessari pöntun?')) return;
        try {
            await axios.delete(`https://api.kallabakari.is/api/orders/${orderId}`);
            showAlert('Pöntun hefur verið eydd!', 'success');
            navigate('/orders');
        } catch {
            showAlert('Mistókst að eyða pöntun!', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedOrder(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleRemoveProduct = (index) => {
        setEditedOrder(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index),
        }));
    };

    const handleAddProduct = (product) => {
        setEditedOrder(prev => ({
            ...prev,
            products: [...(prev.products || []), product],
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`https://api.kallabakari.is/api/orders/${orderId}`, editedOrder);
            setOrder(editedOrder);
            setIsEditing(false);
            showAlert('Pöntun hefur verið uppfærð!', 'success');
        } catch {
            showAlert('Það mistókst að uppfæra pöntunina', 'error');
        }
    };

    const handleCancelEdit = () => {
        setEditedOrder(order);
        setIsEditing(false);
    };

    if (!order) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <p className="text-sm text-gray-400">Hleður pöntun...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                        ← Til baka
                    </button>
                    <h1 className="text-xl font-semibold text-gray-900">Pöntunarupplýsingar</h1>
                </div>

                <div className="max-w-2xl space-y-4">
                    {/* Customer info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Viðskiptavinur</h2>
                        {isEditing ? (
                            <div className="space-y-3">
                                <input className={inputCls} type="text" name="name" value={editedOrder.name || ''} onChange={handleInputChange} placeholder="Nafn" />
                                <input className={inputCls} type="text" name="phone" value={editedOrder.phone || ''} onChange={handleInputChange} placeholder="Sími" />
                                <input className={inputCls} type="email" name="email" value={editedOrder.email || ''} onChange={handleInputChange} placeholder="Netfang" />
                                <input className={inputCls} type="date" name="date" value={editedOrder.date ? new Date(editedOrder.date).toISOString().split('T')[0] : ''} onChange={handleInputChange} />
                                <textarea className={`${inputCls} resize-none`} name="user_message" value={editedOrder.user_message || ''} onChange={handleInputChange} placeholder="Athugasemd" rows={3} />
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input type="checkbox" name="payed" checked={editedOrder.payed || false} onChange={handleInputChange} className="rounded accent-amber-500" />
                                    Greitt
                                </label>
                            </div>
                        ) : (
                            <dl className="space-y-2.5">
                                {[
                                    { label: 'Nafn', value: order.name, bold: true },
                                    { label: 'Sími', value: order.phone },
                                    { label: 'Netfang', value: order.email },
                                    { label: 'Dagsetning', value: formatDate(new Date(order.date).toLocaleDateString()) },
                                ].map(({ label, value, bold }) => (
                                    <div key={label} className="flex">
                                        <dt className="w-28 text-sm text-gray-400">{label}</dt>
                                        <dd className={`text-sm ${bold ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{value}</dd>
                                    </div>
                                ))}
                                <div className="flex">
                                    <dt className="w-28 text-sm text-gray-400">Greitt</dt>
                                    <dd>
                                        <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${order.payed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                                            {order.payed ? 'Já' : 'Nei'}
                                        </span>
                                    </dd>
                                </div>
                                {order.user_message && (
                                    <div className="flex">
                                        <dt className="w-28 text-sm text-gray-400">Athugasemd</dt>
                                        <dd className="text-sm text-gray-700">{order.user_message}</dd>
                                    </div>
                                )}
                            </dl>
                        )}
                    </div>

                    {/* Products */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Vörur</h2>
                        {isEditing ? (
                            <div className="space-y-3">
                                {(editedOrder.products || []).length > 0 ? (
                                    <ul className="space-y-2">
                                        {(editedOrder.products || []).map((product, index) => (
                                            <li key={index} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 gap-2">
                                                <span className="text-sm text-gray-700">{formatSingleProduct(product)}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProduct(index)}
                                                    className="text-red-400 hover:text-red-600 text-xs flex-shrink-0"
                                                >
                                                    Fjarlægja
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-400 mb-2">Engar vörur í pöntun</p>
                                )}
                                <div className="border-t border-gray-100 pt-3">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bæta við vöru</p>
                                    <ProductForm onAdd={handleAddProduct} />
                                </div>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {(order.products || []).map((product, index) => (
                                    <li key={index} className="text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                                        {formatSingleProduct(product)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Image download */}
                    {order.image && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Mynd</h2>
                            <a
                                href={order.image}
                                download={order.image.split('/').pop()}
                                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                                Sækja mynd
                            </a>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button onClick={handleSaveChanges} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                    Vista
                                </button>
                                <button onClick={handleCancelEdit} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                    Hætta við
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                Breyta
                            </button>
                        )}
                        <button onClick={handleRemoveOrder} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                            Eyða pöntun
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderView;
