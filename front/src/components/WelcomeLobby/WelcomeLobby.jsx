import { socket } from "../../services/socket"
import React, { useEffect, useState } from "react"

import LobbyChat from "../LobbyChat/LobbyChat"

function WelcomeLobby({ roomID }) {
	const [clients, setClients] = useState([])

	useEffect(() => {
		socket.on("clientConnected", (value) => setClients(value))
	}, [])

	const leaveRoomHandler = () => socket.emit("leaveRoom")
	const copyHandler = () => navigator.clipboard.writeText(roomID)

	return (
		<div className="welcomenewlobby__container flex-row">
			<div className="welcomenewlobby__data">
				<h2>Preparate!</h2>

				<div className="welcomenewlobby__id flex-row">
					<h4>ID: {roomID}</h4>
					<img src="https://img.uxwing.com/wp-content/themes/uxwing/download/file-folder-type/copy-icon.png" alt="" onClick={copyHandler} />
				</div>

				<p>Esperando oponentes...</p>

				<ul className="welcomenewlobby__clients flex-column" id="clients-list">
				{
                        clients.map(client => 
                            <li key={client.nickname} className='flex-row'><img src="https://i.pinimg.com/originals/82/68/c7/8268c7aadf0a9077396836037307adeb.jpg" alt="" /> {client.nickname}</li>
                        )
                    }
				</ul>

				<div className="welcomenewlobby__buttons flex-row">
					<button className="welcomemenu__button redcolor" onClick={leaveRoomHandler}>
						Salir de la sala
					</button>
				</div>
			</div>

			<LobbyChat />
		</div>
	)
}

export default WelcomeLobby
