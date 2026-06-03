import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import { useAlert } from '../Alert/AlertContext';

const soupOptions = [
  'Aspassúpa', 'Blaðlaukssúpa', 'Blómkálssúpa', 'Brokkólísúpa', 'Brauðsúpa', 'Fiskisúpa',
  'Gulrótarsúpa', 'Graskerssúpa', 'Íslensk Kjötsúpa', 'Mexíkósk Kjúklingasúpa', 'Paprikusúpa',
  'Rjómalöguð Sveppasúpa', 'Sætkartöflusúpa', 'Tómatsúpa', 'Tælensk Núðlusúpa',
];

const days = ['Mánudagur', 'Þriðjudagur', 'Miðvikudagur', 'Fimmtudagur', 'Föstudagur'];

const emptyPlan = { Mánudagur: '', Þriðjudagur: '', Miðvikudagur: '', Fimmtudagur: '', Föstudagur: '', week: { startDate: '', endDate: '' } };

const SoupPlanAdmin = () => {
  const [oldSoupPlan, setOldSoupPlan] = useState(emptyPlan);
  const [soupPlan, setSoupPlan] = useState(emptyPlan);
  const { showAlert } = useAlert();

  useEffect(() => {
    axios.get('https://api.kallabakari.is/api/soupPlan')
      .then(res => setOldSoupPlan(res.data))
      .catch(err => console.error('Error fetching soup plan:', err));
  }, []);

  const handleChange = (day, value) => setSoupPlan(prev => ({ ...prev, [day]: value }));
  const handleWeekChange = (field, value) => setSoupPlan(prev => ({ ...prev, week: { ...prev.week, [field]: value } }));
  const handleSubmit = () => {
    axios.post('https://api.kallabakari.is/api/soupPlan', soupPlan)
      .then(() => showAlert('Súpuplan vistað!', 'success'))
      .catch(err => console.error('Error updating soup plan:', err));
  };

  const selectCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Súpuplan</h1>

        <div className="max-w-2xl space-y-4">
          {/* Week dates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Vika</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Upphafsdagur</label>
                <input
                  type="date"
                  value={soupPlan.week.startDate}
                  onChange={e => handleWeekChange('startDate', e.target.value)}
                  className={selectCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Lokadagur</label>
                <input
                  type="date"
                  value={soupPlan.week.endDate}
                  onChange={e => handleWeekChange('endDate', e.target.value)}
                  className={selectCls}
                />
              </div>
            </div>
          </div>

          {/* Soup per day */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Súpa eftir dögum</h2>
            <div className="space-y-3">
              {days.map(day => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-32 text-sm text-gray-600 flex-shrink-0">{day}</span>
                  <select
                    value={soupPlan[day]}
                    onChange={e => handleChange(day, e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Veldu súpu</option>
                    {soupOptions.map((soup, i) => (
                      <option key={i} value={soup}>{soup}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Current plan */}
          {oldSoupPlan && Object.keys(oldSoupPlan).some(k => k !== 'week' && oldSoupPlan[k]) && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">Núverandi súpuplan</h2>
              <dl className="space-y-1.5">
                {days.filter(d => oldSoupPlan[d]).map(day => (
                  <div key={day} className="flex">
                    <dt className="w-32 text-sm text-amber-700">{day}</dt>
                    <dd className="text-sm text-gray-700">{oldSoupPlan[day]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-colors"
          >
            Vista súpuplan
          </button>
        </div>
      </main>
    </div>
  );
};

export default SoupPlanAdmin;
