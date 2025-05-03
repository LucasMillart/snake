'use client';

import { useState } from 'react';
import ScoreForm from './ScoreForm';

export default function GameOver({ score, onRestart, onSubmitComplete }) {
  const [showScoreForm, setShowScoreForm] = useState(false);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-80">
      <div className="text-center w-full max-w-xs">
        <h3 className="text-2xl font-bold mb-2">Game Over</h3>
        <p className="text-xl mb-4">Score: {score}</p>

        {!showScoreForm ? (
          <div className="space-y-3">
            <button
              className="btn btn-primary w-full"
              onClick={onRestart}
            >
              Rejouer
            </button>

            {score > 0 && (
              <button
                className="btn btn-outline btn-accent w-full"
                onClick={() => setShowScoreForm(true)}
              >
                Enregistrer mon score
              </button>
            )}
          </div>
        ) : (
          <div className="card bg-base-200 shadow-md p-4">
            <ScoreForm
              score={score}
              onSubmitComplete={() => {
                onSubmitComplete();
                setShowScoreForm(false);
              }}
              onCancel={() => setShowScoreForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}