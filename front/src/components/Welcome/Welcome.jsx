import './welcome.css'
import React, { useState } from "react"

import WelcomeMenu from '../WelcomeMenu/WelcomeMenu'
import GoldenFrames from '../GoldenFrames/GoldenFrames'
import WelcomeNewLobby from '../WelcomeNewLobby/WelcomeNewLobby'

function Welcome() {
    const [roomID, setRoomID] = useState('')
    const [activeMenu, setActiveMenu] = useState('initial')

	return(
        <div className="welcome__container flex-row">
            <GoldenFrames />
            { activeMenu == 'new-lobby' && <WelcomeNewLobby roomID={roomID} /> }
            { activeMenu == 'initial' && <WelcomeMenu setActiveMenu={setActiveMenu} setRoomID={setRoomID} /> }
        </div>
    )
}

export default Welcome
