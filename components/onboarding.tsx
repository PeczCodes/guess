import React from 'react';

const Onboarding = () => {
	return (
		<div>
			<div>
				How To Play
				Guess the Wordle in 6 tries.
				
				Each guess must be a valid 5-letter word.
				The color of the tiles will change to show how close your guess was to the word.
				Examples
				<span>
					<span></span><span></span><span></span><span></span><span></span>
				</span>
				W is in the word and in the correct spot.
				<span>
					<span></span><span></span><span></span><span></span><span></span>
				</span>
				I is in the word but in the wrong spot.
				<span>
					<span></span><span></span><span></span><span></span><span></span>
				</span>
				U is not in the word in any spot.
			</div>
		</div>
	);
};

export default Onboarding;