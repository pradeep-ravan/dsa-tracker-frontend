import React, { useState, useEffect } from 'react';
import { progressAPI, topicAPI, problemAPI } from '../services/api';

const ProgressSummary = () => {
  const [stats, setStats] = useState({
    totalProblems: 0,
    completedProblems: 0,
    topicsProgress: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const progressResponse = await progressAPI?.getAll();
        const userProgress = progressResponse?.data;
        
        const problemsResponse = await problemAPI?.getAll();
        const allProblems = problemsResponse?.data;
        
        //
        const topicsResponse = await topicAPI?.getAll();
        const allTopics = topicsResponse?.data;
        
        // Calculate overall progress
        const completedProblems = userProgress?.filter(p => p.completed)?.length;
        
        // Calculate progress by topic
        const topicsProgress = allTopics?.map(topic => {
          const topicProblems = allProblems?.filter(p => p?.topicId === topic?._id);
          const completedTopicProblems = userProgress?.filter(
            p => p?.completed && topicProblems?.some(tp => tp?._id === p?.problemId)
          )?.length;
          
          return {
            _id: topic?._id,
            name: topic?.name,
            total: topicProblems?.length,
            completed: completedTopicProblems,
            percentage: topicProblems?.length > 0 
              ? Math?.round((completedTopicProblems / topicProblems?.length) * 100) 
              : 0
          };
        });
        
        setStats({
          totalProblems: allProblems?.length,
          completedProblems,
          topicsProgress
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) return <div className="text-center">Loading progress...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Your Progress</h2>
      
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <h3 className="text-sm font-medium">Overall Progress</h3>
          <span className="text-sm font-medium">
            {Math.round((stats?.completedProblems / stats?.totalProblems) * 100) || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${Math.round((stats?.completedProblems / stats?.totalProblems) * 100) || 0}%` }}
          ></div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {stats?.completedProblems} of {stats?.totalProblems} problems completed
        </p>
      </div>

      <h3 className="text-sm font-medium mb-3">Progress by Topic</h3>
      <div className="space-y-4">
        {stats?.topicsProgress.map(topic => (
          <div key={topic?._id}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{topic?.name}</span>
              <span className="text-sm font-medium text-gray-700">
                {topic?.completed}/{topic?.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${topic?.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSummary;