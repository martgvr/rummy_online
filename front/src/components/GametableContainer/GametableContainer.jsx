import "./gametablecontainer.css"
import { socket } from "../../services/socket"
import React, { useEffect, useState } from "react"

import LobbyChat from "../LobbyChat/LobbyChat"
import GametableStand from "../GametableStand/GametableStand"
import GametableButtons from "../GametableButtons/GametableButtons"

function GametableContainer() {
	const [cards, setCards] = useState([])
    const [myTurn, setMyTurn] = useState(false)
    const [opponents, setOpponents] = useState([])

	useEffect(() => {
		socket
			.on("gameData", (cards, opponents) => {
				setCards(cards)
				setOpponents(opponents)
			})

			.on("yourTurn", (value) => {
				setMyTurn(value)
				console.log('turno', value);
			})
	}, [])
	
	const passHandler = () => socket.emit("pass")
	const askTileHandler = () => socket.emit("asktile")

	return (
		<div className="gametablecontainer">

			<div className="gametable__opponents flex-column">
				{
					opponents.map(opponent => 
						<div key={opponent}>
							<img src="https://i.pinimg.com/originals/82/68/c7/8268c7aadf0a9077396836037307adeb.jpg" alt="" />
							<p>{opponent.nickname}</p>
						</div>
					)
				}
			</div>

			<LobbyChat />
			<GametableStand cards={cards} />
			{
				myTurn && <GametableButtons passHandler={passHandler} askTileHandler={askTileHandler} />
			}

			<div className="gametable__board flex-row">
				<div className="gametable__board--grid flex-row">
					<p>gametable</p>
				</div>

				<div className="gametable__board--alert flex-row" style={{ display: myTurn ? 'flex' : 'none' }}>
					<h1>Es tu turno!</h1>
				</div>
			</div>
		</div>
	)
}

export default GametableContainer
