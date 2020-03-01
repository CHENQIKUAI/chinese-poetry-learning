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
import { setToken, setType, setUsername } from "../../utils/localStorageManagement";
import { HOME_PATH } from "../../constants/const";


const FormItem = Form.Item;

class Signup extends Component {

    constructor(props) {
        super(props);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { validateFields } = this.props.form;
        validateFields((errors, values) => {
            if (!errors) {
                const name = values[nameField];
                const password = values[passwordField];
                const grade = values[gradeField][1];

                SignupService.signup(name, password, grade).then((res_data) => {
                    const { token, type, username } = res_data;
                    if (token) {
                        setToken(token);
                        setType(type);
                        setUsername(username);
                        this.props.history.push(HOME_PATH);
                        message.info(SIGNUP_SUCCESS_MESSAGE);
                    }

                    if (res_data.code === -1) {
                        message.error(res_data.message)
                    }
                }).catch((err) => {
                    message.error("出错啦", JSON.stringify(err));
                })

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

        const layout = {
            labelCol,
            wrapperCol,
        }

        return (
            <>
                <div className="signup-container">
                    <h1 className="signup-title">账号注册</h1>
                    <Form onSubmit={this.handleSubmit} {...layout}>
                        <FormItem label={nameLabel} hasFeedback>
                            {getFieldDecorator(nameField,
                                {
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
                                                                    if (!value || value === "" || value.length < 6) {
                                                                        callback("用户名必须不少于六位")
                                                                    } else {
                                                                        callback();
                                                                    }
                                                                }
                                                            })
                                                        }, 100);
                                                    }
                                                }
                                            ]
                                        },
                                    ],
                                    rules: [
                                        { required: true, message: nameRequiredMessage },
                                        { min: 6, message: "用户名必须不少于6位" },
                                        { pattern: /^[a-zA-Z0-9_]{6,}$/, message: "请输入由英文字母、数字或下划线组成的字符" },
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                return Promise.reject('asdlkj');
                                            },
                                        }),
                                    ]
                                })(
                                    <Input placeholder={namePlaceholder} autoComplete="off" />
                                )}
                        </FormItem>
                        <FormItem label={passwordLabel} hasFeedback>
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
                                <Input.Password placeholder={passwordPlaceholder} autoComplete="off" />
                            )}
                        </FormItem>

                        <FormItem label={passwordConfirmLable} hasFeedback>
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
                                <Input.Password placeholder={passwordConfirmPlaceholder} autoComplete="off" />
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