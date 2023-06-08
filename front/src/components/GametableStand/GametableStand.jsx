import React from "react"
import './gametablestand.css'

import GametableTile from "../GametableTile/GametableTile"

function GametableStand({ cards }) {
	return(
        <div className="gametable__stand flex-row">
            {
                cards.map(card => <GametableTile number={card} />)
            }
        </div>
    )
}

export default GametableStand
