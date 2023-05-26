import './welcome.css'
import React from "react"
import GoldenFrames from '../GoldenFrames/GoldenFrames'
import WelcomeMenu from '../WelcomeMenu/WelcomeMenu'

function Welcome() {
	return(
        <div className="welcome__container flex-row">
            <GoldenFrames />
            <WelcomeMenu />
        </div>
    )
}

export default Welcome
