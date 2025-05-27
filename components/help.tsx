import React from 'react';
import {pages} from "@/app/page";
import {RefreshCcw} from "lucide-react";




type HelpProps = {
	setPage: React.Dispatch<React.SetStateAction<pages>>;
};

const Help: React.FC<HelpProps> = ({ setPage }) => {
	return (
		<div className="p-5">
			<button onClick={()=> setPage("game")} className="py-1 px-2 max-sm:text-sm text-[var(--purple)] hover:bg-[var(--purple)] hover:text-black rounded fixed right-[1rem] top-[1rem] outline-1 outline-[var(--purple)] grid place-items-center">PLAY</button>
			<div className="grid gap-4">
				<div>
					<h2 className="text-2xl font-bold mb-2">🎮 How to Play</h2>
					<p>Guess the 5-letter word in 6 tries or less!</p>
				</div>
				
				<div>
					<h3 className="text-xl font-semibold mb-1">🧩 Game Rules</h3>
					<ul className="list-disc list-inside space-y-1">
						<li>Type letters using the keyboard.</li>
						<li>Use <span className="font-mono bg-amber-300 py-1 px-2 rounded dark:text-black" >DEL</span> to delete the last letter.</li>
						<li>Press <span className="font-mono bg-amber-300 py-1 px-2 rounded dark:text-black">ENTER</span> to submit a guess after 5 letters.</li>
					</ul>
				</div>
				
				<div>
					<h3 className="text-xl font-semibold mb-1">⬛️ Tile Colors Explained</h3>
					<ul className="list-disc list-inside space-y-1">
						<li><span className="text-green-600 font-semibold">🟩</span> Letter in word and in the correct position</li>
						<li><span className="text-yellow-500 font-semibold">🟨</span> Letter in word but in the wrong position</li>
						<li><span className="text-red-500 font-semibold">🟥</span> Letter is not in the word</li>
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
						button appears. Click it to play a new word! or click the <RefreshCcw className="inline-flex bg-amber-300 py-1 px-1 size-[2rem] rounded dark:text-black" />
						 button to restart before the round ends if you have given up 😉
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
		</div>
		
	
	);
};

export default Help;