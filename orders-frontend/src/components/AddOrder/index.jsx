import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import './styles.css';

const AddOrder = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [cakes, setCakes] = useState([]);
    const [breads, setBreads] = useState([]);
    const [minidonuts, setMinidonuts] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newOrder = {
            name,
            phone,
            email,
            date,
            cakes,
            breads,
            minidonuts,
            user_message: userMessage,
        };

        try {
            // await axios.post('http://137.184.137.28:5010/api/orders', newOrder);
            navigate('/');
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    return (
        <div className="add-order-container">
            <Sidebar />
            <div className="add-order-content">
                <h1>Bæta við Pöntun</h1>
                <form onSubmit={handleSubmit} className="order-form">
                    <label>Nafn</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label>Símanúmer</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                    <label>Dagsetning</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

                    <label>Vara</label>
                    <input type="text" placeholder="Vara" />

                    <label>Magn</label>
                    <input type="number" placeholder="Magn" />

                    <label>Skilaboð</label>
                    <textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)}></textarea>

                    <button type="submit" className="submit-btn" onClick={handleSubmit}>Add Order</button>
                </form>
            </div>
        </div>
    );
};

export default AddOrder;
