import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import { v4 as uuidv4 } from 'uuid';
import ProductForm from '../ProductForm';

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400';
const Label = ({ children }) => (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{children}</label>
);

const formatProduct = (product) => {
    switch (product.type) {
        case 'cake': return `Kaka: ${product.details.cake}${product.details.size ? ` (${product.details.size})` : ''}`;
        case 'bread': return `Brauð: ${product.details.bread} × ${product.details.quantity}`;
        case 'minidonut': return `Minidonuts × ${product.details.quantity}`;
        case 'bite': return `Smáréttur: ${product.details.name} × ${product.details.quantity}`;
        default: return `${product.details.other} × ${product.details.quantity}`;
    }
};

const AddOrder = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [products, setProducts] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', uuidv4());
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('date', date);
        formData.append('products', JSON.stringify(products));
        formData.append('user_message', userMessage);
        formData.append('payed', false);
        formData.append('paymentStatus', 'unpaid');
        try {
            await axios.post('https://api.kallabakari.is/api/orders', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/orders');
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-8">
                <h1 className="text-xl font-semibold text-gray-900 mb-6">Bæta við pöntun</h1>

                <form onSubmit={handleSubmit} className="flex gap-6 items-start">
                    <div className="flex-1 max-w-xl space-y-4">
                        {/* Customer info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Viðskiptavinur</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Nafn</Label>
                                    <input className={inputCls} type="text" value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                                <div>
                                    <Label>Símanúmer</Label>
                                    <input className={inputCls} type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
                                </div>
                                <div>
                                    <Label>Netfang</Label>
                                    <input className={inputCls} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <Label>Dagsetning</Label>
                                    <input className={inputCls} type="date" value={date} onChange={e => setDate(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <Label>Athugasemd</Label>
                                <textarea className={`${inputCls} resize-none`} value={userMessage} onChange={e => setUserMessage(e.target.value)} rows={3} />
                            </div>
                        </div>

                        {/* Add product */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bæta við vöru</h2>
                            <ProductForm onAdd={(product) => setProducts(prev => [...prev, product])} />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                        >
                            Vista pöntun
                        </button>
                    </div>

                    {/* Order summary */}
                    <div className="w-72 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Pöntun</h2>
                        {products.length > 0 ? (
                            <ul className="space-y-2">
                                {products.map((product, index) => (
                                    <li key={index} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 gap-2">
                                        <span className="text-xs text-gray-700">{formatProduct(product)}</span>
                                        <button
                                            type="button"
                                            onClick={() => setProducts(prev => prev.filter((_, i) => i !== index))}
                                            className="text-red-400 hover:text-red-600 text-xs flex-shrink-0"
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-gray-400">Engar vörur komnar í pöntun</p>
                        )}
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AddOrder;
