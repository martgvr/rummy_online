import './welcomemenu.css'
import { socket } from "../../services/socket"
import React, { useEffect, useState } from "react"

function WelcomeMenu({ setActiveMenu, setRoomID }) {
    const [nickname, setNickname] = useState('')
    const [room, setRoom] = useState('')

    useEffect(() => {
		socket.on("roomCreated", (roomID) => {
            setRoomID(roomID)
            setActiveMenu('new-lobby')
        })

        socket.on("joinSuccess", (roomID) => {
            setRoomID(roomID)
            setActiveMenu('lobby')
        })
	}, [])

    const createRoom = () => (nickname.length > 2) && socket.emit('createRoom', nickname)
    const joinRoom = () => ((room.length > 0) && (nickname.length > 0)) && socket.emit('joinRoom', room, nickname)
    
    const handleNickname = (e) => setNickname(e.target.value)
    const handleRoom = (e) => setRoom(e.target.value)

	return(
        <div className="welcomemenu__container flex-column">
            <h1>Bienvenido!</h1>

            <div className="flex-column">
                <input type="text" name="nickname" id="nickname" placeholder="Ingrese un nick (mínimo 3 caracteres)" onChange={handleNickname} />
            </div>
    
            <div className="flex-column">
                <button className={`welcomemenu__button ${nickname.length > 2 ? '' : 'disable'}`} onClick={createRoom} >Crear sala aleatoria</button>
                <button className={`welcomemenu__button ${nickname.length > 2 ? '' : 'disable'}`} onClick={joinRoom}>Entrar a sala</button>
                <input type="text" name="roomID" id="roomID" placeholder="ID de sala" onChange={handleRoom} />
            </div>
        </div>
    )
}

export default WelcomeMenu
