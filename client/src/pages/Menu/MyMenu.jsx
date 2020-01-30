import React, { Component } from "react"
import { Menu, Icon } from "antd"
import { MENU_ADMIN } from "./const";

import "./MyMenu.less"

const SubMenu = Menu.SubMenu;

class MyMenu extends Component {

    componentDidMount() {

    }

    handleClickMenuItem = (param) => {
        const path = param.key;
        this.props.history.push(path);
    }

    render() {
        return <>
            <Menu theme="dark" mode="inline" className="my-menu" onClick={this.handleClickMenuItem} >
                {MENU_ADMIN.map(item => (
                    <Menu.Item key={item.key}>
                        <p className="nav-text">{item.title}</p>
                    </Menu.Item>
                ))
                }

                <SubMenu title="123" key="sub1">
                    <Menu.Item key="menu1">654654</Menu.Item>
                </SubMenu>
            </Menu>
        </>
    }
}

export default MyMenu;