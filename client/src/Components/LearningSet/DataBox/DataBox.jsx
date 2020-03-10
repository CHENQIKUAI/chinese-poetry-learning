import React from 'react'
import "./style.less"

export default function DataBox({ number, unit, belong }) {
    return (
        <div className="data-box">
            <span className="first-line">
                <span className="number">{number}</span>
                {unit}
            </span>
            <div className="block" />
            <span className="second-line">
                {belong}
            </span>
        </div>
    )
}
