import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { problemAPI, progressAPI, topicAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faCode, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const ProblemList = () => {
  const { topicId } = useParams();
  const { user } = useContext(AuthContext);

  const [problems, setProblems] = useState([]);
  const [topic, setTopic] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch topic details
        const topicResponse = await topicAPI.getById(topicId);
        setTopic(topicResponse.data);

        // Fetch problems for this topic
        const problemsResponse = await problemAPI.getByTopic(topicId);
        setProblems(problemsResponse.data);

        // Fetch user progress for this topic
        const progressResponse = await progressAPI.getByTopic(topicId);

        // Convert progress array to a map for easy lookup
        const progressMap = {};
        progressResponse.data.forEach(item => {
          progressMap[item.problemId] = item.completed;
        });

        setProgress(progressMap);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [topicId, user]);

  const handleToggleStatus = async (problemId) => {
    try {
      await progressAPI.toggleStatus(problemId);

      // Update local state
      setProgress(prev => ({
        ...prev,
        [problemId]: !prev[problemId]
      }));
    } catch (err) {
      setError('Failed to update progress');
    }
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center mt-5">Loading problems...</div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      {topic && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{topic.name}</h1>
          <p className="text-gray-600">{topic.description}</p>
        </div>
      )}

      {problems.length === 0 ? (
        <p className="text-gray-500">No problems available for this topic yet.</p>
      ) : (
        <div className="space-y-4">
          {problems.map((problem) => (
            <div key={problem._id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold text-gray-900">{problem.title}</h2>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getDifficultyClass(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600">{problem.description}</p>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={progress[problem._id] || false}
                        onChange={() => handleToggleStatus(problem._id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Completed</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {problem.youtubeLink && (
                    <a
                      href={problem.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                    >
                      <FontAwesomeIcon icon={faYoutube} className="mr-1" />
                      YouTube
                    </a>
                  )}

                  {problem.leetcodeLink && (
                    <a
                      href={problem.leetcodeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                    >
                      <FontAwesomeIcon icon={faCode} className="mr-1" />
                      LeetCode
                    </a>
                  )}

                  {problem.codeforceLink && (
                    <a
                      href={problem.codeforceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      CodeForces
                    </a>
                  )}

                  {problem.articleLink && (
                    <a
                      href={problem.articleLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Article
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemList;