import React, { Component } from "react";
import { clearToken } from "../../utils/token";
import { SIGNIN_PATH } from "../../constants/const";
import { message } from "antd";

class Signout extends Component {

    UNSAFE_componentWillMount() {
        clearToken();
        this.redirect();
        message.info("退出成功")
    }

    redirect = () => {
        this.props.history.push(SIGNIN_PATH);
    }

    render() {
        return (
            <div>
                Signout...
            </div>
        )
    }
}

export default Signout;

