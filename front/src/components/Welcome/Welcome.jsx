import './welcome.css'
import { socket } from "../../services/socket"
import React, { useEffect, useState } from "react"

import WelcomeMenu from '../WelcomeMenu/WelcomeMenu'
import WelcomeLobby from '../WelcomeLobby/WelcomeLobby'
import GoldenFrames from '../GoldenFrames/GoldenFrames'
import LobbyCountdown from '../LobbyCountdown/LobbyCountdown'
import WelcomeNewLobby from '../WelcomeNewLobby/WelcomeNewLobby'
import GametableContainer from '../GametableContainer/GametableContainer'

function Welcome() {
    const [cards, setCards] = useState([])
    const [opponents, setOpponents] = useState([])

    const [roomID, setRoomID] = useState('')
    const [countdown, setCountdown] = useState(10)
    const [activeMenu, setActiveMenu] = useState('initial')

    useEffect(() => {
		socket
            .on("roomCreated", (roomID) => {
                setRoomID(roomID)
                setActiveMenu('new-lobby')
            })

            .on("joinSuccess", (roomID) => {
                setRoomID(roomID)
                setActiveMenu('lobby')
            })

            .on("startGameCountdown", (time) => {
                setActiveMenu("lobby-countdown")
                setCountdown(time)
            })
            
            .on("startGame", () => setActiveMenu("gametable"))
            .on("leaveSuccess", () => setActiveMenu("initial"))

            .on("gameData", (cards, opponents) => {
                setCards(cards)
                setOpponents(opponents)
            })
	}, [])

	return(
        <div className="welcome__container flex-row">
            <GoldenFrames />
            { activeMenu == 'lobby' && <WelcomeLobby roomID={roomID} /> }
            { activeMenu == 'initial' && <WelcomeMenu setRoomID={setRoomID} /> }
            { activeMenu == 'new-lobby' && <WelcomeNewLobby roomID={roomID} /> }
            { activeMenu == 'lobby-countdown' && <LobbyCountdown time={countdown} /> }
            { activeMenu == 'gametable' && <GametableContainer cards={cards} opponents={opponents} /> }
        </div>
    )
}

export default Welcome
