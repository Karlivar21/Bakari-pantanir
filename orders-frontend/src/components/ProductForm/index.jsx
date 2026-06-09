import React, { useState } from 'react';
import kokur from '../../resources/kokur.json';

const BITE_ITEMS = [
    { id: 'kleina-lax',           name: 'Kleina með lax' },
    { id: 'mini-burger-chicken',  name: 'Smá hamborgari – kjúklingur' },
    { id: 'mini-burger-pulledpork', name: 'Smá hamborgari – pulled pork' },
    { id: 'tomato-bruschetta',    name: 'Tómat bruschetta' },
    { id: 'belgian-waffle-duck',  name: 'Belgísk vaffla – önd' },
    { id: 'snitta-brie-parma',    name: 'Snitta – brie & parma' },
    { id: 'snitta-beef-truffle',  name: 'Snitta – naut & trufflur' },
    { id: 'soy-chicken-skewer',   name: 'Kjúklingaspjót með soja' },
    { id: 'mini-pavlova',         name: 'Mini pavlova' },
    { id: 'bacon-dates',          name: 'Beikon & daðlur' },
    { id: 'choco-strawberry',     name: 'Súkkulaði & jarðarber' },
    { id: 'date-lakkris',         name: 'Daðlur & lakkrís' },
];

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400';
const Label = ({ children }) => (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{children}</label>
);

