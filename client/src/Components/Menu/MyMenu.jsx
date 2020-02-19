import React, { Component } from "react"
import { Menu } from "antd"

import "./MyMenu.less"
import { POETRY_MANAGEMENT, PERSONAL_SETTING } from "./menuConstants";

class MyMenu extends Component {

    state = {
        selectedKey: null,
        openKeys: [],
    }

    getFirstPath = () => {
        const pathname = this.props.history.location.pathname;
        const path = "/" + pathname.split("/")[1];
        return path;
    }

    UNSAFE_componentWillMount() {

        const menuConfig = this.props.menuConfig;
        const pathname = this.props.history.location.pathname;
        let selectedKey = null;
        if (pathname === "/") {
            const first_key = menuConfig[0].key;
            this.props.history.push(first_key);
            selectedKey = first_key;
        } else {
            const path = this.getFirstPath();
            selectedKey = path;
        }
        this.setState({
            selectedKey
        })

        const openKeys = [];
        menuConfig.map((item) => {
            if (item && item.children && Array.isArray(item.children)) {
                openKeys.push(item.key)
            }
        })
        this.setState({
            openKeys
        })


        window.onhashchange = (e) => {
            const pathname = this.props.history.location.pathname;
            this.setState({
                selectedKey: pathname

            })
        }

    }


    handleClickMenuItem = (param) => {
        const path = param.key;
        this.props.history.push(path);
        this.setState({
            selectedKey: path
        })
    }

    getMenuProps = () => {
        return {
            theme: "dark",
            mode: "inline",
            className: "my-menu",
            onClick: this.handleClickMenuItem,
            selectedKeys: [this.state.selectedKey],
            openKeys: this.state.openKeys,
        }
    }

    render() {
        return (
            <Menu {...this.getMenuProps()}>
                {this.props.menuConfig.map(item => {
                    if (item.children && item.children.length !== 0) {
                        const children = item.children;
                        return (
                            <Menu.SubMenu key={item.key} title={item.title}>
                                {
                                    children.map((i) => {
                                        return (
                                            <Menu.Item key={i.key}>
                                                <p className="nav-text">{i.title}</p>
                                            </Menu.Item>
                                        )
                                    })
                                }
                            </Menu.SubMenu>
                        )
                    } else {
                        return (
                            <Menu.Item key={item.key}>
                                <p className="nav-text">{item.title}</p>
                            </Menu.Item>
                        );
                    }
                })}
            </Menu>
        )
    }
}

export default MyMenu;