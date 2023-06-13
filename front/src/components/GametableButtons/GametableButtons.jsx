import React from "react"
import './gametablebuttons.css'

function GametableButtons({ passHandler, askTileHandler }) {
	return (
        <div className="gametablebuttons flex-column">
            <button onClick={passHandler}>Finalizar turno</button>
            <button onClick={askTileHandler}>Pedir ficha</button>
        </div>
    )
}

export default GametableButtons
