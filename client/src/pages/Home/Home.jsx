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
import logoStudent from "../../img/logo-student.png"
import logoAdmin from "../../img/logo-admin.png"

const { Header, Content, Sider } = Layout;

class Home extends Component {
    state = {
        crons: []
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

    notifyToLogin = () => {
        message.info("请先登录")
    }

    componentDidMount() {
        const token = getToken();
        if (!token) {
            this.notifyToLogin();
            this.goToSignin();
        } else {
            this.fetchProfile();
            this.fetchCrons();
        }
    }

    goToSignin = () => {
        this.props.history.push("/signin");
    }

    render() {
        const TYPE = getType();
        const MENU_CONFIG = TYPE === ADMIN_TYPE ? MENU_ADMIN : MENU_USER;
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Sider style={{ position: "fixed", minHeight: "100vh" }}>
                    {TYPE === USER_TYPE ?
                        (<div className="sider-logo" >
                            <img src={logoStudent} />
                        </div>) :
                        (<div className="sider-logo" >
                            <img src={logoAdmin} />
                        </div>)
                    }
                    <MyMenu history={this.props.history} menuConfig={MENU_CONFIG} />
                </Sider>
                <Layout id="my-layout" style={{ marginLeft: "200px" }}>
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