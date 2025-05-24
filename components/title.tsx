import { Dancing_Script } from 'next/font/google'

const dancingScript = Dancing_Script({
	subsets: ['latin'],
	weight: ['400', '700'], // Dancing Script supports multiple weights
	display: 'swap',
})

export default function Title({classname}: {classname?: string}) {
	return (
		<h1 className={`${dancingScript.className} ${classname}`}>
			Guess
		</h1>
	)
}