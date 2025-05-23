"use client";
import React, { useEffect, useState } from "react";
import {Line} from "@/app/line";
import Link from "next/link";

const api = "/api";
const wordLength = 5;
const maxGuesses = 6;

const Page = () => {
	const [solution, setSolution] = useState<string>("");
	const [guesses, setGuesses] = useState<(string | null)[]>(Array(maxGuesses).fill(null));
	const [currentGuess, setCurrentGuess] = useState<string>("");
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [previousGuess, setPreviousGuess] = useState<string>("");
	
	const fetchWord = async () => {
		const response = await fetch(api);
		const words = await response.json();
		const randomWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
		setSolution(randomWord);
	};
	
	useEffect(() => {
		fetchWord();
	}, []);
	
	useEffect(() => {
		const handleType = (e: KeyboardEvent) => {
			if (gameOver) return;
			
			const isLetter = /^[a-zA-Z]$/.test(e.key);
			
			if (e.key === "Enter") {
				if (currentGuess.length !== wordLength) return;
				
				const newGuesses = [...guesses];
				newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
				setGuesses(newGuesses);
				setPreviousGuess(currentGuess);
				setCurrentGuess("");
				
				if (solution === currentGuess) {
					setGameOver(true);
				} else if (newGuesses.every((val) => val !== null)) {
					setGameOver(true);
				}
				return;
			}
			
			if (e.key === "Backspace") {
				setCurrentGuess((old) => old.slice(0, -1));
				return;
			}
			
			if (isLetter && currentGuess.length < wordLength) {
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
	
	return (
		<>
			<Link href="/help" className="py-1 px-2 border-1 border-black dark:border-white rounded absolute right-[2rem] top-[2rem] hover:bg-amber-300 hover:text-black transition duration-200  w-[4rem] grid place-items-center" >HELP</Link>
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
		</>
		
	);
};



export default Page;
