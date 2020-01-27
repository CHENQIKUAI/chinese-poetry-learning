import React, { Component } from "react";
import { Form, Input, Button, Cascader, message } from "antd"
import {
    nameLabel,
    passwordLabel,
    nameField,
    nameRequiredMessage,
    namePlaceholder,
    passwordField,
    passwordRequiredMessage,
    passwordPlaceholder,
    submitName,
    gradeLabel,
    gradeField,
    gradeOptions,
    gradeRequireMessage,
    passwordConfirmRequiredMessage,
    passwordConfirmField,
    passwordConfirmLable,
    passwordConfirmPlaceholder,
    SIGNUP_SUCCESS_MESSAGE,
} from "./const";

import "./Signup.less";

import * as SignupService from "../../services/SignupService";
import { setToken } from "../../utils/token";
import { HOME_PATH } from "../../constants/const";


const FormItem = Form.Item;

class Signup extends Component {

    constructor(props) {
        super(props);

    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { validateFields } = this.props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                const name = values[nameField];
                const password = values[passwordField];
                const grade = values[gradeField][1];

                const res_data = await SignupService.signup(name, password, grade);
                const { token } = res_data;
                if (token) {
                    setToken(token);
                    this.props.history.push(HOME_PATH);
                    message.info(SIGNUP_SUCCESS_MESSAGE);
                }

                if (res_data.code === -1) {
                    message.error(res_data.message)
                }
            }
        });
    }


    handleGoToSignin = () => {
        this.props.history.push("/signin")
    }


    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const labelCol = {
            span: 5
        }
        const wrapperCol = {
            span: 19
        }

        return (
            <>
                <div className="signup-container">
                    <h1 className="header">账号注册</h1>
                    <Form onSubmit={this.handleSubmit} labelCol={labelCol} wrapperCol={wrapperCol}>
                        <FormItem label={nameLabel} wrapp>
                            {getFieldDecorator(nameField, {
                                validate: [
                                    {
                                        trigger: "onBlur",
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => {
                                                    setTimeout(() => {
                                                        SignupService.checkUsername(value).then((result) => {
                                                            if (result.result === true) {
                                                                callback("该用户名已被注册")
                                                            } else {
                                                                callback();
                                                            }
                                                        })
                                                    }, 100);
                                                }
                                            }
                                        ]
                                    }
                                ],
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
                                    },
                                    {
                                        min: 6,
                                        message: "密码长度至少为6"
                                    }
                                ]
                            })(
                                <Input placeholder={passwordPlaceholder} type="password" autoComplete="off" />
                            )}
                        </FormItem>

                        <FormItem label={passwordConfirmLable}>
                            {getFieldDecorator(passwordConfirmField, {
                                rules: [
                                    {
                                        required: true,
                                        message: passwordConfirmRequiredMessage
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            const password_first = getFieldValue(passwordField);
                                            const password_second = value;
                                            if (password_first !== password_second) {
                                                callback("两次密码输入不一致")
                                            } else {
                                                callback();
                                            }
                                        }
                                    }
                                ]
                            })(
                                <Input placeholder={passwordConfirmPlaceholder} type="password" autoComplete="off" />
                            )}
                        </FormItem>


                        <FormItem label={gradeLabel}>
                            {
                                getFieldDecorator(gradeField, {
                                    rules: [
                                        {
                                            required: true,
                                            message: gradeRequireMessage,
                                        }
                                    ]
                                })(
                                    <Cascader options={gradeOptions}></Cascader>
                                )
                            }
                        </FormItem>
                        <div className="text-align-div">
                            <h1 className="signup-tips">已有帐号？<span className="btn-go-to-signin" onClick={this.handleGoToSignin}>直接登录»</span></h1>
                            <Button htmlType="submit">{submitName}</Button>
                        </div>
                    </Form>
                </div>
            </>)
    }
}

const WrappedSignup = Form.create()(Signup);

export default WrappedSignup;