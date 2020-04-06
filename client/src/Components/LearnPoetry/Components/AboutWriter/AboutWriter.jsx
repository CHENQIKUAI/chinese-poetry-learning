import React from 'react'
import { withRouter } from "react-router-dom"
import "./style.less"
import { LEARNING_CENTER } from '../../../Menu/menuConstants'

function AboutWriter({ name, headImageUrl, simpleIntro, history, goToWriter }) {

    function handleClickWriter() {
        history && history.push(`${LEARNING_CENTER}?writer=${name}`)
        goToWriter && goToWriter();
        window.scrollTo({
            top: 0,
        });
    }

    return (
        <div className="about-writer-container">
            <div className="div-image" onClick={handleClickWriter}>
                <img src={headImageUrl} alt={name} />
            </div>
            <p className="name" onClick={handleClickWriter}>
                {name}
            </p>
            <p className="simpleIntro">
                {simpleIntro}
            </p>
        </div>
    )
}

export default withRouter(AboutWriter)