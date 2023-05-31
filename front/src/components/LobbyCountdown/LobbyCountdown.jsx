import React from 'react'
import './lobbycountdown.css'

function LobbyCountdown({ time }) {
  return (
    <div className='lobbycountdown__container flex-column'>
      <h1>Iniciando partida!</h1>
      <p>{time}</p>
    </div>
  )
}

export default LobbyCountdown