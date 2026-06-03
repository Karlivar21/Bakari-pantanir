import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import axios from 'axios';

const Comment = () => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.get('https://api.kallabakari.is/api/comments')
            .then(res => setComments(res.data))
            .catch(err => console.error('Error fetching comments:', err));
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-8">
                <h1 className="text-xl font-semibold text-gray-900 mb-6">Athugasemdir</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nafn</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sími</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Netfang</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Athugasemd</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {comments.map((comment) => (
                                <tr key={comment.id} className="hover:bg-amber-50/30 transition-colors">
                                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{comment.name}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{comment.phone}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{comment.email}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{comment.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {comments.length === 0 && (
                        <p className="text-sm text-gray-400 px-5 py-6">Engar athugasemdir fundust</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Comment;
