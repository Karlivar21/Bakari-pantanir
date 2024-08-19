import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import kokur from '../../resources/kokur.json'; // Assuming kokur.json has correct format
import { v4 as uuidv4 } from 'uuid'; 
import './styles.css';

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
    const [payed, setPayed] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [selectedSkreyting, setSelectedSkreyting] = useState('');
    const [cakeDetails, setCakeDetails] = useState({
        cake: '',
        size: '',
        filling: '',
        bottom: '',
        smjorkrem: '',
        url: '',
        text: '',
        skreyting: ''
    });
    const navigate = useNavigate();

    const handleChangeProduct = (productType) => {
        setSelectedProductType(productType);
        console.log('Selected product type:', productType);
    };

    const handleAddProduct = () => {
        let details = {};

        switch (selectedProductType) {
            case 'cake':
                details = { ...cakeDetails };
                break;
            case 'bread':
                details = { quantity: quantity };
                break;
            case 'minidonut':
                details = { quantity: quantity };
                break;
            case 'other':
                details = { other: productType, quantity: quantity };
                break;
            default:
                console.log('Unknown product type:', selectedProductType);
                return;
        }


        const newProduct = {
            type: selectedProductType,
            details,
        };
        console.log('Adding product:', newProduct);
        setProducts([...products, newProduct]);
        // Reset form fields after adding
        setSelectedProductType('');
        setProductType('');
        setQuantity('');
        setCakeDetails({
            cake: '',
            size: '',
            filling: '',
            bottom: '',
            smjorkrem: '',
            url: '',
            text: '',
            skreyting: ''
        });
        setSelectedCake('');
    };

    const handleCakeChange = (e) => {
        setSelectedCake(e.target.value);
        setCakeDetails(prevDetails => ({ ...prevDetails, cake: e.target.value }));
    };

    const handleSizeChange = (e) => {
        setCakeDetails(prevDetails => ({ ...prevDetails, size: e.target.value }));
    };

    const handleFillingChange = (e) => {
        setCakeDetails(prevDetails => ({ ...prevDetails, filling: e.target.value }));
    };

    const handleBottomChange = (e) => {
        setCakeDetails(prevDetails => ({ ...prevDetails, bottom: e.target.value }));
    };

    const handleSmjorkremChange = (e) => {
        setCakeDetails(prevDetails => ({ ...prevDetails, smjorkrem: e.target.value }));
    };

    const handleUrlChange = (e) => {
        setCakeDetails(prevDetails => ({ ...prevDetails, url: e.target.value }));
    };

    const handleTextChange = (e) => {
        setCakeDetails(prevDetails => ({ ...prevDetails, text: e.target.value }));
    };

    const handleSkreytingChange = (e) => {
        setCakeDetails(prevDetails => ({ ...prevDetails, skreyting: e.target.value }));
    };



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
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Order added successfully');
            navigate('/');
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col md:flex-row p-6">
                {/* Form Container */}
                <div className="form-container flex-1 md:w-2/3">
                    <h1 className="text-3xl font-bold font-serif mb-4">Bæta við pöntun</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col w-full">
                        <div className="flex flex-wrap bg-gray-200 rounded-lg p-2">
                            <div className="flex flex-row items-center w-1/2">
                                <label className='mt-4 font-serif text-xl m-2'>Nafn</label>
                                <input className='border border-blue rounded-lg h-8 w-full mt-2 p-2 mr-3' type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="flex flex-row w-1/2">
                                <label className='mt-4 font-serif items-center text-xl m-2'>Símanúmer</label>
                                <input className='border border-blue rounded-lg h-8 w-full mt-2 p-2' type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                            <div className="flex flex-row w-1/2">
                                <label className='mt-2 font-serif text-xl m-2'>Netfang</label>
                                <input className='border border-blue rounded-lg h-8 w-full mt-2 p-2' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="flex flex-row w-1/2">
                                <label className='mt-2 font-serif text-xl m-2'>Dagsetning</label>
                                <input className='border border-blue rounded-lg h-8 w-full mt-2 p-2' type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                            </div>
                            <div className="flex flex-row w-1/3">
                                <label className='mt-4 font-serif text-xl m-2'>Greitt?</label>
                                <input className='border border-blue rounded-lg h-8 w-1/5 mt-2 p-2' type="checkbox" value={payed} onChange={(e) => setPayed(e.target.checked)} />
                            </div>
                            <div className="flex flex-row w-2/3">
                                <label className='mt-4 font-serif text-xl mr-3'>Athugasemd</label>
                                <textarea className='border border-blue rounded-lg h-24 w-full mt-2 p-2' value={userMessage} onChange={(e) => setUserMessage(e.target.value)} />
                            </div>
                        </div>
                        {/* Add Product Section */}
                        <div className="flex flex-col mt-4 bg-gray-200 rounded-lg p-2">
                            <div className="flex flex-col">
                                <label className='font-serif text-xl font-semibold'>Vörur</label>
                                <select className='border border-blue rounded-lg h-10 w-2/5 mt-2 p-2'
                                    onChange={(e) => handleChangeProduct(e.target.value)}
                                    value={selectedProductType}

                                >
                                    <option value="">Select type</option>
                                    <option value="cake">Kökur</option>
                                    <option value="bread">Brauð</option>
                                    <option value="minidonut">Minidonuts</option>
                                    <option value="other">Annað</option>
                                </select>
                            </div>
                            {selectedProductType === 'cake' && (
                                <div className="flex flex-col mt-4">
                                    <label className='font-serif text-xl'>Kaka:</label>
                                    <select className='border border-blue rounded-lg h-10 w-2/5 p-2 mb-2'
                                        onChange={handleCakeChange}
                                        value={selectedCake}
                                        required
                                    >
                                        <option value="">Veldu tegund</option>
                                        {kokur.kokur.map((item) => (
                                            <option key={item.id} value={item.name}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedCake && (
                                        <>
                                            <div className="flex flex-col w-full mb-2">
                                                <label className="font-serif text-xl" htmlFor="size">Stærð:</label>
                                                <select className="w-2/5 h-10 border border-blue rounded-lg font-serif text-lg" id="size" name="cake_size" onChange={handleSizeChange} value={cakeDetails.size} required>
                                                    <option value="">Veldu stærð</option>
                                                    {kokur.kokur.find(item => item.name === selectedCake)?.size.map((sizeItem) => (
                                                        <option key={sizeItem.size} value={sizeItem.size}>
                                                            {sizeItem.size} - {sizeItem.price.toFixed(3)} kr.
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {kokur.kokur.find(item => item.name === selectedCake)?.fillings && (
                                                <div className="flex flex-col w-full mb-2">
                                                    <label className="font-serif text-xl" htmlFor="filling">Fylling:</label>
                                                    <select className="w-2/5 h-10 mb-2 border border-blue rounded-lg font-serif text-lg" id="filling" name="filling" onChange={handleFillingChange} value={cakeDetails.filling}>
                                                        <option value="">Veldu fyllingu</option>
                                                        {kokur.kokur.find(item => item.name === selectedCake)?.fillings.map((filling) => (
                                                            <option key={filling} value={filling}>
                                                                {filling}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {kokur.kokur.find(item => item.name === selectedCake)?.botnar && (
                                                <div className="flex flex-col w-full mb-2">
                                                    <label className="text-white font-serif text-lg uppercase" htmlFor="bottom">Botn:</label>
                                                    <select className="w-2/5 h-10 border border-blue rounded-lg font-serif text-lg" id="bottom" name="bottom" onChange={handleBottomChange} value={cakeDetails.bottom}>
                                                        <option value="">Veldu botn</option>
                                                        {kokur.kokur.find(item => item.name === selectedCake)?.botnar.map((botn) => (
                                                            <option key={botn} value={botn}>
                                                                {botn}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {kokur.kokur.find(item => item.name === selectedCake)?.smjorkrem && (
                                                <div className="flex flex-col w-full">
                                                    <label className="text-white font-serif text-lg uppercase" htmlFor="smjorkrem">Smjörkrem:</label>
                                                    <select className="w-2/5 h-10 mb-2 border border-blue rounded-lg font-serif text-lg" id="smjorkrem" name="smjorkrem" onChange={handleSmjorkremChange} value={cakeDetails.smjorkrem}>
                                                        <option value="">Veldu smjörkrem</option>
                                                        {kokur.kokur.find(item => item.name === selectedCake)?.smjorkrem.map((smjorkrem) => (
                                                            <option key={smjorkrem} value={smjorkrem}>
                                                                {smjorkrem}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {selectedCake === 'Afmælistertur' && (
                                                <div className="flex flex-col w-full">
                                                    <label className="text-white font-serif text-lg uppercase" htmlFor="url">Mynd:</label>
                                                    <input type="url" className="w-full h-12 mb-2 p-1 border-none font-serif text-lg placeholder-black" id="url" name="url" onChange={handleUrlChange} value={cakeDetails.url} placeholder="Sláðu inn slóð" />
                                                </div>
                                            )}
                                            {(selectedCake === 'Marsipantertur' || selectedCake === 'Smjörkremskaka') && (
                                                    <>
                                                        <div className="flex flex-col w-full mb-2">
                                                            <label className="text-black font-serif text-lg" htmlFor="texti">Texti á köku:</label>
                                                            <input 
                                                                type="text" 
                                                                className="w-2/5 h-12 mb-2 p-1 border border-blue rounded-lg font-serif text-lg placeholder-black" 
                                                                id="texti" 
                                                                name="texti" 
                                                                onChange={handleTextChange} 
                                                                value={selectedText}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col w-full mb-2">
                                                            <label className="text-black font-serif text-lg" htmlFor="skreyting">Skreyting:</label>
                                                            <input 
                                                                type="skreyting" 
                                                                className="w-2/5 h-12 mb-2 p-1 border border-blue rounded-lg font-serif text-lg placeholder-black" 
                                                                id="skreyting" 
                                                                name="skreyting" 
                                                                onChange={handleSkreytingChange}
                                                                value={selectedSkreyting}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                        </>
                                    )}
                                </div>
                            )}
                            {selectedProductType === 'bread' && (
                                <div className="flex flex-col mt-4">
                                    <label className='font-serif text-xl'>Brauðupplýsingar</label>
                                    <label className='font-serif text-xl'>Tegund:</label>
                                    <input className='border border-blue rounded-lg h-8 w-2/5 mt-2 p-2' type="text" placeholder='Veldu tegund' onChange={(e) => setProductType(e.target.value)} value={productType} required />
                                    <label className='font-serif text-xl'>Magn:</label>
                                    <input className='border border-blue rounded-lg h-8 w-2/5 mt-2 p-2' type="number" placeholder='Veldu magn' onChange={(e) => setQuantity(e.target.value)} value={quantity} required />
                                </div>
                            )}
                            {selectedProductType === 'minidonut' && (
                                <div className="flex flex-col mt-4">
                                    <label className='font-serif text-xl'>Minidonuts</label>
                                    <input className='border border-blue rounded-lg h-8 w-2/5 mt-2 p-2' type="number" placeholder='Magn' onChange={(e) => setQuantity(e.target.value)} value={quantity} required />
                                </div>
                            )}
                            {selectedProductType === 'other' && (
                                <div className="flex flex-col mt-4">
                                    <label className='font-serif text-xl'>Annað</label>
                                    <input className='border border-blue rounded-lg h-8 w-2/5 mt-2 p-2' placeholder='Skrifaðu niður vöru' type="text" value={productType} onChange={(e) => setProductType(e.target.value)} required />
                                    <label className='font-serif text-xl mt-2'>Magn:</label>
                                    <input className='border border-blue rounded-lg h-8 w-2/5 mt-2 p-2' type="number" placeholder='Veldu magn' onChange={(e) => setQuantity(e.target.value)} value={quantity} required />
                                </div>

                            )}
                        </div>

                        <button type="button" className="flex font-serif text-white text-lg mt-5 items-center justify-center h-8 w-25 bg-blue-500 rounded-lg hover:bg-blue-600" onClick={handleAddProduct}>
                            Bæta við Vöru
                        </button>

                        <button type="submit" className="flex font-serif text-white text-lg mt-5 items-center justify-center h-8 w-25 bg-blue-500 rounded-lg hover:bg-blue-600">Bæta við Pöntun</button>
                    </form>
                </div>

                {/* Products List */}
                {/* Products List */}
                <div className="products-list bg-gray-200 rounded-lg p-2 md:w-1/3 mt-6 md:mt-0 md:ml-6">
                    <h2 className="text-2xl font-bold mb-4">Pöntun</h2>
                    {products.length > 0 ? (
                        <div className="flex flex-col w-full max-w-4xl border-2 border-blue-700 rounded-lg p-4 space-y-4 bg-white shadow-lg">
                            {products.map((product, index) => (
                                <div key={index} className="flex flex-col border border-blue-700 rounded-lg p-4 space-y-4 bg-gray-100">
                                    <p>
                                        <strong>Type:</strong> {product.type} <br />
                                        {Object.entries(product.details).map(([key, value]) => {
                                            const displayValue = typeof value === 'object' ? JSON.stringify(value) : value;
                                            return (
                                                <span key={key}><strong>{key}:</strong> {displayValue} <br /></span>
                                            );
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='font-serif font-lg'>Engar vörur komnar í pöntun...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddOrder;
