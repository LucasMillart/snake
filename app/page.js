'use client';

import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import ScoreTable from './components/ScoreTable';
import ScoreForm from './components/ScoreForm';
import { Suspense } from 'react';

export default function Home() {
  const [gameActive, setGameActive] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const handleStartGame = () => {
    setGameActive(true);
    setShowScoreForm(false);
  };

  const handleGameOver = (score) => {
    setCurrentScore(score);
    if (score > 0) {
      setShowScoreForm(true);
    }
  };

  const handleScoreSubmitted = () => {
    // Forcer le rechargement du tableau des scores après l'enregistrement
    setTableKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen flex flex-col text-base-content">
      {/* Header */}
      <header className="p-4 bg-base-200">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">
            🐍 Snake <span className="text-primary">Sport</span> 👟
          </h1>
          <p className="text-center">Le jeu du serpent avec une touche sportive</p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Colonne de gauche - Jeu */}
          <div className="w-full md:w-2/3">
            {gameActive ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <SnakeGame onGameOver={handleGameOver} />

                  {showScoreForm && (
                    <ScoreForm
                      score={currentScore}
                      onSubmitComplete={handleScoreSubmitted}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="hero min-h-[400px] bg-base-100 rounded-lg shadow-xl">
                <div className="hero-content text-center">
                  <div className="max-w-md">
                    <h2 className="text-5xl font-bold">Prêt à jouer ?</h2>
                    <p className="py-6">
                      Guidez votre serpent, attrapez des bananes pour gagner des points,
                      et utilisez les chaussures de sport pour des boosts de vitesse.
                      Appuyez sur Espace pour sprinter, mais attention à votre endurance !
                    </p>
                    <button className="btn btn-primary" onClick={handleStartGame}>
                      Jouer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Colonne de droite - Scores */}
          <div className="w-full md:w-1/3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Classement 🏆</h2>
                <Suspense fallback={
                  <div className="flex justify-center my-4">
                    <span className="loading loading-dots loading-md"></span>
                  </div>
                }>
                  <ScoreTable key={tableKey} />
                </Suspense>

                {!gameActive && (
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={handleStartGame}
                    >
                      Jouer maintenant
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-200">
        <div>
          <p>© 2025 - Snake Sport - Un jeu du serpent avec une touche sportive</p>
        </div>
      </footer>
    </div>
  );
}
