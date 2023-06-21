import './gametabletile.css'
import React, { useEffect, useState } from "react"
import { formatNumber } from "../../services/formatNumber"

function GametableTile({ number, last }) {
    const [numberProps, setNumberProps] = useState('')
    
    useEffect(() => setNumberProps(formatNumber(number)), [])

	return(
        <div className="gametable__tile flex-row" draggable style={{ boxShadow: last ? '0px 0px 12px 0px rgba(139, 235, 91, 0.8)' : '' }} >
            <h1 style={{color: numberProps.colorToShow}}>{numberProps.numberToShow}</h1>
        </div>
    )
}

export default GametableTile
