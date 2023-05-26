import './welcomemenu.css'
import React, { useEffect } from "react"
import { socket } from "../../services/socket"

function WelcomeMenu() {
    useEffect(() => {
		socket.on("roomCreated", (roomID) => console.log(`Sala creada con ID: ${roomID}`))
	}, [])

    const createRoom = () => socket.emit('createRoom')
    
    const joinRoom = () => {
        const roomID = document.getElementById('roomID').value
        socket.emit('joinRoom', roomID)
    }
    
    const sendMessage = () => {
        const message = document.getElementById('message').value
        socket.emit('sendMessage', message)
    }

	return(
        <div className="welcomemenu__container flex-column">
            <h1>Bienvenido!</h1>
    
            <button className="welcomemenu__button" onClick={createRoom}>Crear sala aleatoria</button>

            <div className="flex-column">
                <input type="text" name="roomID" id="roomID" placeholder="ID de sala" />
                <button className="welcomemenu__button" onClick={joinRoom}>Entrar a sala</button>
            </div>

            <div className="flex-column">
                <input type="text" name="message" id="message" placeholder="Mensaje" />
                <button className="welcomemenu__button" onClick={sendMessage}>Enviar mensaje</button>
            </div>
        </div>
    )
}

export default WelcomeMenu
