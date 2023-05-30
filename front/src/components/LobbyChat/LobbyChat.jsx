import "./lobbychat.css"
import { socket } from "../../services/socket"
import React, { useState, useEffect } from "react"

function LobbyChat() {
	const [messages, setMessages] = useState([])

	useEffect(() => {
		const handleNewMessage = (clientID, message) => {
			setMessages((existingMessages) => [...existingMessages, { clientID: clientID, message: message }])
		}

		socket.on("newMessage", handleNewMessage)

		return () => {
			socket.off("newMessage", handleNewMessage)
		}
	}, [])

	const sendMessageHandler = () => {
		const message = document.getElementById("message").value
		socket.emit("sendMessage", message)
		document.getElementById("message").value = ""
	}

	const handleKeyDown = (event) => event.key === "Enter" && sendMessageHandler()

	return (
		<div className="lobbychat__container flex-column">
			<ul>
				{messages.map((item, index) => (
					<li key={index}>
						[{item.clientID}]: {item.message}
					</li>
				))}
			</ul>

			<div className="lobbychat__inputcontainer flex-row">
				<input type="text" name="message" id="message" placeholder="Escribe un mensaje aquí" className="lobbychat__input" onKeyDown={handleKeyDown} />
				<img src="https://cdn-icons-png.flaticon.com/512/60/60525.png" alt="" onClick={sendMessageHandler} />
			</div>
		</div>
	)
}

export default LobbyChat
