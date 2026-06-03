import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import kokur from '../../resources/kokur.json';
import { v4 as uuidv4 } from 'uuid';

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400';
const Label = ({ children }) => (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{children}</label>
);

const AddOrder = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [products, setProducts] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [selectedProductType, setSelectedProductType] = useState('');
    const [productType, setProductType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedCake, setSelectedCake] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [selectedSkreyting, setSelectedSkreyting] = useState('');
    const [cakeDetails, setCakeDetails] = useState({
        cake: '', size: '', filling: '', bottom: '', smjorkrem: '', url: '', text: '', skreyting: ''
    });
    const navigate = useNavigate();

    const handleAddProduct = () => {
        let details = {};
        switch (selectedProductType) {
            case 'cake': details = { ...cakeDetails }; break;
            case 'bread': details = { quantity }; break;
            case 'minidonut': details = { quantity }; break;
            case 'other': details = { other: productType, quantity }; break;
            default: return;
        }
        setProducts([...products, { type: selectedProductType, details }]);
        setSelectedProductType('');
        setProductType('');
        setQuantity('');
        setCakeDetails({ cake: '', size: '', filling: '', bottom: '', smjorkrem: '', url: '', text: '', skreyting: '' });
        setSelectedCake('');
        setSelectedText('');
        setSelectedSkreyting('');
    };

    const handleCakeChange = (e) => { setSelectedCake(e.target.value); setCakeDetails(p => ({ ...p, cake: e.target.value })); };
    const handleSizeChange = (e) => setCakeDetails(p => ({ ...p, size: e.target.value }));
    const handleFillingChange = (e) => setCakeDetails(p => ({ ...p, filling: e.target.value }));
    const handleBottomChange = (e) => setCakeDetails(p => ({ ...p, bottom: e.target.value }));
    const handleSmjorkremChange = (e) => setCakeDetails(p => ({ ...p, smjorkrem: e.target.value }));
    const handleUrlChange = (e) => setCakeDetails(p => ({ ...p, url: e.target.value }));
    const handleTextChange = (e) => { setSelectedText(e.target.value); setCakeDetails(p => ({ ...p, text: e.target.value })); };
    const handleSkreytingChange = (e) => { setSelectedSkreyting(e.target.value); setCakeDetails(p => ({ ...p, skreyting: e.target.value })); };

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
        try {
            await axios.post('https://api.kallabakari.is/api/orders', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/orders');
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    const selectedKaka = kokur.kokur.find(item => item.name === selectedCake);

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

                            <div>
                                <Label>Tegund vöru</Label>
                                <select className={inputCls} value={selectedProductType} onChange={e => setSelectedProductType(e.target.value)}>
                                    <option value="">Veldu tegund</option>
                                    <option value="cake">Kaka</option>
                                    <option value="bread">Brauð</option>
                                    <option value="minidonut">Minidonuts</option>
                                    <option value="other">Annað</option>
                                </select>
                            </div>

                            {selectedProductType === 'cake' && (
                                <div className="space-y-3">
                                    <div>
                                        <Label>Kaka</Label>
                                        <select className={inputCls} value={selectedCake} onChange={handleCakeChange} required>
                                            <option value="">Veldu kökutegund</option>
                                            {kokur.kokur.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                                        </select>
                                    </div>
                                    {selectedKaka && (
                                        <>
                                            <div>
                                                <Label>Stærð</Label>
                                                <select className={inputCls} value={cakeDetails.size} onChange={handleSizeChange} required>
                                                    <option value="">Veldu stærð</option>
                                                    {selectedKaka.size.map(s => (
                                                        <option key={s.size} value={s.size}>{s.size} – {s.price.toFixed(0)} kr.</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {selectedKaka.fillings && (
                                                <div>
                                                    <Label>Fylling</Label>
                                                    <select className={inputCls} value={cakeDetails.filling} onChange={handleFillingChange}>
                                                        <option value="">Veldu fyllingu</option>
                                                        {selectedKaka.fillings.map(f => <option key={f} value={f}>{f}</option>)}
                                                    </select>
                                                </div>
                                            )}
                                            {selectedKaka.botnar && (
                                                <div>
                                                    <Label>Botn</Label>
                                                    <select className={inputCls} value={cakeDetails.bottom} onChange={handleBottomChange}>
                                                        <option value="">Veldu botn</option>
                                                        {selectedKaka.botnar.map(b => <option key={b} value={b}>{b}</option>)}
                                                    </select>
                                                </div>
                                            )}
                                            {selectedKaka.smjorkrem && (
                                                <div>
                                                    <Label>Smjörkrem</Label>
                                                    <select className={inputCls} value={cakeDetails.smjorkrem} onChange={handleSmjorkremChange}>
                                                        <option value="">Veldu smjörkrem</option>
                                                        {selectedKaka.smjorkrem.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                            )}
                                            {selectedCake === 'Afmælistertur' && (
                                                <div>
                                                    <Label>Mynd (URL)</Label>
                                                    <input className={inputCls} type="url" value={cakeDetails.url} onChange={handleUrlChange} placeholder="https://..." />
                                                </div>
                                            )}
                                            {(selectedCake === 'Marsipantertur' || selectedCake === 'Smjörkremskaka') && (
                                                <>
                                                    <div>
                                                        <Label>Texti á köku</Label>
                                                        <input className={inputCls} type="text" value={selectedText} onChange={handleTextChange} />
                                                    </div>
                                                    <div>
                                                        <Label>Skreyting</Label>
                                                        <input className={inputCls} type="text" value={selectedSkreyting} onChange={handleSkreytingChange} />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {selectedProductType === 'bread' && (
                                <div className="space-y-3">
                                    <div>
                                        <Label>Tegund brauðs</Label>
                                        <input className={inputCls} type="text" value={productType} onChange={e => setProductType(e.target.value)} required />
                                    </div>
                                    <div>
                                        <Label>Magn</Label>
                                        <input className={inputCls} type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                                    </div>
                                </div>
                            )}

                            {selectedProductType === 'minidonut' && (
                                <div>
                                    <Label>Magn</Label>
                                    <input className={inputCls} type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                                </div>
                            )}

                            {selectedProductType === 'other' && (
                                <div className="space-y-3">
                                    <div>
                                        <Label>Vöruheiti</Label>
                                        <input className={inputCls} type="text" value={productType} onChange={e => setProductType(e.target.value)} required />
                                    </div>
                                    <div>
                                        <Label>Magn</Label>
                                        <input className={inputCls} type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                                    </div>
                                </div>
                            )}

                            {selectedProductType && (
                                <button
                                    type="button"
                                    onClick={handleAddProduct}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors"
                                >
                                    + Bæta vöru við pöntun
                                </button>
                            )}
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
                                    <li key={index} className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                                        <span className="text-xs font-semibold text-amber-700 uppercase">{product.type}</span>
                                        <div className="mt-1">
                                            {Object.entries(product.details).map(([key, value]) =>
                                                value ? (
                                                    <span key={key} className="block text-xs text-gray-600">
                                                        {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                                                    </span>
                                                ) : null
                                            )}
                                        </div>
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
