import React from "react"
import './gametablestand.css'

import GametableTile from "../GametableTile/GametableTile"

function GametableStand({ cards, last }) {
	return(
        <div className="gametable__stand flex-row">
            {
                cards.map(card => <GametableTile key={card} number={card} last={card == last && true} />)
            }
        </div>
    )
}

export default GametableStand
