import React, { Component } from "react";
import { Form, Input, Button, Select, Radio, Cascader } from "antd"
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
    typeLabel,
    typeField,
    typeArray,
    gradeLabel,
    gradeField,
    gradeOptions,
    gradeRequireMessage
} from "./const";

import * as SignupService from "../../services/SignupService";
import { setToken } from "../../utils/token";
import { HOME_PATH } from "../../constants/const";

const Option = Select.Option;

const FormItem = Form.Item;

class Signup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            type: typeArray[0].value
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { validateFields } = this.props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                const name = values[nameField];
                const password = values[passwordField];
                const type = this.state.type;
                let grade = undefined;
                if (type === typeArray[0].value) {
                    grade = values[gradeField][1];
                }
                const { token } = await SignupService.signup(name, password, grade, type);
                if (token) {
                    setToken(token);
                    this.props.history.push(HOME_PATH);
                }
            }
        });
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({
            type: value
        })
    }


    render() {

        const { getFieldDecorator } = this.props.form;
        const labelCol = {
            span: 3
        }
        const wrapperCol = {
            span: 8
        }

        const isStudent = this.state.type === typeArray[0].value ? true : false;

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

                {isStudent && <FormItem label={gradeLabel}>
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
                </FormItem>}

                <Radio.Group value={this.state.type} onChange={this.handleChange}>
                    {typeArray.map((item) =>
                        <Radio key={item.value} value={item.value}>
                            {item.name}
                        </Radio>)}
                </Radio.Group>


                <Button htmlType="submit">{submitName}</Button>
            </Form>)
    }
}

const WrappedSignup = Form.create()(Signup);

export default WrappedSignup;