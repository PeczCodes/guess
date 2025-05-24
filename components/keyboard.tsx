import React from 'react';
import clsx from "clsx";

const Keyboard = ({handleKey}: { handleKey: (key: string) => void; }) => {
	return (
		<div className="keyboard mt-6 grid gap-2">
			{["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, rowIndex) => (
				<div key={rowIndex} className="flex justify-center gap-1">
					{row.split("").map((char) => (
						<button
							key={char}
							onClick={() => handleKey(char)}
							className={clsx("px-[2.5vw] py-2 outline-1 bg-amber-300 rounded border-0 border-black text-black hover:bg-gray-300")}
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
	);
};

export default Keyboard;