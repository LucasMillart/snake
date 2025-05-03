'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Constantes du jeu
const GRID_SIZE = 20; // Taille de la grille (20x20)
const CELL_SIZE = 20; // Taille d'une cellule en pixels
const GAME_SPEED = 100; // Vitesse de base du jeu en ms
const SPRINT_SPEED = 50; // Vitesse en mode sprint
const SPRINT_DRAIN_RATE = 1; // Taux de diminution de l'endurance
const SPRINT_RECOVER_RATE = 0.5; // Taux de récupération de l'endurance

// Direction du serpent
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Types d'objets
const OBJECT_TYPES = {
  BANANA: 'banana',
  SHOE: 'shoe',
};

export default function SnakeGame({ onGameOver }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);
  const [endurance, setEndurance] = useState(100);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [activePowerUps, setActivePowerUps] = useState({
    shoe: false
  });

  // États du jeu stockés dans des refs pour éviter les rerenders inutiles
  const gameState = useRef({
    snake: [{ x: 10, y: 10 }], // Position initiale du serpent
    direction: DIRECTIONS.RIGHT, // Direction initiale
    nextDirection: DIRECTIONS.RIGHT,
    food: {
      position: { x: 5, y: 5 },
      type: OBJECT_TYPES.BANANA
    },
    gameLoop: null,
    speed: GAME_SPEED,
    powerUpTimeout: null,
  });

  // Générer une position aléatoire dans la grille
  const getRandomPosition = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  // Vérifier si une position est occupée par le serpent
  const isPositionOccupied = useCallback((position) => {
    return gameState.current.snake.some(
      (segment) => segment.x === position.x && segment.y === position.y
    );
  }, []);

  // Générer une nouvelle nourriture
  const generateFood = useCallback(() => {
    let position;
    do {
      position = getRandomPosition();
    } while (isPositionOccupied(position));

    // 20% de chance d'obtenir une chaussure (bonus de vitesse)
    const type = Math.random() < 0.2 ? OBJECT_TYPES.SHOE : OBJECT_TYPES.BANANA;

    gameState.current.food = {
      position,
      type
    };
  }, [getRandomPosition, isPositionOccupied]);

  // Dessiner le jeu sur le canvas
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner la grille
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Dessiner le serpent
    const { snake } = gameState.current;
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Tête du serpent (différente couleur)
        ctx.fillStyle = isSprinting ? '#ff6b6b' : '#66bb6a';
        ctx.fillRect(
          segment.x * CELL_SIZE,
          segment.y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );

        // Yeux du serpent
        ctx.fillStyle = 'black';
        const dir = gameState.current.direction;
        const eyeSize = CELL_SIZE / 5;
        const eyeOffset = CELL_SIZE / 4;

        if (dir === DIRECTIONS.RIGHT || dir === DIRECTIONS.LEFT) {
          // Yeux sur les côtés pour les directions horizontales
          ctx.fillRect(
            segment.x * CELL_SIZE + (dir === DIRECTIONS.RIGHT ? 3 * CELL_SIZE / 4 : CELL_SIZE / 4),
            segment.y * CELL_SIZE + eyeOffset,
            eyeSize,
            eyeSize
          );
          ctx.fillRect(
            segment.x * CELL_SIZE + (dir === DIRECTIONS.RIGHT ? 3 * CELL_SIZE / 4 : CELL_SIZE / 4),
            segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize,
            eyeSize,
            eyeSize
          );
        } else {
          // Yeux sur les côtés pour les directions verticales
          ctx.fillRect(
            segment.x * CELL_SIZE + eyeOffset,
            segment.y * CELL_SIZE + (dir === DIRECTIONS.DOWN ? 3 * CELL_SIZE / 4 : CELL_SIZE / 4),
            eyeSize,
            eyeSize
          );
          ctx.fillRect(
            segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize,
            segment.y * CELL_SIZE + (dir === DIRECTIONS.DOWN ? 3 * CELL_SIZE / 4 : CELL_SIZE / 4),
            eyeSize,
            eyeSize
          );
        }
      } else {
        // Corps du serpent
        ctx.fillStyle = isSprinting ? '#ff9e80' : '#81c784';
        ctx.fillRect(
          segment.x * CELL_SIZE,
          segment.y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    });

    // Dessiner la nourriture
    const { food } = gameState.current;
    if (food.type === OBJECT_TYPES.BANANA) {
      // Dessiner une banane
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.ellipse(
        food.position.x * CELL_SIZE + CELL_SIZE / 2,
        food.position.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        CELL_SIZE / 3 - 1,
        Math.PI / 4,
        0,
        2 * Math.PI
      );
      ctx.fill();
    } else {
      // Dessiner une chaussure de sport
      ctx.fillStyle = '#2196f3';
      ctx.fillRect(
        food.position.x * CELL_SIZE + 2,
        food.position.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );
      // Lacets
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(food.position.x * CELL_SIZE + CELL_SIZE / 3, food.position.y * CELL_SIZE + 5);
      ctx.lineTo(food.position.x * CELL_SIZE + 2 * CELL_SIZE / 3, food.position.y * CELL_SIZE + 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(food.position.x * CELL_SIZE + CELL_SIZE / 3, food.position.y * CELL_SIZE + 9);
      ctx.lineTo(food.position.x * CELL_SIZE + 2 * CELL_SIZE / 3, food.position.y * CELL_SIZE + 9);
      ctx.stroke();
    }

  }, [isSprinting]);

  // Mettre à jour l'état du jeu
  const updateGame = useCallback(() => {
    if (gameOver || isPaused) return;

    const { snake, food, nextDirection } = gameState.current;

    // Mettre à jour la direction
    gameState.current.direction = nextDirection;

    // Calculer la nouvelle position de la tête
    const head = { ...snake[0] };
    head.x += gameState.current.direction.x;
    head.y += gameState.current.direction.y;

    // Vérifier si le serpent a heurté un mur
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      handleGameOver();
      return;
    }

    // Vérifier si le serpent s'est mordu la queue
    if (isPositionOccupied({ x: head.x, y: head.y })) {
      handleGameOver();
      return;
    }

    // Ajouter la nouvelle tête
    snake.unshift(head);

    // Vérifier si le serpent a mangé la nourriture
    if (head.x === food.position.x && head.y === food.position.y) {
      if (food.type === OBJECT_TYPES.BANANA) {
        // Ajouter des points
        setScore((prevScore) => prevScore + 10);
      } else if (food.type === OBJECT_TYPES.SHOE) {
        // Activer le bonus de vitesse
        activatePowerUp('shoe');
      }

      // Générer une nouvelle nourriture
      generateFood();
    } else {
      // Retirer la queue du serpent si pas de nourriture mangée
      snake.pop();
    }

    // Mettre à jour l'endurance en mode sprint
    if (isSprinting) {
      setEndurance((prev) => Math.max(0, prev - SPRINT_DRAIN_RATE));
    } else if (endurance < 100) {
      setEndurance((prev) => Math.min(100, prev + SPRINT_RECOVER_RATE));
    }

    // Dessiner le jeu
    drawGame();
  }, [drawGame, generateFood, isPositionOccupied, gameOver, isPaused, isSprinting]);

  // Gérer la fin du jeu
  const handleGameOver = useCallback(() => {
    setGameOver(true);
    clearInterval(gameState.current.gameLoop);
    if (gameState.current.powerUpTimeout) {
      clearTimeout(gameState.current.powerUpTimeout);
    }
    if (onGameOver) {
      onGameOver(score);
    }
  }, [score, onGameOver]);

  // Activer un power-up
  const activatePowerUp = useCallback((type) => {
    if (type === 'shoe') {
      setActivePowerUps((prev) => ({ ...prev, shoe: true }));

      // Réinitialiser l'endurance
      setEndurance(100);

      // Définir un délai pour désactiver le power-up
      if (gameState.current.powerUpTimeout) {
        clearTimeout(gameState.current.powerUpTimeout);
      }

      gameState.current.powerUpTimeout = setTimeout(() => {
        setActivePowerUps((prev) => ({ ...prev, shoe: false }));
      }, 5000); // 5 secondes de bonus
    }
  }, []);

  // Gérer les entrées clavier
  const handleKeyDown = useCallback((event) => {
    const { direction } = gameState.current;

    switch (event.key) {
      case 'ArrowUp':
        if (direction !== DIRECTIONS.DOWN) {
          gameState.current.nextDirection = DIRECTIONS.UP;
        }
        break;
      case 'ArrowDown':
        if (direction !== DIRECTIONS.UP) {
          gameState.current.nextDirection = DIRECTIONS.DOWN;
        }
        break;
      case 'ArrowLeft':
        if (direction !== DIRECTIONS.RIGHT) {
          gameState.current.nextDirection = DIRECTIONS.LEFT;
        }
        break;
      case 'ArrowRight':
        if (direction !== DIRECTIONS.LEFT) {
          gameState.current.nextDirection = DIRECTIONS.RIGHT;
        }
        break;
      case ' ':
        // Barre d'espace pour sprint
        if (endurance > 0) {
          setIsSprinting(true);
        }
        break;
      case 'p':
        // Pause
        setIsPaused(prev => !prev);
        break;
      case 'r':
        // Redémarrer
        if (gameOver) {
          resetGame();
        }
        break;
      default:
        break;
    }
  }, [endurance]);

  // Relâchement de touche
  const handleKeyUp = useCallback((event) => {
    if (event.key === ' ') {
      setIsSprinting(false);
    }
  }, []);

  // Initialiser le jeu
  const initGame = useCallback(() => {
    // Réinitialiser les états
    gameState.current.snake = [{ x: 10, y: 10 }];
    gameState.current.direction = DIRECTIONS.RIGHT;
    gameState.current.nextDirection = DIRECTIONS.RIGHT;
    setScore(0);
    setEndurance(100);
    setGameOver(false);
    setIsPaused(false);
    setIsSprinting(false);
    setActivePowerUps({ shoe: false });

    // Générer la première nourriture
    generateFood();

    // Démarrer le compte à rebours
    setShowCountdown(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          startGameLoop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Dessiner l'état initial
    drawGame();

    return () => {
      clearInterval(countdownInterval);
    };
  }, [generateFood, drawGame]);

  // Démarrer la boucle de jeu
  const startGameLoop = useCallback(() => {
    if (gameState.current.gameLoop) {
      clearInterval(gameState.current.gameLoop);
    }

    gameState.current.gameLoop = setInterval(() => {
      updateGame();
    }, isSprinting || activePowerUps.shoe ? SPRINT_SPEED : GAME_SPEED);

    return () => {
      clearInterval(gameState.current.gameLoop);
    };
  }, [updateGame, isSprinting, activePowerUps.shoe]);

  // Réinitialiser le jeu
  const resetGame = useCallback(() => {
    if (gameState.current.gameLoop) {
      clearInterval(gameState.current.gameLoop);
    }

    if (gameState.current.powerUpTimeout) {
      clearTimeout(gameState.current.powerUpTimeout);
    }

    initGame();
  }, [initGame]);

  // Effet d'initialisation du jeu
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = GRID_SIZE * CELL_SIZE;
      canvas.height = GRID_SIZE * CELL_SIZE;

      initGame();
    }

    return () => {
      if (gameState.current.gameLoop) {
        clearInterval(gameState.current.gameLoop);
      }
      if (gameState.current.powerUpTimeout) {
        clearTimeout(gameState.current.powerUpTimeout);
      }
    };
  }, [initGame]);

  // Effet pour mettre à jour la boucle de jeu lorsque le mode sprint change
  useEffect(() => {
    if (!showCountdown && !gameOver && !isPaused) {
      return startGameLoop();
    }
  }, [isSprinting, activePowerUps.shoe, showCountdown, gameOver, isPaused, startGameLoop]);

  // Effet pour gérer les événements clavier
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="flex flex-col items-center">
      {/* HUD supérieur */}
      <div className="w-full md:w-[400px] mb-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">Score:</span>
          <span className="text-lg">{score}</span>
        </div>

        {/* Power-ups actifs */}
        <div className="flex gap-2">
          {activePowerUps.shoe && (
            <div className="badge badge-info gap-1">
              👟 Vitesse
            </div>
          )}
        </div>
      </div>

      {/* Barre d'endurance */}
      <div className="w-full md:w-[400px] h-2 bg-base-300 rounded-full mb-2 overflow-hidden">
        <div
          className={`h-full endurance-bar ${endurance < 30 ? 'bg-error' : endurance < 70 ? 'bg-warning' : 'bg-success'}`}
          style={{ width: `${endurance}%` }}
        ></div>
      </div>

      {/* Canvas du jeu */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="snake-canvas bg-base-300"
        />

        {/* Overlay de pause */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-80">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Pause</h3>
              <p className="mb-4">Appuyez sur P pour continuer</p>
              <button
                className="btn btn-primary"
                onClick={() => setIsPaused(false)}
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Overlay de fin de jeu */}
        {gameOver && !isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-80">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Game Over</h3>
              <p className="text-xl mb-4">Score: {score}</p>
              <button
                className="btn btn-primary"
                onClick={resetGame}
              >
                Rejouer
              </button>
            </div>
          </div>
        )}

        {/* Overlay de compte à rebours */}
        {showCountdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-80">
            <div className="text-center">
              <h3 className="text-6xl font-bold animate-bounce">{countdown}</h3>
              <p className="mt-4">Préparez-vous !</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-base-200 rounded-lg max-w-md">
        <h3 className="font-bold mb-2">Comment jouer:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Utilisez les <span className="font-bold">flèches directionnelles</span> pour guider le serpent</li>
          <li>Appuyez sur <span className="font-bold">espace</span> pour sprinter (consomme de l'endurance)</li>
          <li>Ramassez des <span className="font-bold text-yellow-500">bananes</span> pour marquer des points</li>
          <li>Les <span className="font-bold text-blue-500">chaussures</span> donnent un boost temporaire de vitesse</li>
          <li>Appuyez sur <span className="font-bold">P</span> pour mettre en pause</li>
          <li>Appuyez sur <span className="font-bold">R</span> pour recommencer si le jeu est terminé</li>
        </ul>
      </div>
    </div>
  );
}