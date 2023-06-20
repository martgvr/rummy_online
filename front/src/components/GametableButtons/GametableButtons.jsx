import React from "react"
import './gametablebuttons.css'

function GametableButtons({ passHandler }) {
	return (
        <div className="gametablebuttons flex-column">
            <button onClick={passHandler}>Finalizar turno</button>
        </div>
    )
}

export default GametableButtons
