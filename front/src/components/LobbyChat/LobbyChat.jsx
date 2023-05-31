import "./lobbychat.css"
import { socket } from "../../services/socket"
import React, { useState, useEffect } from "react"

function LobbyChat() {
	const [messages, setMessages] = useState([])

	useEffect(() => {
		const handleNewMessage = (clientID, nickname, message) => {
			setMessages((existingMessages) => [...existingMessages, { clientID: clientID, nickname: nickname, message: message }])
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
					<>
						{
							item.clientID == '' ?
							<li key={index} className="lobbychat__container--system">
								{item.message}
							</li>
							:
							<li key={index} className="lobbychat__container--message flex-row">
								<p>[{item.nickname}]:</p>
								<p>{item.message}</p>
							</li>
						}
					</>
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
