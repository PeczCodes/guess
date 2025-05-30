"use client";
import React, {useEffect, useRef, useState} from "react";
import { Line } from "@/components/line";
import Title from "@/components/title";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import Keyboard from "@/components/keyboard";
import PlayAgain from "@/components/playAgain";
import FirstPage from "@/components/firstPage";
import {CircleHelp, RefreshCcw, X} from "lucide-react";
import clsx from "clsx";
import Hint from "@/components/hint";


const api = "/api";
const wordLength = 5;
const maxGuesses = 6;

function logMyGitHub() {
	console.log("%cGitHub → https://github.com/PeczCodes", "color: #8b5cf6; font-weight: bold;");
}

export type pages = "first" | "onboarding" | "game" | "help"

const Page = () => {
	const [page, setPage] = useState<pages>("first");
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
	const [disabled, setDisabled] = useState(true);
	
	
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
		fetchWord().then(()=> logMyGitHub())
		
	}, []);
	
	useEffect(() => {
		if (page === "first") {
			const timer = setTimeout(() => {
				setPage("game");
			}, 5000);
			
			return () => {
				clearTimeout(timer)
			}
		}
	}, [page]);
	
	useEffect(() => {
		const lastGuessIndex = maxGuesses - 2;
		const currentGuessIndex = guesses.findIndex((val) => val == null);
		
		if (
			currentGuessIndex === lastGuessIndex &&
			!hint &&
			solution &&
			!hasFetchedHint
		) {
			fetchHint(solution).then();
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
			
			const timer = setTimeout(() => {
				setShowHint(false);
				// clean hint text after exit
				setTimeout(() => setHint(""), 800); // match Framer's exit duration
			}, 8000);
			
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
		fetchWord().then();
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
		<AnimatePresence mode="wait">
			{page === "first" && (
				<motion.div
					key="first"
					initial={{opacity: 1}}
					animate={{opacity: 1}}
					exit={{opacity: 0}}
					transition={{duration: 1}}
					className="absolute top-0 left-0 w-full h-full z-10"
				>
					<FirstPage/>
				</motion.div>
			)}
			
			{page === "game" && (
				<div className="h-[100vh] w-[100vw] fixed grid place-items-center">
					<Hint setDisabled={setDisabled} disabled={disabled} />
					<motion.div
						key="game"
						initial={{opacity: 0}}
						animate={{opacity: 1}}
						exit={{opacity: 0}}
						transition={{duration: .2}}
						className={clsx(disabled? "pointer-events-none touch-none": "")}
					>
						<CircleHelp onClick={() => setDisabled(true)} className="text-[var(--purple)] z-12 cursor-pointer md:size-[2rem] fixed right-4 top-4"/>
						<Title classname="title grid justify-center fixed top-[10vw] left-0 text-6xl md:top-[.5rem]"/>
						{(guesses.filter((guess) => guess !== null).length > 0 && !gameOver) && (
							<RefreshCcw onClick={restartGame} className="text-[var(--purple)] cursor-pointer md:size-[2rem] fixed left-4 top-4"/>
						)}
						
						<AnimatePresence>
							{!gameOver && showHint && hint && (
								<motion.div initial={{x: "-100%", opacity: 0}} animate={{x: "-50%", opacity: 1}} exit={{x: "100%", opacity: 0}} transition={{duration: 0.8}} className="absolute top-[10%] left-1/2 px-4 py-2 bg-yellow-100 text-yellow-800 font-semibold rounded shadow-md z-2">
									<X className="size-[1.5rem] absolute -top-6 -right-6 bg-yellow-100 p-1 rounded-full  cursor-pointer" onClick={() => setShowHint(false)}/>
									<div className="max-sm:w-[70vw] text-center">
										{hint}
										<div className="w-full h-1 bg-yellow-200 mt-2 rounded overflow-hidden">
											<motion.div
												initial={{ width: "100%" }}
												animate={{ width: "0%" }}
												transition={{
													duration: 8,
													ease: "linear"
												}}
												className="h-full bg-yellow-500"
											/>
										</div>
									</div>
									
								</motion.div>
							)}
						</AnimatePresence>
						
						<div className="flex flex-col items-center gap-4">
							<div className="relative board flex gap-[5px] flex-col">
								{guesses.map((guess, idx) => {
									const isCurrentGuess = idx === guesses.findIndex((val) => val == null);
									return (
										<div key={idx} className="flex items-center gap-2 relative">
											{isCurrentGuess && !gameOver && (
												<div
													className="text-2xl -left-[2rem] top-[1rem] absolute animate-bounce text-amber-400">👉</div>
											)}
											<Line
												guess={isCurrentGuess ? currentGuess : guess ?? ""}
												isFinal={!isCurrentGuess && guess !== null}
												solution={solution}
											/>
										</div>
									);
								})}
							</div>
							
							{!gameOver && <Keyboard handleKey={handleKey}/>}
							
							{gameOver && (
								<PlayAgain
									solution={solution}
									previousGuess={previousGuess}
									restartGame={restartGame}
								/>
							)}
						</div>
					</motion.div>
				</div>
			)}
			
		</AnimatePresence>
	);
}

export default Page;