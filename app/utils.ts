import { WORDS } from "./words";

export function getRandomWord():string {
	return WORDS[Math.floor(Math.random() * WORDS.length)].toLowerCase();
}
