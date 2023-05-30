import './welcomemenu.css'
import React, { useEffect } from "react"
import { socket } from "../../services/socket"

function WelcomeMenu({ setActiveMenu, setRoomID }) {
    useEffect(() => {
		socket.on("roomCreated", (roomID) => {
            console.log(`Sala creada con ID: ${roomID}`)
            setActiveMenu('new-lobby')
            setRoomID(roomID)
        })

        socket.on("joinSuccess", (roomID) => {
            setActiveMenu('lobby')
            setRoomID(roomID)
        })
	}, [])

    const createRoom = () => socket.emit('createRoom')
    
    const joinRoom = () => {
        const roomID = document.getElementById('roomID').value
        socket.emit('joinRoom', roomID)
    }

	return(
        <div className="welcomemenu__container flex-column">
            <h1>Bienvenido!</h1>
    
            <div className="flex-column">
                <input type="text" name="roomID" id="roomID" placeholder="ID de sala" />
                <button className="welcomemenu__button" onClick={joinRoom}>Entrar a sala</button>
            </div>
            
            <div className="flex-column">
                <button className="welcomemenu__button" onClick={createRoom}>Crear sala aleatoria</button>
            </div>
        </div>
    )
}

export default WelcomeMenu
