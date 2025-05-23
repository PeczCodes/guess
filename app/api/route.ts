import {NextResponse} from "next/server";

const api = "https://api.frontendexpert.io/api/fe/wordle-words"

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

