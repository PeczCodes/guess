import {NextResponse} from "next/server";


let cheat = ""
export async function POST(req: Request){
	cheat = await req.json()
	return NextResponse.json({message: "Solution found", status: 200})
}
export function GET(){
	if(!cheat){return NextResponse.json({message: "No solution found"})}
	return NextResponse.json({
		message: `Solution for this round is ${cheat}`
	})
}