import './gametabletile.css'
import React, { useEffect, useState } from "react"

function GametableTile({ number }) {
    const [color, setColor] = useState('')
    const [visualizedNumber, setVisualizedNumber] = useState('')
    
    useEffect(() => {
        if ((number >= 1) && (number <= 13)) { setVisualizedNumber(number) }
        if ((number >= 14) && (number <= 26)) { setVisualizedNumber(number - 13) }
        if ((number >= 27) && (number <= 39)) { setVisualizedNumber(number - 26) }
        if ((number >= 40) && (number <= 52)) { setVisualizedNumber(number - 39) }
        if ((number >= 53) && (number <= 65)) { setVisualizedNumber(number - 52) }
        if ((number >= 66) && (number <= 78)) { setVisualizedNumber(number - 65) }
        if ((number >= 79) && (number <= 91)) { setVisualizedNumber(number - 78) }
        if ((number >= 92) && (number <= 104)) { setVisualizedNumber(number - 91) }
        if (number == 105) { setVisualizedNumber('X') }
        if (number == 106) { setVisualizedNumber('X') }

        if ((number >= 1) && (number <= 26)) { setColor('#c7141a') }
        if ((number >= 27) && (number <= 52)) { setColor('#0068a8') }
        if ((number >= 53) && (number <= 78)) { setColor('#b09e00') }
        if ((number >= 79) && (number <= 104)) { setColor('#222') }

        console.log(`${number}\t>\t ${visualizedNumber}`);
    }, [])

	return(
        <div className="gametable__tile flex-row" draggable>
            <h1 style={{color: color}}>{visualizedNumber}</h1>
        </div>
    )
}

export default GametableTile
