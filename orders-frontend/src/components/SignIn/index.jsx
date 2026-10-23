import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext';
import coverlogo from '../../resources/coverlogo.png';
import { registerPushNotifications } from '../../utils/pushNotifications';

const SignIn = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignIn = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('https://api.kallabakari.is/api/auth/login', formData);
            login(res.data.token);
            registerPushNotifications(res.data.token).catch(() => {});
        } catch {
            setError('Rangt notandanafn eða lykilorð.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
                <div className="flex flex-col items-center mb-7">
                    <img src={coverlogo} alt="Kalla Bakarí" className="h-20 w-auto object-contain mb-4" />
                    <p className="text-gray-400 text-xs mt-0.5">Pantanakerfi</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-3">
                    <input
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-stone-400"
                        type="text"
                        placeholder="Notandanafn"
                        name="username"
                        value={formData.username}
                        onChange={onChange}
                        required
                    />
                    <input
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-stone-400"
                        type="password"
                        placeholder="Lykilorð"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        required
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <button
                        className="w-full bg-stone-600 hover:bg-stone-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-1"
                        type="submit"
                    >
                        Skrá inn
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
