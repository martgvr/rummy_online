import "./gametabletile.css"
import React, { useEffect, useState } from "react"
import { formatNumber } from "../../services/formatNumber"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function GametableTile({ number, last }) {
	const [numberProps, setNumberProps] = useState("")
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: number })

	useEffect(() => setNumberProps(formatNumber(number)), [])

	const style = { transform: CSS.Transform.toString(transform), transition }

	return (
		<div className="gametable__tile flex-row" style={style} {...attributes} {...listeners} ref={setNodeRef} >
			<h1 style={{ color: numberProps.colorToShow }}>{numberProps.numberToShow}</h1>
		</div>
	)
}

export default GametableTile
