import React from 'react';
import Title from "@/components/title";
import TypingText from "@/components/typingText";

const FirstPage = () => {
	return (
		<div className="grid text-center place-items-center h-[80vh]">
			<div>
				<Title classname="intro" />
				<TypingText text="A wordle-like game with a twist" />
			</div>
		</div>
	);
};

export default FirstPage;