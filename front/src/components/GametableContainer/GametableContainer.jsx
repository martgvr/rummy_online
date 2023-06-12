import "./gametablecontainer.css"
import React, { useEffect } from "react"

import GametableStand from "../GametableStand/GametableStand"
import LobbyChat from "../LobbyChat/LobbyChat"

function GametableContainer({ cards, opponents }) {
	useEffect(() => {
		console.log("Oponentes:", opponents)
	}, [])

	return (
		<div className="gametablecontainer flex-column">

			<div className="gametable__opponents flex-column">
				{
					opponents.map(opponent => 
						<div>
							<img src="https://i.pinimg.com/originals/82/68/c7/8268c7aadf0a9077396836037307adeb.jpg" alt="" />
							<p>{opponent.nickname}</p>
						</div>
					)
				}
			</div>

			<LobbyChat />
			<GametableStand cards={cards} />
		</div>
	)
}

export default GametableContainer
