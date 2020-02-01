import React, { Component } from "react"
import "./Username.less"

class Username extends Component {

    render() {
        return (
            <div className="cmp-username">
                <span>{this.props.username}</span>
            </div>
        )

    }
}