'use client';

import { useEffect, useState } from 'react';

export default function ScoreTable() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await fetch('/api/scores');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des scores');
        }
        const data = await response.json();
        setScores(data.data || []);
      } catch (err) {
        setError('Impossible de charger les scores');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <span className="loading loading-dots loading-md"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4 text-center">Meilleurs Scores</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th className="text-center">Rang</th>
              <th>Nom</th>
              <th className="text-end">Score</th>
              <th className="text-end">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.length > 0 ? (
              scores.map((score, index) => (
                <tr key={score._id} className={index < 3 ? "font-bold" : ""}>
                  <td className="text-center">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && index + 1}
                  </td>
                  <td>{score.name}</td>
                  <td className="text-end">{score.score}</td>
                  <td className="text-end">{new Date(score.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">Aucun score enregistré pour le moment</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}