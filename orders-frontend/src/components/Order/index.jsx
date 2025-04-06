import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { useAlert } from '../Alert/AlertContext';

const OrderView = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedOrder, setEditedOrder] = useState({});
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://api.kallabakari.is/api/orders');
                const foundOrder = response.data.find((order) => order.id === orderId);
                setOrder(foundOrder);
                setEditedOrder(foundOrder); // Initialize editedOrder when fetching
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [orderId]);

    const handleRemoveOrder = async () => {
        try {
            await axios.delete(`https://api.kallabakari.is/api/orders/${orderId}`);
            showAlert('Pöntun hefur verið eydd!', 'success');
            navigate('/');
        } catch (error) {
            console.error('Error removing the order:', error);
            showAlert('Mistókst að eyða pöntun!', 'error');
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedOrder(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`https://api.kallabakari.is/api/orders/${orderId}`, editedOrder);
            setOrder(editedOrder);
            setIsEditing(false);
            showAlert('Pöntun hefur verið uppfærð!', 'success');
        } catch (error) {
            console.error('Error updating order:', error);
            showAlert('Það mistókst að uppfæra pöntunina', 'error');
        }
    };

    const formatDate = (date) => {
        const [day, month, year] = date.split('/');
        const parsedDate = new Date(`${year}-${month}-${day}`);
        const monthNames = [
            'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
            'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
        ];
        const formattedMonth = monthNames[parsedDate.getMonth()];
        return `${parsedDate.getDate()} ${formattedMonth}`;
    };

    const formatProducts = (order) => {
        if (!order || !order.products) return [];

        const products = [];

        order.products.forEach((product) => {
            switch (product.type) {
                case 'cake':
                    const cake = product.details;
                    if (cake.cake === 'Sykurmassamynd') {
                        products.push(`${cake.cake}`);
                    } else {
                        products.push(`${cake.cake} - Stærð: ${cake.size}${cake.filling ? `, Fylling: ${cake.filling}` : ''}${cake.bottom ? `, Botn: ${cake.bottom}` : ''}${cake.smjorkrem ? `, Smjörkrem: ${cake.smjorkrem}` : ''}${cake.text ? `, Texti: ${cake.text}` : ''}${cake.skreyting ? `, Skreyting: ${cake.skreyting}` : ''}`);
                    }
                    break;
                case 'bread':
                    const bread = product.details;
                    products.push(`${bread.bread} - Magn: ${bread.quantity}`);
                    break;
                case 'minidonut':
                    const minidonut = product.details;
                    products.push(`Minidonuts - Magn: ${minidonut.quantity}`);
                    break;
                default:
                    products.push(`${product.details.other} - Magn: ${product.details.quantity}`);
            }
        });

        return products;
    };

    if (!order) {
        return <p>Loading order details...</p>;
    }

    return (
        <div className="flex bg-gray-800">
            <Sidebar />
            <div className="flex flex-col items-center ml-12 mt-5 p-6">
                <h2 className="text-2xl text-white font-serif font-bold mb-4">Pöntunar upplýsingar</h2>
                <div className="rounded-lg p-4 bg-white shadow-lg">
                    <div className="flex flex-col border border-blue-700 rounded-lg p-4 space-y-4 bg-gray-100">
                        <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                            {isEditing ? (
                                <>
                                    <input
                                        className="block w-full mb-2 p-2 rounded"
                                        type="text"
                                        name="name"
                                        value={editedOrder.name || ''}
                                        onChange={handleInputChange}
                                        placeholder="Name"
                                    />
                                    <input
                                        className="block w-full mb-2 p-2 rounded"
                                        type="text"
                                        name="phone"
                                        value={editedOrder.phone || ''}
                                        onChange={handleInputChange}
                                        placeholder="Phone"
                                    />
                                    <input
                                        className="block w-full mb-2 p-2 rounded"
                                        type="email"
                                        name="email"
                                        value={editedOrder.email || ''}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                    />
                                    <input
                                        className="block w-full mb-2 p-2 rounded"
                                        type="date"
                                        name="date"
                                        value={editedOrder.date ? new Date(editedOrder.date).toISOString().split('T')[0] : ''}
                                        onChange={handleInputChange}
                                    />
                                    <textarea
                                        className="block w-full mb-2 p-2 rounded"
                                        name="user_message"
                                        value={editedOrder.user_message || ''}
                                        onChange={handleInputChange}
                                        placeholder="Message"
                                    />
                                    <label className="block text-sm font-serif">
                                        Greitt:
                                        <input
                                            type="checkbox"
                                            name="payed"
                                            checked={editedOrder.payed || false}
                                            onChange={handleInputChange}
                                            className="ml-2"
                                        />
                                    </label>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold font-serif text-lg">{order.name}</p>
                                    <p className="font-serif">Símanúmer: {order.phone}</p>
                                    <p className="font-serif">Netfang: {order.email}</p>
                                    <p className="font-serif">Dagsetning: {formatDate(new Date(order.date).toLocaleDateString())}</p>
                                    <p className='font-serif'>Greitt: {order.payed ? 'Já' : 'Nei'}</p>
                                    <p className="font-serif">Athugasemdir: {order.user_message}</p>
                                </>
                            )}
                        </div>

                        <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                            {formatProducts(order).map((product, index) => (
                                <p className="font-serif text-lg" key={index}>{product}</p>
                            ))}
                        </div>

                        {order.image && (
                            <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                                <a 
                                    href={`https://api.kallabakari.is/${order.image}`}
                                    download={order.image.split('/').pop()}
                                    className='flex bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                                >
                                    Download Image
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 mt-4">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={handleSaveChanges}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Save
                            </button>
                            <button 
                                onClick={handleEditToggle}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleEditToggle}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Edit
                        </button>
                    )}

                    <button 
                        onClick={handleRemoveOrder}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Remove Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderView;
