import React, { Component } from "react";
import { clearToken, clearType, clearUsername } from "../../utils/localStorageManagement";
import { SIGNIN_PATH } from "../../const";
import { message } from "antd";

class Signout extends Component {

    componentDidMount() {
        clearToken();
        clearType();
        clearUsername();
        this.redirect();
        message.success("退出成功")
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

