import React, { Component } from "react";
import logoutIcon from "../../img/logout.svg";

import "./Logout.less"
import { SIGNOUT_PATH } from "../../constants/const";
import { Modal } from "antd";

class Logout extends Component {

    handleClickIcon = () => {
        Modal.confirm({
            title: "确认要退出登录？",
            onOk: this.handleSignout,
        })
    }

    handleSignout = () => {
        this.props.history.push(SIGNOUT_PATH)
    }

    render() {
        return (
            <>
                <div onClick={this.handleClickIcon} className="cmp-logout" style={this.props.style}>
                    <img src={logoutIcon} className="icon-logout" />
                    <span className="text-logout">
                        退出
                    </span>
                </div>
            </>
        )
    }
}

export default Logout;