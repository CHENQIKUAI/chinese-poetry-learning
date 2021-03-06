import React, { Component } from "react";
import { Form, Input, Button, Alert, message } from "antd"
import { nameLabel, nameField, nameRequiredMessage, namePlaceholder, passwordField, passwordLabel, passwordRequiredMessage, passwordPlaceholder } from "../Signup/const";
import "./Signin.less";
import { signin } from "../../services/SigninService";
import { setToken, setType, setUsername } from "../../utils/localStorageManagement";
import { SUCCESS, ERROR, LOGIN_ERR_MSG, LOGIN_SUCCESS_MESSAGE } from "./constants";

const FormItem = Form.Item;


class Signin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginStatus: SUCCESS,
            loading: false,
        }

    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        }, () => {
            setTimeout(() => {
                const { validateFields } = this.props.form;
                validateFields((errors, values) => {
                    if (!errors) {
                        const name = values[nameField];
                        const password = values[passwordField];

                        signin(name, password).then((data) => {
                            if (data.code === 1) {
                                const { token, type, username } = data;
                                setToken(token);
                                setType(type);
                                setUsername(username);

                                this.props.history.push("/");
                                message.success(LOGIN_SUCCESS_MESSAGE);
                            } else {
                                this.setState({
                                    loginStatus: ERROR
                                })
                                setTimeout(() => {
                                    this.setState({
                                        loginStatus: SUCCESS
                                    })
                                }, 1500);
                            }
                        }).catch((err) => {
                            console.error(err, "web")
                            message.error(err)
                        })
                    }
                });
            }, 500);
        })
    }


    handleGoToSignup = () => {
        this.props.history.push("/signup")
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const labelCol = {
            span: 4
        }
        const wrapperCol = {
            span: 20
        }

        return (
            <div>
                <div className="signin-container">
                    <h1 className="signin-title">学习系统登录</h1>
                    <Form onSubmit={this.handleSubmit} labelCol={labelCol} wrapperCol={wrapperCol} >
                        {this.state.loginStatus === ERROR ? <Alert className="alert-info" message={LOGIN_ERR_MSG} type="error" showIcon /> : null}
                        <FormItem label={nameLabel}>
                            {getFieldDecorator(nameField, {
                                rules: [
                                    {
                                        required: true,
                                        message: nameRequiredMessage
                                    }
                                ]
                            })(
                                <Input placeholder={namePlaceholder} autoComplete="off" />
                            )}
                        </FormItem>
                        <FormItem label={passwordLabel}>
                            {getFieldDecorator(passwordField, {
                                rules: [
                                    {
                                        required: true,
                                        message: passwordRequiredMessage
                                    }
                                ]
                            })(
                                <Input placeholder={passwordPlaceholder} type="password" autoComplete="off" />
                            )}

                        </FormItem>
                        <div className="text-align-div">
                            <h1 className="signin-tips">还没有账号？<span className="go-to-signup" onClick={this.handleGoToSignup}>立即注册!</span></h1>
                            <Button loading={this.state.loading} htmlType="submit" className="btn-signin">登录</Button>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}


const wrappedSignin = Form.create()(Signin);

export default wrappedSignin;