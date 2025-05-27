import clsx from "clsx";
import React from "react";

export function Line({guess, isFinal, solution}: { guess: string; isFinal: boolean; solution: string}) {
	const tiles = [];
	
	for (let i = 0; i < 5; i++) {
		const char = guess[i] ?? "";
		let className = "";
		
		if (isFinal) {
			if (char === solution[i]) {
				className = "bg-green-500 text-black";
			} else if (solution.includes(char)) {
				className = "bg-yellow-400 text-black";
			} else {
				className = "bg-red-600 text-black";
			}
		}
		
		tiles.push(
			<div
				key={i}
				className={clsx(
					className,
					"w-[13vw] h-[13vw] md:w-[100px] md:h-[100px] rounded-2xl border border-black dark:border-white grid place-items-center text-3xl uppercase"
				)}
			>
				{char}
			</div>
		);
	}
	
	return <div className="line flex gap-[5px]">{tiles}</div>;
}