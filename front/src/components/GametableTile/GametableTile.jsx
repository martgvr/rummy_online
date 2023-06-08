import React from "react"
import './gametabletile.css'

function GametableTile({ number }) {
	return(
        <div className="gametable__tile flex-row">
            <h1>{number}</h1>
        </div>
    )
}

export default GametableTile
