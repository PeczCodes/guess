"use client"

import { motion } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";

interface HelpProps {
	setDisabled: (disabled: boolean) => void;
	disabled: boolean;
}

const Hint = ({ setDisabled, disabled }: HelpProps) => {
	
	return (
		<motion.div initial={{ opacity: 0 }} transition={{duration: .5, delay: 2}} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={clsx(disabled?"flex":"hidden", "fixed inset-0 bg-black/70 z-50  items-center justify-center px-4")}>
			<motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-zinc-800 rounded-lg p-6 max-w-md w-full relative">
				<button
					onClick={() => setDisabled(false)}
					className="absolute right-4 top-4 text-gray-400 hover:text-white"
				>
					<X size={24} />
				</button>
				
				<h2 className="text-2xl font-bold text-white mb-6">How to Play</h2>
				
				<div className="space-y-6">
					<div>
						<h3 className="text-lg font-semibold text-white mb-2">Rules</h3>
						<ul className="text-white space-y-2 list-disc list-inside">
							<li>You have 6 tries to guess a 5-letter word</li>
							<li>Hit <span className="bg-[var(--purple)] p-1 rounded">ENTER</span> to submit your guess</li>
							<li>After each guess, colors will show how close you were</li>
						</ul>
					</div>
					
					<div>
						<h3 className="text-lg font-semibold text-white mb-2">Color Guide</h3>
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold">
									A
								</div>
								<span className="text-white">Letter is correct and in the right spot</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center text-white font-bold">
									B
								</div>
								<span className="text-white">Letter is in the word but in wrong spot</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center text-white font-bold">
									C
								</div>
								<span className="text-white">Letter is not in word</span>
							</div>
						</div>
					</div>
					
					<div className="text-white mt-6">
						<h3 className="text-lg font-semibold text-white mb-2">Tips</h3>
						<ul className="space-y-2 list-disc list-inside">
							<li>You get a hint after your fourth try</li>
							<li>Use the keyboard or type to enter letters</li>
							<li>Press Backspace or <span className="bg-red-500 rounded p-1">DEL</span> to remove letters</li>
						</ul>
					</div>
				</div>
				
				<button
					onClick={() => setDisabled(false)}
					className="mt-8 w-full py-3 bg-[var(--purple)] rounded-md font-semibold"
				>
					Got it!
				</button>
			</motion.div>
		</motion.div>
	);
};

export default Hint;