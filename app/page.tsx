"use client";
import React, { useEffect, useRef, useState } from "react";
import { Line } from "@/app/line";
import Link from "next/link";

const api = "/api";
const wordLength = 5;
const maxGuesses = 6;

const Page = () => {
	const [solution, setSolution] = useState<string>("");
	const [guesses, setGuesses] = useState<(string | null)[]>(
		Array(maxGuesses).fill(null)
	);
	const [currentGuess, setCurrentGuess] = useState<string>("");
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [previousGuess, setPreviousGuess] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);
	
	const fetchWord = async () => {
		const response = await fetch(api);
		const words = await response.json();
		const randomWord =
			words[Math.floor(Math.random() * words.length)].toUpperCase();
		setSolution(randomWord);
	};
	
	useEffect(() => {
		fetchWord();
	}, []);
	
	useEffect(() => {
		const handleType = (e: KeyboardEvent) => {
			if (gameOver) return;
			
			const isLetter = /^[a-zA-Z]$/.test(e.key);
			const isTouchDevice =
				"ontouchstart" in window || navigator.maxTouchPoints > 0;
			
			if (e.key === "Enter") {
				if (currentGuess.length !== wordLength) return;
				
				const newGuesses = [...guesses];
				newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
				setGuesses(newGuesses);
				setPreviousGuess(currentGuess);
				setCurrentGuess("");
				
				if (solution === currentGuess || newGuesses.every((val) => val !== null)) {
					setGameOver(true);
				}
				return;
			}
			if (e.key === "Backspace") {
				if (!isTouchDevice) {
					setCurrentGuess((old) => old.slice(0, -1));
				}
				return;
			}
			
			// Skip typing letters on mobile — handled by <input>
			if (!isTouchDevice && isLetter && currentGuess.length < wordLength) {
				setCurrentGuess((old) => (old + e.key).toUpperCase());
			}
		};
		
		window.addEventListener("keydown", handleType);
		return () => window.removeEventListener("keydown", handleType);
	}, [currentGuess, gameOver, guesses, solution]);
	
	const restartGame = () => {
		setGuesses(Array(maxGuesses).fill(null));
		setCurrentGuess("");
		setGameOver(false);
		fetchWord();
	};
	
	const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
		const val = (e.target as HTMLInputElement).value.toUpperCase();
		if (/^[A-Z]{0,5}$/.test(val)) {
			setCurrentGuess(val);
		}
	};
	
	return (
		<div className="h-100vh overflow-clip p-2">
			<Link
				href="/help"
				className="py-1 px-2 border-1 border-black dark:border-white rounded absolute right-[2rem] top-[2rem] hover:bg-amber-300 hover:text-black transition duration-200  w-[4rem] grid place-items-center"
			>
				HELP
			</Link>
			
			{/* Tap to Start Button */}
			<div className="w-full text-center my-4">
				<button
					onClick={() => inputRef.current?.focus()}
					className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
				>
					Tap to Start
				</button>
				<input
					ref={inputRef}
					type="text"
					inputMode="text"
					autoComplete="off"
					autoCorrect="off"
					spellCheck="false"
					className="absolute opacity-0 pointer-events-none w-0 h-0"
					value={currentGuess}
					onInput={handleInput}
				/>
			</div>
			
			<div className="flex flex-col items-center gap-4">
				<div className="board flex gap-[5px] flex-col">
					{guesses.map((guess, idx) => {
						const isCurrentGuess = idx === guesses.findIndex((val) => val == null);
						return (
							<Line
								key={idx}
								guess={isCurrentGuess ? currentGuess : guess ?? ""}
								isFinal={!isCurrentGuess && guess !== null}
								solution={solution}
							/>
						);
					})}
				</div>
				
				{gameOver && (
					<div className="text-center mt-4">
						<p className="text-lg font-semibold text-green-500">
							{solution === previousGuess
								? "🎉 You got it!"
								: `❌ Game Over. The word was: ${solution}`}
						</p>
						<button
							onClick={restartGame}
							className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
						>
							Play Again
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Page;
