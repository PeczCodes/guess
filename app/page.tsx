"use client";
import React, {useEffect, useRef, useState} from "react";
import { Line } from "@/components/line";
import clsx from "clsx";
import Title from "@/components/title";
import { motion, AnimatePresence } from "framer-motion";
import Help from "@/components/help";
import confetti from 'canvas-confetti';
import Keyboard from "@/components/keyboard";
import PlayAgain from "@/components/playAgain";
import Footer from "@/components/footer";


const api = "/api";
const wordLength = 5;
const maxGuesses = 6;

type pages = "game" | "help"

const Page = () => {
	const [page, setPage] = useState<pages>("game");
	const [solution, setSolution] = useState<string>("");
	const [guesses, setGuesses] = useState<(string | null)[]>(Array(maxGuesses).fill(null));
	const [currentGuess, setCurrentGuess] = useState<string>("");
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [previousGuess, setPreviousGuess] = useState<string>("");
	const [hint, setHint] = useState<string>("");
	const [showHint, setShowHint] = useState<boolean>(false);
	const [hasFetchedHint, setHasFetchedHint] = useState(false);
	const hasMounted = useRef(false);
	const [hasPlayedConfetti, setHasPlayedConfetti] = useState(false);
	
	
	const fetchWord = async () => {
		const response = await fetch(api);
		const words = await response.json();
		const randomWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
		setSolution(randomWord);
		await fetch("/api/solution", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(randomWord),
		})
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
	
	function scrambleWord(word: string): string {
		const letters = word.split('');
		for (let i = letters.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[letters[i], letters[j]] = [letters[j], letters[i]];
		}
		return letters.join('' + ', ');
	}
	
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
			
			setHint(res.error ? scrambleWord(solution) : res.message);
			setShowHint(true)
			
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
	
	
	useEffect(() => {
		if (!hasMounted.current) {
			hasMounted.current = true;
			return; // prevent confetti on first mount
		}
		
		const isNowCorrect = previousGuess === solution;
		
		if (isNowCorrect && !hasPlayedConfetti) {
			const duration = 2000;
			const end = Date.now() + duration;
			
			(function frame() {
				confetti({
					particleCount: 30,
					startVelocity: 30,
					spread: 360,
					ticks: 50,
					origin: {
						x: Math.random(),
						y: Math.random() * 0.5,
					},
				});
				if (Date.now() < end) {
					requestAnimationFrame(frame);
				}
			})();
			setHasPlayedConfetti(true);
			setHasPlayedConfetti(false)
		}
		
	}, [previousGuess, solution, hasPlayedConfetti]);
	
	
	return (
		page === "game"?
			(
				<div className="h-100vh w-100vw overflow-clip p-2">
					<button onClick={()=>setPage("help")} className="py-1 px-2 bg-amber-400 text-black rounded fixed right-[1rem] top-[1rem]  grid place-items-center">RULES</button>
					<Title classname="absolute top-[10vw] left-[50%] -translate-x-[50%] text-6xl md:top-[1rem]" />
					{(guesses.filter(guess => guess !== null).length > 0 && !gameOver) && (
						<button onClick={restartGame} className="py-1 px-2 bg-amber-400 rounded text-black fixed left-[1rem] top-[1rem] grid place-items-center">RESTART</button>
					)}
					
					{/*hint part*/
						!gameOver &&
						<AnimatePresence>
							{showHint && hint && (
								<motion.div
									initial={{ x: "-100%", opacity: 0 }}
									animate={{ x: "-50%", opacity: 1 }}
									exit={{ x: "100%", opacity: 0 }}
									transition={{ duration: 0.8 }}
									className="absolute top-[15rem] left-1/2 px-4 py-2 bg-yellow-100 text-yellow-800 font-semibold rounded shadow-md z-2"
								>
									{hint}
								</motion.div>
							)}
						</AnimatePresence>
					}
					
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
							<Keyboard handleKey={handleKey}/>
						)}
						
						
						{gameOver && (
							<PlayAgain solution={solution} previousGuess={previousGuess} restartGame={restartGame}/>
						)}
					</div>
					<Footer/>
					
				</div>
				
			)
			:
			<Help setPage={setPage}/>
		
		
	);
	
};

export default Page;
