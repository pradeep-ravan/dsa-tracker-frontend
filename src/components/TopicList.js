import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topicAPI } from '../services/api';

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data } = await topicAPI?.getAll();
        setTopics(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch topics');
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading topics...</div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3">{error}</div>;

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">DSA Topics</h2>
      {topics?.length === 0 ? (
        <p className="text-gray-500">No topics available yet.</p>
      ) : (
        <div className="space-y-2">
          {topics && topics?.map((topic) => (
            <Link 
              to={`/topic/${topic?._id}`} 
              key={topic?._id} 
              className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-150"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">{topic?.name}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="mt-1 text-gray-600">{topic?.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicList;