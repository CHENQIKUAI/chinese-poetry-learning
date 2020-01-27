import React, { Component } from "react";
import { Layout, Menu, Icon } from 'antd';
import { getToken } from "../../utils/token";
import { profile } from "../../services/HomeService";
import { Button } from "antd";
import { SIGNOUT_PATH } from "../../constants/const";
import "./Home.less"

const { Header, Content, Footer, Sider } = Layout;

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

        if (ret.code === -1) {
            this.props.history.push("/signin");
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
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                        <Menu.Item key="1">
                            <Icon type="user" />
                            <span className="nav-text">nav 1</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="video-camera" />
                            <span className="nav-text">nav 2</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="upload" />
                            <span className="nav-text">nav 3</span>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Icon type="user" />
                            <span className="nav-text">nav 4</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Button onClick={this.handleSignout}>退出</Button>

                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>content</div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default Home;