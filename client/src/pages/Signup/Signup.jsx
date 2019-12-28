import React, { Component } from "react";
import { Form, Input, Button } from "antd"
import {
    nameLabel,
    passwordLabel,
    nameField,
    nameRequiredMessage,
    namePlaceholder,
    passwordField,
    passwordRequiredMessage,
    passwordPlaceholder,
    submitName
} from "./const";

import * as SignupService from "../../services/SignupService";
import { setToken } from "../../utils/token";
import { HOME_PATH } from "../../constants/const";

const FormItem = Form.Item;

class Signup extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        const { validateFields } = this.props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                const name = values[nameField];
                const password = values[passwordField];
                const { token } = await SignupService.signup(name, password);
                if (token) {
                    setToken(token);
                    this.props.history.push(HOME_PATH);
                }
            }
        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const labelCol = {
            span: 3
        }
        const wrapperCol = {
            span: 8
        }

        return (
            <Form onSubmit={this.handleSubmit} labelCol={labelCol} wrapperCol={wrapperCol}>
                <FormItem label={nameLabel} wrapp>
                    {getFieldDecorator(nameField, {
                        rules: [
                            {
                                required: true,
                                message: nameRequiredMessage
                            }
                        ]
                    })(
                        <Input placeholder={namePlaceholder} />
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
                        <Input placeholder={passwordPlaceholder} />
                    )}
                </FormItem>
                <Button htmlType="submit">{submitName}</Button>
            </Form>)
    }
}

const WrappedSignup = Form.create()(Signup);

export default WrappedSignup;