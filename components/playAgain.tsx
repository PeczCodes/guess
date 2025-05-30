import React from 'react';
import {randomFailureMessage, randomSuccessMessage} from "@/app/utils";

const PlayAgain = ({solution, previousGuess, restartGame}: { solution: string; previousGuess: string; restartGame: () => void;}) => {
	return (
		<div className="text-center mt-4">
			{solution === previousGuess
				? <p className="text-green-500">{randomSuccessMessage}</p>
				: <p className="text-red-500">{randomFailureMessage(solution)}</p>
			}
			<button
				onClick={restartGame}
				className="mt-2 px-4 py-2 bg-[var(--purple)] text-black rounded transition"
			>
				Play Again
			</button>
		</div>
	);
};

export default PlayAgain;