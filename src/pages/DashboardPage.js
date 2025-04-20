import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TopicList from '../components/TopicList';
import ProgressSummary from '../components/ProgressSummary';

const DashboardPage = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!user) return null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
      <p className="text-gray-600 mb-6">Track your progress in Data Structures and Algorithms.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProgressSummary />
        </div>
        <div className="md:col-span-2">
          <TopicList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;