"use client";
import React, { useEffect, useRef, useState } from "react";
import { Line } from "@/app/line";
import Link from "next/link";
import clsx from "clsx";
import Title from "@/app/title";
import { motion, AnimatePresence } from "framer-motion";


const api = "/api";
const wordLength = 5;
const maxGuesses = 6;

const Page = () => {
	const [solution, setSolution] = useState<string>("");
	const [guesses, setGuesses] = useState<(string | null)[]>(Array(maxGuesses).fill(null));
	const [currentGuess, setCurrentGuess] = useState<string>("");
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [previousGuess, setPreviousGuess] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);
	const [hint, setHint] = useState<string>("");
	const [showHint, setShowHint] = useState<boolean>(false);
	const [hasFetchedHint, setHasFetchedHint] = useState(false);
	
	
	const fetchWord = async () => {
		const response = await fetch(api);
		const words = await response.json();
		const randomWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
		setSolution(randomWord);
	};
	
	
	useEffect(() => {
		fetchWord()
	}, []);
	
	useEffect(() => {
		const lastGuessIndex = maxGuesses - 2;
		const currentGuessIndex = guesses.findIndex((val) => val == null);
		
		if (
			currentGuessIndex === lastGuessIndex &&
			!hint &&
			solution &&
			!hasFetchedHint
		) {
			fetchHint(solution);
			setHasFetchedHint(true); // Prevent repeated fetches
		}
	}, [guesses, solution, hint, hasFetchedHint]);
	
	
	const fetchHint = async (currentSolution: string) => {
		try {
			const hintResponse = await fetch(api, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(currentSolution),
			});
			
			const res = await hintResponse.json();
			setHint(res.message);
			setShowHint(true);
			
			// hide hint after 5 seconds
			const timer = setTimeout(() => {
				setShowHint(false);
				// clean hint text after exit
				setTimeout(() => setHint(""), 800); // match Framer's exit duration
			}, 5000);
			
			return () => clearTimeout(timer);
		} catch (error) {
			console.error("Error fetching hint:", error);
		}
	};
	
	
	
	
	
	const submitGuess = () => {
		if (currentGuess.length !== wordLength) return;
		const newGuesses = [...guesses];
		newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
		setGuesses(newGuesses);
		setPreviousGuess(currentGuess);
		setCurrentGuess("");
		if (solution === currentGuess || newGuesses.every((val) => val !== null)) {
			setGameOver(true);
		}
	};
	
	const handleKey = (key: string) => {
		if (gameOver) return;
		if (key === "ENTER") return submitGuess();
		if (key === "DEL") return setCurrentGuess((old) => old.slice(0, -1));
		if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
			setCurrentGuess((old) => (old + key).toUpperCase());
		}
	};
	
	useEffect(() => {
		const handleType = (e: KeyboardEvent) => {
			const isLetter = /^[a-zA-Z]$/.test(e.key);
			if (gameOver) return;
			if (e.key === "Enter") return submitGuess();
			if (e.key === "Backspace") return setCurrentGuess((old) => old.slice(0, -1));
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
		setHint("");
		setShowHint(false);
		setHasFetchedHint(false); // Reset on restart
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
		<div className="h-100vh w-100vw overflow-clip p-2">
			<Link href="/help" className="py-1 px-2 bg-amber-300 rounded fixed right-[1rem] top-[1rem]  grid place-items-center">RULES</Link>
			<Title classname="absolute top-[4rem] left-[50%] -translate-x-[50%] text-6xl md:top-[1rem]" />
			{guesses.filter(guess => guess !== null).length > 0 && (
				<button onClick={restartGame} className="py-1 px-2 bg-red-300 rounded fixed left-[1rem] top-[1rem] grid place-items-center">Restart</button>
			)}
			
			<div className="w-full text-center my-4">
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
			
			
			{/*hint part*/}
			<AnimatePresence>
				{showHint && hint && (
					<motion.div
						initial={{ x: "-100%", opacity: 0 }}
						animate={{ x: "-50%", opacity: 1 }}
						exit={{ x: "100%", opacity: 0 }}
						transition={{ duration: 0.8 }}
						className="absolute top-[20rem] left-1/2 px-4 py-2 bg-yellow-100 text-yellow-800 font-semibold rounded shadow-md z-2"
					>
						{hint}
					</motion.div>
				)}
			</AnimatePresence>
			
			
			
			
			<div className="flex flex-col items-center gap-4">
				<div className="relative board flex gap-[5px] flex-col">
					{guesses.map((guess, idx) => {
						const isCurrentGuess = idx === guesses.findIndex((val) => val == null);
						return isCurrentGuess && !gameOver? (
								<div key={idx} className="flex items-center relative">
									<div className="text-2xl -left-[2rem] top-[1rem] absolute animate-bounce text-amber-400">👉</div>
									<div className={clsx("flex items-center gap-2")}>
										<Line guess={isCurrentGuess ? currentGuess : guess ?? ""} isFinal={!isCurrentGuess && guess !== null} solution={solution}/>
									</div>
								</div>
							) :
							(
								<div key={idx} className={clsx("flex items-center gap-2")}>
									<Line guess={isCurrentGuess ? currentGuess : guess ?? ""} isFinal={!isCurrentGuess && guess !== null} solution={solution}/>
								</div>
							)
					})}
				</div>
				
				{!gameOver && (
					<div className="keyboard mt-6 grid gap-2">
						{["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, rowIndex) => (
							<div key={rowIndex} className="flex justify-center gap-1">
								{row.split("").map((char) => (
									<button
										key={char}
										onClick={() => handleKey(char)}
										className={clsx("px-[2.5vw] py-2 bg-gray-300 rounded text-black hover:bg-gray-300")}
									>
										{char}
									</button>
								))}
								{rowIndex === 2 && (
									<>
										<button
											onClick={() => handleKey("DEL")}
											className="px-2 py-2 bg-red-300 rounded text-black hover:bg-red-400"
										>
											DEL
										</button>
										<button
											onClick={() => handleKey("ENTER")}
											className="px-1 py-2 bg-green-300 rounded text-black hover:bg-green-400"
										>
											ENTER
										</button>
									</>
								)}
							</div>
						))}
					</div>
				)}
				
				
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
