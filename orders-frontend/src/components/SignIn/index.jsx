// SignIn.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext';
import coverlogo from '../../resources/coverlogo.png';

const SignIn = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignIn = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('https://api.kallabakari.is/auth/login', formData);
            login(res.data.token); // Update context to mark user as logged in with token
        } catch (err) {
            console.error('Sign In Error:', err);
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <img src={coverlogo} alt='coverlogo' className='h-100 w-100 rounded-xl' />
            <h2 className='font-serif text-black text-3xl mt-10'>Innskráning</h2>
            <form className='flex flex-col' onSubmit={handleSignIn}>
                <input
                    className='border border-blue rounded-lg h-8 w-25 mt-2 p-2'
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={onChange}
                    required
                />
                <input
                    className='border border-blue rounded-lg h-8 w-25 mt-2 p-2'
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                />
                <button className='flex font-serif text-lg mt-5 items-center justify-center h-8 w-25 border-2 border-blue-500 rounded-lg' type="submit">Skrá inn</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default SignIn;
