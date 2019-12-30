import React, { Component } from "react";
import { Form, Input, Button } from "antd"
import { nameLabel, nameField, nameRequiredMessage, namePlaceholder, passwordField, passwordLabel, passwordRequiredMessage, passwordPlaceholder } from "../Signup/const";

const FormItem = Form.Item;

class Signin extends Component {

    handleSubmit = () => {

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
            <div>
                <Form onSubmit={this.handleSubmit} labelCol={labelCol} wrapperCol={wrapperCol}>
                    <FormItem label={nameLabel}>
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
                    <Button htmlType="submit">登录</Button>
                </Form>
            </div>
        )
    }
}

const wrappedSignin = Form.create()(Signin);

export default wrappedSignin;