import React from 'react';
import { Dancing_Script } from 'next/font/google'

const dancingScript = Dancing_Script({
	subsets: ['latin'],
	weight: ['400', '700'],
	display: 'swap',
})


const TypingText = ({ text }: { text: string; }) => {
	return (
		<div className={`${dancingScript.className} typing-container`}>
			{text.split('').map((char, index) => (
				<span key={index} className="typing-letter" style={{ animationDelay: `${index * 0.1}s`}}>{char === ' ' ? '\u00A0' : char}</span>
			))}
		</div>
	);
};

export default TypingText;