export default function ProductForm({ onAdd }) {
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [breadName, setBreadName] = useState('');
    const [biteId, setBiteId] = useState('');
    const [biteQty, setBiteQty] = useState('');
    const [selectedCake, setSelectedCake] = useState('');
    const [cakeDetails, setCakeDetails] = useState({
        cake: '', size: '', filling: '', bottom: '', smjorkrem: '', url: '', text: '', skreyting: '',
    });
    const [otherName, setOtherName] = useState('');

    const selectedKaka = kokur.kokur.find(k => k.name === selectedCake);

    const reset = () => {
        setType('');
        setQuantity('');
        setBreadName('');
        setBiteId('');
        setBiteQty('');
        setSelectedCake('');
        setCakeDetails({ cake: '', size: '', filling: '', bottom: '', smjorkrem: '', url: '', text: '', skreyting: '' });
        setOtherName('');
    };

    const handleAdd = () => {
        let details = {};
        switch (type) {
            case 'cake':
                if (!cakeDetails.cake) return;
                details = { ...cakeDetails };
                break;
            case 'bread':
                if (!breadName || !quantity) return;
                details = { bread: breadName, quantity: Number(quantity) };
                break;
            case 'minidonut':
                if (!quantity) return;
                details = { quantity: Number(quantity) };
                break;
            case 'bite': {
                if (!biteId || !biteQty) return;
                const item = BITE_ITEMS.find(b => b.id === biteId);
                if (!item) return;
                details = { id: biteId, name: item.name, quantity: Number(biteQty) };
                break;
            }
            case 'other':
                if (!otherName || !quantity) return;
                details = { other: otherName, quantity: Number(quantity) };
                break;
            default:
                return;
        }
        onAdd({ type, details });
        reset();
    };

    return (
        <div className="space-y-3">
            <div>
                <Label>Tegund vöru</Label>
                <select className={inputCls} value={type} onChange={e => setType(e.target.value)}>
                    <option value="">Veldu tegund</option>
                    <option value="cake">Kaka</option>
                    <option value="bread">Brauð</option>
                    <option value="minidonut">Minidonuts</option>
                    <option value="bite">Smáréttir</option>
                    <option value="other">Annað</option>
                </select>
            </div>

            {type === 'cake' && (
                <div className="space-y-3">
                    <div>
                        <Label>Kaka</Label>
                        <select
                            className={inputCls}
                            value={selectedCake}
                            onChange={e => { setSelectedCake(e.target.value); setCakeDetails(p => ({ ...p, cake: e.target.value })); }}
                        >
                            <option value="">Veldu kökutegund</option>
                            {kokur.kokur.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                        </select>
                    </div>
                    {selectedKaka && (
                        <>
                            <div>
                                <Label>Stærð</Label>
                                <select className={inputCls} value={cakeDetails.size} onChange={e => setCakeDetails(p => ({ ...p, size: e.target.value }))}>
                                    <option value="">Veldu stærð</option>
                                    {selectedKaka.size.map(s => (
                                        <option key={s.size} value={s.size}>{s.size} – {s.price.toFixed(0)} kr.</option>
                                    ))}
                                </select>
                            </div>
                            {selectedKaka.fillings && (
                                <div>
                                    <Label>Fylling</Label>
                                    <select className={inputCls} value={cakeDetails.filling} onChange={e => setCakeDetails(p => ({ ...p, filling: e.target.value }))}>
                                        <option value="">Veldu fyllingu</option>
                                        {selectedKaka.fillings.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                            )}
                            {selectedKaka.botnar && (
                                <div>
                                    <Label>Botn</Label>
                                    <select className={inputCls} value={cakeDetails.bottom} onChange={e => setCakeDetails(p => ({ ...p, bottom: e.target.value }))}>
                                        <option value="">Veldu botn</option>
                                        {selectedKaka.botnar.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            )}
                            {selectedKaka.smjorkrem && (
                                <div>
                                    <Label>Smjörkrem</Label>
                                    <select className={inputCls} value={cakeDetails.smjorkrem} onChange={e => setCakeDetails(p => ({ ...p, smjorkrem: e.target.value }))}>
                                        <option value="">Veldu smjörkrem</option>
                                        {selectedKaka.smjorkrem.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )}
                            {selectedCake === 'Afmælistertur' && (
                                <div>
                                    <Label>Mynd (URL)</Label>
                                    <input className={inputCls} type="url" value={cakeDetails.url} onChange={e => setCakeDetails(p => ({ ...p, url: e.target.value }))} placeholder="https://..." />
                                </div>
                            )}
                            {(selectedCake === 'Marsipantertur' || selectedCake === 'Smjörkremskaka') && (
                                <>
                                    <div>
                                        <Label>Texti á köku</Label>
                                        <input className={inputCls} type="text" value={cakeDetails.text} onChange={e => setCakeDetails(p => ({ ...p, text: e.target.value }))} />
                                    </div>
                                    <div>
                                        <Label>Skreyting</Label>
                                        <input className={inputCls} type="text" value={cakeDetails.skreyting} onChange={e => setCakeDetails(p => ({ ...p, skreyting: e.target.value }))} />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {type === 'bread' && (
                <div className="space-y-3">
                    <div>
                        <Label>Tegund brauðs</Label>
                        <select className={inputCls} value={breadName} onChange={e => setBreadName(e.target.value)}>
                            <option value="">Veldu brauðtegund</option>
                            <option value="Ólífubrauð">Ólífubrauð</option>
                            <option value="Snittubrauð">Snittubrauð</option>
                        </select>
                    </div>
                    <div>
                        <Label>Magn</Label>
                        <input className={inputCls} type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
                    </div>
                </div>
            )}

            {type === 'minidonut' && (
                <div>
                    <Label>Magn</Label>
                    <input className={inputCls} type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
                </div>
            )}

            {type === 'bite' && (
                <div className="space-y-3">
                    <div>
                        <Label>Tegund smáréttis</Label>
                        <select className={inputCls} value={biteId} onChange={e => setBiteId(e.target.value)}>
                            <option value="">Veldu smárétt</option>
                            {BITE_ITEMS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label>Magn (stk.)</Label>
                        <input className={inputCls} type="number" min="1" value={biteQty} onChange={e => setBiteQty(e.target.value)} />
                    </div>
                </div>
            )}

            {type === 'other' && (
                <div className="space-y-3">
                    <div>
                        <Label>Vöruheiti</Label>
                        <input className={inputCls} type="text" value={otherName} onChange={e => setOtherName(e.target.value)} />
                    </div>
                    <div>
                        <Label>Magn</Label>
                        <input className={inputCls} type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
                    </div>
                </div>
            )}

            {type && (
                <button
                    type="button"
                    onClick={handleAdd}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors"
                >
                    + Bæta vöru við pöntun
                </button>
            )}
        </div>
    );
}
