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
        const defaultPlan = {
          Mánudagur: '',
          Þriðjudagur: '',
          Miðvikudagur: '',
          Fimmtudagur: '',
          Föstudagur: '',
          week: {
            startDate: '',
            endDate: ''
          }
        };
        const mergedPlan = { ...defaultPlan, ...fetchedPlan };
        console.log('Merged Plan:', mergedPlan); // Debugging log
        setSoupPlan(mergedPlan);
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
    <div className='soup-plan-admin'>
      <h2>Súpuplan</h2>
      <div className="week-inputs">
        <label>Start Date:</label>
        <input
          type="date"
          value={soupPlan.week.startDate}
          onChange={e => handleWeekChange('startDate', e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={soupPlan.week.endDate}
          onChange={e => handleWeekChange('endDate', e.target.value)}
        />
      </div>
      {Object.keys(soupPlan).filter(day => day !== 'week').map(day => (
        <div className="soup" key={day}>
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
      <button className="save-button" onClick={handleSubmit}>Save</button>
    </div>
  );
};

export default SoupPlanAdmin;
