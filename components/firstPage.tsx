import React from 'react';
import Title from "@/components/title";
import TypingText from "@/components/typingText";
import Footer from "@/components/footer";

const FirstPage = () => {
	return (
		<div className="grid text-center place-items-center h-[80vh]">
			<div>
				<Title classname="intro" />
				<TypingText text="One word. Six tries. Infinite suspense" />
			</div>
			<Footer />
		</div>
	);
};

export default FirstPage;