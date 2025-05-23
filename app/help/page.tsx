import React from 'react';
import Link from "next/link";

const Page = () => {
	return (
		<>
			<Link href="/" className="py-1 px-2 border-1 border-black dark:border-white rounded absolute right-[2rem] top-[2rem] hover:bg-amber-300 hover:text-white transition duration-200  dark:hover:text-black w-[4rem] grid place-items-center" >GAME</Link>
			<div className="grid gap-4">
				<div>
					<h2 className="text-2xl font-bold mb-2">🎮 How to Play</h2>
					<p>Guess the 5-letter word in 6 tries or less!</p>
				</div>
				
				<div>
					<h3 className="text-xl font-semibold mb-1">🧩 Game Rules</h3>
					<ul className="list-disc list-inside space-y-1">
						<li>Type letters using your keyboard.</li>
						<li>Only alphabet letters (A–Z) are allowed.</li>
						<li>Use <span className="font-mono bg-amber-300 py-1 px-2 rounded dark:text-black" >Backspace</span> to delete the last letter.</li>
						<li>Press <span className="font-mono bg-amber-300 py-1 px-2 rounded dark:text-black">Enter</span> to submit a guess after 5 letters.</li>
						<li>Each guess must be a valid 5-letter word.</li>
					</ul>
				</div>
				
				<div>
					<h3 className="text-xl font-semibold mb-1">⬛️ Tile Colors Explained</h3>
					<ul className="list-disc list-inside space-y-1">
						<li><span className="text-green-600 font-semibold">🟩 Green</span>: Correct letter in the correct position</li>
						<li><span className="text-yellow-500 font-semibold">🟨 Yellow</span>: Correct letter, wrong position</li>
						<li><span className="text-red-500 font-semibold">🟥 Red</span>: Letter is not in the word</li>
					</ul>
				</div>
				
				<div>
					<h3 className="text-xl font-semibold mb-1">🏁 Winning & Losing</h3>
					<ul className="list-disc list-inside space-y-1">
						<li>✅ Win if you guess the word within 6 tries</li>
						<li>❌ Lose if you don’t guess it in 6 tries</li>
					</ul>
				</div>
				
				<div>
					<h3 className="text-xl font-semibold mb-1">🔁 Restarting the Game</h3>
					<p>
						After a round ends (win or lose), a{" "}
						<span className="font-mono bg-amber-300 py-1 px-2 rounded dark:text-black">Play Again</span>{" "}
						button appears. Click it to play a new word!
					</p>
				</div>
				
				<div>
					<h3 className="text-xl font-semibold mb-1">📝 Example</h3>
					<p>Secret word: <span className="font-bold">PLANE</span></p>
					<p>You guess: <span className="font-bold">LEARN</span></p>
					<ul className="list-disc list-inside space-y-1 mt-1">
						<li><span className="font-mono">L</span> → 🟨 (correct letter, wrong spot)</li>
						<li><span className="font-mono">E</span> → 🟨 (correct letter, wrong spot)</li>
						<li><span className="font-mono">A</span> → 🟨 (correct letter, wrong spot)</li>
						<li><span className="font-mono">R</span> → 🟥 (not in the word)</li>
						<li><span className="font-mono">N</span> → 🟩 (correct letter and position)</li>
					</ul>
				</div>
			</div>
		</>
		
	
	);
};

export default Page;