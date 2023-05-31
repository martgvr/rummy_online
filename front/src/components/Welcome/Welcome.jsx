import './welcome.css'
import React, { useState } from "react"

import WelcomeMenu from '../WelcomeMenu/WelcomeMenu'
import WelcomeLobby from '../WelcomeLobby/WelcomeLobby'
import GoldenFrames from '../GoldenFrames/GoldenFrames'
import WelcomeNewLobby from '../WelcomeNewLobby/WelcomeNewLobby'

function Welcome() {
    const [roomID, setRoomID] = useState('')
    const [activeMenu, setActiveMenu] = useState('initial')

	return(
        <div className="welcome__container flex-row">
            <GoldenFrames />
            
            { activeMenu == 'lobby' && <WelcomeLobby roomID={roomID} setActiveMenu={setActiveMenu} /> }
            { activeMenu == 'new-lobby' && <WelcomeNewLobby roomID={roomID} setActiveMenu={setActiveMenu} /> }
            { activeMenu == 'initial' && <WelcomeMenu setActiveMenu={setActiveMenu} setRoomID={setRoomID} /> }
        </div>
    )
}

export default Welcome
