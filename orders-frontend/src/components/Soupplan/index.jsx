import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';

const soupOptions = [
  'Aspassúpa',
  'Brauðsúpa',
  'Mexíkósk Kjúklingasúpa',
  'Tómatsúpa',
  'Rjómalöguð Sveppasúpa'
];

const SoupPlanAdmin = () => {
  const [oldsoupPlan, setOldSoupPlan] = useState({
    Mánudagur: '',
    Þriðjudagur: '',
    Miðvikudagur: '',
    Fimmtudagur: '',
    Föstudagur: '',
    week: {
      startDate: '',
      endDate: ''
    }
  });
  const [soupPlan, setSoupPlan] = useState({
    Mánudagur: '',
    Þriðjudagur: '',
    Miðvikudagur: '',
    Fimmtudagur: '',
    Föstudagur: '',
    week: {
      startDate: '',
      endDate: ''
    }
  });

  useEffect(() => {
    axios.get('https://api.kallabakari.is/api/soupPlan')
      .then(response => {
        const fetchedPlan = response.data;
        console.log('Fetched Plan:', fetchedPlan); // Debugging log
        setOldSoupPlan(fetchedPlan);
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

  const handleWeekChange = (field, value) => {
    setSoupPlan(prevPlan => ({
      ...prevPlan,
      week: {
        ...prevPlan.week,
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    axios.post('https://api.kallabakari.is/api/soupPlan', soupPlan)
      .then(response => {
        alert('Soup plan updated successfully');
      })
      .catch(error => {
        console.error('Error updating soup plan:', error);
      });
  };

  return (
    <div className='flex min-h-screen'>
      <Sidebar/> {/* Sidebar takes 20% of the width */}
      <div className='flex flex-col p-4 items-center'>
        <h2 className='text-2xl font-serif font-bold mb-4'>Súpuplan</h2>
        <div className="week-inputs mb-4">
          <label className='mr-2'>Start Date:</label>
          <input
            type="date"
            value={soupPlan.week.startDate}
            onChange={e => handleWeekChange('startDate', e.target.value)}
            className='border border-gray-300 rounded-md px-2 py-1'
          />
          <label className='ml-4 mr-2'>End Date:</label>
          <input
            type="date"
            value={soupPlan.week.endDate}
            onChange={e => handleWeekChange('endDate', e.target.value)}
            className='border border-gray-300 rounded-md px-2 py-1'
          />
        </div>
        {Object.keys(oldsoupPlan).filter(day => day !== 'week').map(day => (
          <div className="soup mb-4" key={day}>
            <label className='mr-2'>{day}:</label>
            <select
              value={soupPlan[day]}
              onChange={e => handleChange(day, e.target.value)}
              className='border border-gray-300 rounded-md px-2 py-1'
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
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SoupPlanAdmin;
