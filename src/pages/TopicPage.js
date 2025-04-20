import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProblemList from '../components/ProblemList';

const TopicPage = () => {
  const { topicId } = useParams();
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
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        <ProblemList />
      </div>
    </div>
  );
};

export default TopicPage;