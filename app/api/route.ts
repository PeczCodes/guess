import {NextResponse} from "next/server";
import dotenv from 'dotenv';
import OpenAI from 'openai';


dotenv.config()

const api = "https://api.frontendexpert.io/api/fe/wordle-words"

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.LLAMA,
});


const fetchWords = async() => {
	const response = await fetch(api)
	return await response.json()
}

export async function GET(){
	try {
		const response = await fetchWords()
		return NextResponse.json(response)
	}
	catch(error){
		return NextResponse.json({
			message: 'Failed to fetch words', error,
			status: 500,
		})
	}
}

export async function POST(req: Request){
	try {
		const solution = await req.json()
		
		const completion = await openai.chat.completions.create({
			model: "meta-llama/llama-3.3-8b-instruct:free",
			messages: [
				{
					"role": "user",
					"content": `I'm playing a wordle game. The solution is '${solution}'. Give me a brief sentence that hints the player to the solution, no side talks.`
				}
			],
			
		});
		return NextResponse.json({message: completion.choices[0].message.content})
	}
	catch(error){
		return NextResponse.json({
			message: 'Failed to fetch words', error,
			status: 500,
		})
	}
}
