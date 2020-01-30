import React, { Component } from "react"
import { Menu, Icon } from "antd"
import { MENU_ADMIN } from "./const";

import "./MyMenu.less"

class MyMenu extends Component {

    state = {
        selectedKey: null
    }

    UNSAFE_componentWillMount() {

        const pathname = this.props.history.location.pathname;
        let selectedKey = null;
        if (pathname === "/") {
            const first_key = MENU_ADMIN[0].key;
            this.props.history.push(first_key);
            selectedKey = first_key;
        } else {
            selectedKey = pathname;
        }
        this.setState({
            selectedKey
        })

    }


    handleClickMenuItem = (param) => {
        const path = param.key;
        this.props.history.push(path);
        this.setState({
            selectedKey: path
        })
    }

    render() {
        return <>
            <Menu theme="dark" mode="inline" className="my-menu" onClick={this.handleClickMenuItem} selectedKeys={[this.state.selectedKey]}>
                {MENU_ADMIN.map(item => (
                    <Menu.Item key={item.key}>
                        <p className="nav-text">{item.title}</p>
                    </Menu.Item>
                ))
                }
            </Menu>
        </>
    }
}

export default MyMenu;