import './welcomenewlobby.css'
import React, { useEffect, useState } from "react"
import { socket } from "../../services/socket"

function WelcomeNewLobby({ roomID }) {
    const [clients, setClients] = useState([])

    useEffect(() => {
		socket.on("clientConnected", (value) => {
            setClients(oldClients => [...oldClients, value])

            console.log(clients.find(client => client == value))
        })
	}, [])

    useEffect(() => {
        console.log(clients)
	}, [clients])

	return(
        <div className="welcomenewlobby__container flex-column">
            <h2>Nueva sala creada</h2>
            <h4>ID: {roomID}</h4>
            <p>Esperando oponentes...</p>

            <ul id='clients-list'>
                {
                    clients.map(client => 
                        <li key={client}>{client}</li>
                    )
                }
            </ul>

            <div className="welcomenewlobby__buttons flex-row">
                <button className="welcomemenu__button redcolor">Salir del lobby</button>
                <button className="welcomemenu__button">Iniciar partida</button>
            </div>
        </div>
    )
}

export default WelcomeNewLobby
