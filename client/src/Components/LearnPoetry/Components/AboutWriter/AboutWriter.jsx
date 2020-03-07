import React from 'react'
import { withRouter } from "react-router-dom"
import "./style.less"
import { POETRY_LEARNING } from '../../../Menu/menuConstants'

function AboutWriter({ name, headImageUrl, simpleIntro, history, goToWriter }) {

    function handleClickWriter() {
        history && history.push(`${POETRY_LEARNING}?writer=${name}`)
        goToWriter && goToWriter();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
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