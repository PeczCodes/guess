import React from 'react';

const PlayAgain = ({solution, previousGuess, restartGame}: { solution: string; previousGuess: string; restartGame: () => void;}) => {
	return (
		<div className="text-center mt-4">
			<p className="text-lg font-semibold text-green-500">
				{solution === previousGuess
					? "🎉 You got it!"
					: `❌ Game Over. The word was: ${solution}`}
			</p>
			<button
				onClick={restartGame}
				className="mt-2 px-4 py-2 bg-amber-400 text-black rounded transition"
			>
				Play Again
			</button>
		</div>
	);
};

export default PlayAgain;