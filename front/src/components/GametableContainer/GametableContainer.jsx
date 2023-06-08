import "./gametablecontainer.css"
import { socket } from "../../services/socket"
import React, { useEffect, useState } from "react"
import GametableStand from "../GametableStand/GametableStand";

function GametableContainer({ cards }) {
  useEffect(() => {
    console.log('Cartas:', cards);
  }, [])

	return(
    <div className="gametablecontainer">
      <GametableStand cards={cards} />
    </div>
  )
}

export default GametableContainer
