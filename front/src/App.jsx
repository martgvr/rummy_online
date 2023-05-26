import "./App.css"
import { useEffect } from "react"
import { socket } from "./services/socket"

import Welcome from "./components/Welcome/Welcome"

function App() {
	useEffect(() => {
		socket.connect()
		socket.on("log", (value) => console.log(value))
	}, [])

	return (
		<>
			<Welcome />
		</>
	)
}

export default App
