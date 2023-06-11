import "./gametablecontainer.css"
import React, { useEffect } from "react"

import GametableStand from "../GametableStand/GametableStand"

function GametableContainer({ cards, opponents }) {
	useEffect(() => {
		console.log("Oponentes:", opponents)
	}, [])

	return (
		<div className="gametablecontainer">
			<GametableStand cards={cards} />
		</div>
	)
}

export default GametableContainer
