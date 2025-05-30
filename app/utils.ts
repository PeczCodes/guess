const gameOverMessages = [
	"❌ Game Over. The word was: \"${solution}\"",
	"❌ Better luck next time! The word was: \"${solution}\"",
	"❌ Out of tries! The word was: \"${solution}\"",
	"❌ So close! The word was: \"${solution}\"",
	"❌ No more guesses left. The word was: \"${solution}\"",
	"❌ Don't give up! The word was: \"${solution}\"",
	"❌ That's all! The word was: \"${solution}\"",
	"❌ Almost had it! The word was: \"${solution}\"",
	"❌ The word you missed: \"${solution}\"",
	"❌ Time's up! The word was: \"${solution}\""
];

const successMessages: string[] = [
	"🔥 Nailed it!",
	"🎯 Spot on!",
	"✅ Correct! You cracked it!",
	"🧠 Genius! You guessed it!",
	"🎊 Boom! That’s the word!",
	"🚀 You crushed it!",
	"🙌 Right on! Well played!",
	"🟢 That’s a win!",
	"👏 Bravo! You got the word!",
	"🌟 Perfect guess!"
];
export const randomSuccessMessage = successMessages[Math.floor(Math.random() * successMessages.length)]
const randomIndex = Math.floor(Math.random() * gameOverMessages.length);
export const randomFailureMessage = (solution: string) => gameOverMessages[randomIndex].replace('${solution}', solution);
