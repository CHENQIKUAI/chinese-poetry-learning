import React, { Component } from "react";
import { Layout, message } from 'antd';
import { getToken } from "../../utils/token";
import { profile } from "../../services/HomeService";
import { Button } from "antd";
import { SIGNOUT_PATH } from "../../constants/const";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import MyMenu from "../Menu/MyMenu"
import "./Home.less"

const { Header, Content, Footer, Sider } = Layout;

class Home extends Component {

    UNSAFE_componentWillMount() {
        this.checkToken();
    }


    async componentDidMount() {
        const ret = await profile();

        if (ret.code === -1) {
            this.props.history.push("/signin");
            message.error("请先登录")
        }
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
            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <div className="sider-logo" >
                        中小学生古诗词学习系统
                    </div>
                    <MyMenu history={this.props.history} />
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Button onClick={this.handleSignout}>退出</Button>
                    </Header>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, background: '#fff', height: "100%" }}>
                            <Router>
                                <Switch>
                                    <Route path="/hello" render={() => <h1>65465465</h1>} />
                                    <Route path="/world" render={() => <h1>world</h1>} />
                                    <Route path="/peter" render={() => <h1>对啊，我是彼得</h1>} />
                                </Switch>
                            </Router>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>古诗词学习系统 ©2020 Created by Peter</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default Home;