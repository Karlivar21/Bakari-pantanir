import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import { useAlert } from '../Alert/AlertContext';

const soupOptions = [
  'Aspassúpa', 'Blaðlaukssúpa', 'Blómkálssúpa', 'Brokkólísúpa', 'Brauðsúpa', 'Fiskisúpa',
  'Gulrótarsúpa', 'Graskerssúpa', 'Íslensk Kjötsúpa', 'Mexíkósk Kjúklingasúpa', 'Paprikusúpa',
  'Rjómalöguð Sveppasúpa', 'Sætkartöflusúpa', 'Tómatsúpa', 'Tælensk Núðlusúpa',
];

const SoupPlanAdmin = () => {
  const [oldsoupPlan, setOldSoupPlan] = useState({
    Mánudagur: '', Þriðjudagur: '', Miðvikudagur: '', Fimmtudagur: '', Föstudagur: '',
    week: { startDate: '', endDate: '' }
  });
  const [soupPlan, setSoupPlan] = useState({
    Mánudagur: '', Þriðjudagur: '', Miðvikudagur: '', Fimmtudagur: '', Föstudagur: '',
    week: { startDate: '', endDate: '' }
  });
  const { showAlert } = useAlert();

  useEffect(() => {
    axios.get('https://api.kallabakari.is/api/soupPlan')
      .then(response => setOldSoupPlan(response.data))
      .catch(error => console.error('Error fetching soup plan:', error));
  }, []);

  const handleChange = (day, value) => {
    setSoupPlan(prev => ({ ...prev, [day]: value }));
  };

  const handleWeekChange = (field, value) => {
    setSoupPlan(prev => ({ ...prev, week: { ...prev.week, [field]: value } }));
  };

  const handleSubmit = () => {
    axios.post('https://api.kallabakari.is/api/soupPlan', soupPlan)
      .then(() => showAlert('Súpuplan vistað!', 'success'))
      .catch(error => console.error('Error updating soup plan:', error));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex flex-col flex-1 items-center py-10 px-4 md:px-10">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <h2 className="text-4xl font-serif font-bold text-center text-blue-700">Súpuplan</h2>

          {/* Date selection */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex flex-col">
              <label className="text-gray-700 font-serif mb-1">Start Date</label>
              <input
                type="date"
                value={soupPlan.week.startDate}
                onChange={e => handleWeekChange('startDate', e.target.value)}
                className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-serif mb-1">End Date</label>
              <input
                type="date"
                value={soupPlan.week.endDate}
                onChange={e => handleWeekChange('endDate', e.target.value)}
                className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Soup plan per day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(oldsoupPlan).filter(day => day !== 'week').map(day => (
              <div key={day} className="flex flex-col space-y-2">
                <label className="text-lg font-serif text-gray-800">{day}</label>
                <select
                  value={soupPlan[day]}
                  onChange={e => handleChange(day, e.target.value)}
                  className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Veldu súpu</option>
                  {soupOptions.map((soup, index) => (
                    <option key={index} value={soup}>{soup}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Save button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold py-3 px-10 rounded-xl shadow-md transition-all"
            >
              Vista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoupPlanAdmin;
