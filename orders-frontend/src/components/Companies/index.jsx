import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import { AuthContext } from '../../auth/AuthContext';

const API = 'https://api.kallabakari.is';

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400';

export default function Companies() {
  const { token } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCompanies = () => {
    axios.get(`${API}/api/company/admin/companies`, { headers: { Authorization: token } })
      .then(res => setCompanies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchCompanies, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!name || !username || !password) return setError('Fylltu út öll reiti');
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/company/admin/companies`, { name, username, password }, { headers: { Authorization: token } });
      setSuccess(`Fyrirtæki "${name}" stofnað`);
      setName(''); setUsername(''); setPassword('');
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.error || 'Villa við stofnun');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, companyName) => {
    if (!window.confirm(`Eyða fyrirtækinu "${companyName}"?`)) return;
    try {
      await axios.delete(`${API}/api/company/admin/companies/${id}`, { headers: { Authorization: token } });
      setCompanies(prev => prev.filter(c => c._id !== id));
    } catch {
      alert('Ekki tókst að eyða');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Fyrirtæki</h1>

        <div className="flex gap-6 items-start">
          {/* Create form */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Stofna fyrirtæki</h2>
              {error && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
              {success && <div className="mb-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{success}</div>}
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nafn fyrirtækis</label>
                  <input className={inputCls} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Dæmi hf." required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notendanafn</label>
                  <input className={inputCls} type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="daemi_hf" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Lykilorð</label>
                  <input className={inputCls} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                >
                  {submitting ? 'Vista...' : 'Stofna fyrirtæki'}
                </button>
              </form>
            </div>
          </div>

          {/* Company list */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nafn</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notendanafn</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stofnað</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={4} className="px-5 py-6 text-sm text-gray-400 text-center">Hleður...</td></tr>
                  ) : companies.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-6 text-sm text-gray-400 text-center">Engin fyrirtæki skráð</td></tr>
                  ) : companies.map(c => (
                    <tr key={c._id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{c.name}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 font-mono">{c.username}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString('is-IS')}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(c._id, c.name)}
                          className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                        >
                          Eyða
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
