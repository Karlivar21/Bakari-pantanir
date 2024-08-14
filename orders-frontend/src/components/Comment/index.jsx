import React, { useEffect, useState } from 'react';
import Sidebar from "../Sidebar";
import axios from 'axios';



const Comment = () => {

    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('https://api.kallabakari.is/api/comments');
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, []); 



    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex flex-col p-6 w-full overflow-hidden">
                <h1 className="text-3xl font-bold mb-4">Allar athugasemdir</h1>
                <div className="overflow-x-auto w-full">
                    <table className="w-full divide-y divide-gray-200 bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nafn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sími</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Netfang</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Athugasemd</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {comments.map((comment) => (
                                <tr key={comment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{comment.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{comment.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{comment.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{comment.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Comment;