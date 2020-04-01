import React, { Component } from "react";
import { Layout, message } from 'antd';
import {
    Route,
} from "react-router-dom";
import { getToken, getType, USER_TYPE, ADMIN_TYPE } from "../../utils/localStorageManagement";
import { profile } from "../../services/HomeService";

import MyMenu from "../../Components/Menu/MyMenu";
import Logout from '../../Components/Logout/Logout';
import Time from '../../Components/Time/Time';


import "./Home.less"
import { MENU_ADMIN, MENU_USER } from "../../Components/Menu/menuConstants";
import { getNotify } from "../../services/cron";
import Cron from "../../Components/Cron/Cron";

const { Header, Content, Sider } = Layout;

class Home extends Component {
    state = {
        crons: []
    }

    UNSAFE_componentWillMount() {
        this.checkToken();
    }

    fetchProfile = async () => {
        const ret = await profile();
        if (ret.code === -1) {
            this.props.history.push("/signin");
            message.error("请先登录")
        }
    }

    fetchCrons = () => {
        getNotify().then(ret => {
            if (ret && ret.code === 1) {
                this.setState({
                    crons: ret.result
                })
            }
        })
    }

    componentDidMount() {
        this.fetchProfile();
        this.fetchCrons();
    }

    checkToken = () => {
        const token = getToken();
        if (!token) {
            this.props.history.push("/signin");
        }
    }

    render() {

        const TYPE = getType();
        const MENU_CONFIG = TYPE === ADMIN_TYPE ? MENU_ADMIN : MENU_USER;

        return (
            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                >
                    {TYPE === USER_TYPE ?
                        (<div className="sider-logo" >
                            中小学生古诗词学习系统
                        </div>) :
                        (<div className="sider-logo" >
                            古诗学习后台管理
                        </div>)
                    }
                    <MyMenu history={this.props.history} menuConfig={MENU_CONFIG} />
                </Sider>
                <Layout id="my-layout">
                    <Header style={{ background: '#fff', padding: 0 }} className="header">
                        <div>
                            <Time style={{ marginLeft: "16px" }} />
                            <Logout history={this.props.history} style={{ float: "right", marginRight: "16px" }} />
                        </div>
                    </Header>
                    <Content style={{ margin: '24px 16px 0' }}>

                        <div style={{ padding: 24, background: '#fff' }}>
                            {

                                MENU_CONFIG.map((menuItem) => {
                                    if (menuItem.children && menuItem.children.length !== 0) {

                                        return menuItem.children.map(i => {
                                            return <Route
                                                path={i.key}
                                                key={i.key}
                                                component={i.component} />
                                        })

                                    } else {
                                        return <Route
                                            path={menuItem.key}
                                            key={menuItem.key}
                                            component={menuItem.component}
                                        />
                                    }
                                })
                            }
                        </div>
                        <Cron crons={this.state.crons} />
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default Home;