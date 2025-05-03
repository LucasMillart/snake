'use client';

import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import ScoreTable from './components/ScoreTable';
import { Suspense } from 'react';

export default function Home() {
  const [gameActive, setGameActive] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const handleStartGame = () => {
    setGameActive(true);
  };

  const handleGameOver = (score) => {
    // Cette fonction est appelée uniquement lorsqu'un score est effectivement soumis
    // Forcer le rechargement du tableau des scores après l'enregistrement
    setTableKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen flex flex-col text-base-content bg-blue-50">
      {/* Header */}
      <header className="p-4 bg-purple-900 text-white">
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
            {/* Carte d'instructions */}
            {gameActive &&
              <div className="card bg-base-100 shadow-xl mt-4">
                <div className="card-body">
                  <h2 className="card-title">Comment jouer 🎮</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold mb-2">Commandes :</h3>
                      <ul className="list space-y-1">
                        <li className="list-row">
                          <span className="badge badge-neutral">↑ ↓ ← →</span>
                          <span>Diriger le serpent</span>
                        </li>
                        <li className="list-row">
                          <span className="badge badge-neutral">Espace</span>
                          <span>Sprint (consomme de l&apos;endurance)</span>
                        </li>
                        <li className="list-row">
                          <span className="badge badge-neutral">P</span>
                          <span>Pause / Reprendre</span>
                        </li>
                        <li className="list-row">
                          <span className="badge badge-neutral">R</span>
                          <span>Recommencer (après Game Over)</span>
                        </li>
                      </ul>
                      <div className="alert alert-info mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Pendant le jeu, la fenêtre du navigateur ne défile pas avec les touches fléchées.</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Éléments du jeu :</h3>
                      <ul className="list space-y-1">
                        <li className="list-row">
                          <span className="badge badge-warning">🍌</span>
                          <span>Bananes - Donnent 10 points</span>
                        </li>
                        <li className="list-row">
                          <span className="badge badge-info">👟</span>
                          <span>Chaussures - Boost de vitesse temporaire</span>
                        </li>
                        <li className="list-row">
                          <span className="badge badge-success">⚡</span>
                          <span>Barre verte - Endurance disponible</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            }
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
