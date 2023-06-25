import React from 'react'
import './gametableopponents.css'

function GametableOpponents({ opponents }) {
  return (
    <div className="gametable__opponents flex-column">
        {
            opponents.map(opponent => 
                <div key={opponent}>
                    <img src="https://i.pinimg.com/originals/82/68/c7/8268c7aadf0a9077396836037307adeb.jpg" alt="" />
                    <p>{opponent.nickname}</p>
                </div>
            )
        }
    </div>
  )
}

export default GametableOpponents