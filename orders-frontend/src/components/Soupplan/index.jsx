import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const soupOptions = [
    'Aspassúpa',
    'Brauðsúpa',
    'Mexíkósk Kjúklingasúpa',
    'Tómatsúpa',
    'Rjómalöguð Sveppasúpa'
];

const SoupPlanAdmin = () => {
    const [soupPlan, setSoupPlan] = useState({
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: ''
    });

    useEffect(() => {
        axios.get('https://api.kallabakari.is/api/soupPlan/getSoupPlan')
            .then(response => {
                setSoupPlan(response.data);
            })
            .catch(error => {
                console.error('Error fetching soup plan:', error);
            });
    }, []);

    const handleChange = (day, value) => {
        setSoupPlan(prevPlan => ({
            ...prevPlan,
            [day]: value
        }));
    };

    const handleSubmit = () => {
        axios.post('https://api.kallabakari.is/api/soupPlan/updateSoupPlan', soupPlan)
            .then(response => {
                alert('Soup plan updated successfully');
            })
            .catch(error => {
                console.error('Error updating soup plan:', error);
            });
    };

    return (
        <div className='soup-plan-admin'>
            <h2>Update Soup Plan</h2>
            {Object.keys(soupPlan).map(day => (
                <div key={day}>
                    <label>{day}:</label>
                    <select
                        value={soupPlan[day]}
                        onChange={e => handleChange(day, e.target.value)}
                    >
                        <option value="">Select a soup</option>
                        {soupOptions.map((soup, index) => (
                            <option key={index} value={soup}>
                                {soup}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
            <button onClick={handleSubmit}>Save</button>
        </div>
    );
};

export default SoupPlanAdmin;
