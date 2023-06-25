import "./gametablecontainer.css"
import { socket } from "../../services/socket"
import React, { useEffect, useState } from "react"

import LobbyChat from "../LobbyChat/LobbyChat"
import GametableBoard from "../GametableBoard/GametableBoard"
import GametableStand from "../GametableStand/GametableStand"
import GametableButtons from "../GametableButtons/GametableButtons"
import GametableOpponents from "../GametableOpponents/GametableOpponents"

function GametableContainer() {
	const [cards, setCards] = useState([])
	const [newCard, setNewCard] = useState('')
    const [myTurn, setMyTurn] = useState(false)
    const [opponents, setOpponents] = useState([])

	useEffect(() => {
		socket
			.on("gameData", (cards, opponents) => {
				setCards(cards)
				setOpponents(opponents)
			})

			.on("yourTurn", (value, card) => {
				setMyTurn(value)
				setNewCard(card)
			})
	}, [])
	
	const passHandler = () => socket.emit("pass")

	return (
		<div className="gametablecontainer">
			<LobbyChat />
			<GametableOpponents opponents={opponents} />
			<GametableButtons passHandler={passHandler} myTurn={myTurn} /> 
			<GametableBoard newCard={newCard} myTurn={myTurn} />
			<GametableStand cards={cards} last={newCard} setCards={setCards} />
		</div>
	)
}

export default GametableContainer
