import './welcome.css'
import { socket } from "../../services/socket"
import React, { useEffect, useState } from "react"

import WelcomeMenu from '../WelcomeMenu/WelcomeMenu'
import WelcomeLobby from '../WelcomeLobby/WelcomeLobby'
import GoldenFrames from '../GoldenFrames/GoldenFrames'
import WelcomeNewLobby from '../WelcomeNewLobby/WelcomeNewLobby'
import LobbyCountdown from '../LobbyCountdown/LobbyCountdown'

function Welcome() {
    const [roomID, setRoomID] = useState('')
    const [countdown, setCountdown] = useState(10)
    const [activeMenu, setActiveMenu] = useState('initial')

    useEffect(() => {
		socket.on("roomCreated", (roomID) => {
            setRoomID(roomID)
            setActiveMenu('new-lobby')
        })
        socket.on("joinSuccess", (roomID) => {
            setRoomID(roomID)
            setActiveMenu('lobby')
        })

        socket.on("leaveSuccess", () => setActiveMenu("initial"))
        
        socket.on("startGameCountdown", (time) => {
            setActiveMenu("lobby-countdown")
            setCountdown(time)
        })
	}, [])

	return(
        <div className="welcome__container flex-row">
            <GoldenFrames />
            
            { activeMenu == 'lobby' && <WelcomeLobby roomID={roomID} /> }
            { activeMenu == 'initial' && <WelcomeMenu setRoomID={setRoomID} /> }
            { activeMenu == 'new-lobby' && <WelcomeNewLobby roomID={roomID} /> }
            { activeMenu == 'lobby-countdown' && <LobbyCountdown time={countdown} /> }
        </div>
    )
}

export default Welcome
