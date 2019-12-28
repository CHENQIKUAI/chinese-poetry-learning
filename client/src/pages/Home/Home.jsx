import React, { Component } from "react";
import { getToken } from "../../utils/token";
import { profile } from "../../services/HomeService";
import { Button } from "antd";
import { SIGNOUT_PATH } from "../../constants/const";

class Home extends Component {
    state = {
        msg: null
    }


    UNSAFE_componentWillMount() {
        this.checkToken();
    }

    async componentDidMount() {
        const ret = await profile();
        const msg = JSON.stringify(ret);
        this.setState({
            msg
        })
    }


    checkToken = () => {
        const token = getToken();
        if (!token) {
            this.props.history.push("/signin");
        }
    }

    handleSignout = () => {
        this.props.history.push(SIGNOUT_PATH)
    }


    render() {

        return (
            <div>
                {this.state.msg}

                <Button onClick={this.handleSignout}>退出</Button>
            </div>
        )
    }
}


export default Home;