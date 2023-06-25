import React from "react"
import "./gametableboard.css"
import GametableTile from "../GametableTile/GametableTile"

function GametableBoard({ newCard, myTurn }) {
	return (
		<div className="gametable__board flex-row">
			<div className="gametable__board--grid flex-row">
				<p>gametable</p>
			</div>

			<div className="gametable__board--alert flex-column" style={{ display: myTurn ? "flex" : "none" }}>
				<h1>Es tu turno!</h1>
				{newCard != undefined && <GametableTile number={newCard} />}
			</div>
		</div>
	)
}

export default GametableBoard
