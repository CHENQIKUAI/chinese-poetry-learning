import React, { Component } from "react"
import { Form, Input, Button, message } from "antd"
import PersonalSettingService from "../../../services/PersonalSettingService";
import { MAIN_MODE } from "../cons";

class UpdatePwd extends Component {

    handleChangeMode = (mode) => {
        this.props.changeMode(mode)
    }

    handleSubmit = () => {
        const { validateFields } = this.props.form;
        validateFields().then(values => {
            PersonalSettingService.updatePwd(values.newPwd).then(ret => {
                if (ret && ret.code === 1) {
                    message.success("密码修改成功")
                    this.handleChangeMode(MAIN_MODE)
                }
            }).catch(err => {
                message.error("密码修改失败")
                console.error(err);
            })
        }).catch(error => {
            console.error({ error });
        })
    }


    handleClickConfirm = () => {
        this.handleSubmit();

    }


    handleCheckCurPwd = (rule, value, callback) => {
        if (typeof value === "string") {
            if (value.trim() === "") {

            }
            PersonalSettingService.checkCurPwd(value).then(ret => {
                if (ret && ret.code === 1) {
                    callback();
                } else {
                    callback("当前密码错误!");
                }
            }).catch(error => {
                callback("")
            })
        } else {
            callback("本字段错误")
        }
    }

    handleCheckConfirmPwd = (rule, value, callback) => {
        if (typeof value === "string") {
            const newPwd = this.props.form.getFieldValue("newPwd");
            if (newPwd === value) {
                callback();
            } else {
                callback("两次密码不一致")
            }
        } else {
            callback("本字段错误")
        }
    }

    validateToNextPassword = (rules, value, callback) => {
        const { getFieldValue, validateFields } = this.props.form;
        const nextPwd = getFieldValue('confirmPwd')
        if (nextPwd) {
            validateFields(['confirmPwd'], { force: true })
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const labelColSpan = 2;
        const formLayout = { labelCol: { span: labelColSpan }, wrapperCol: { span: 7 } };
        const buttonLayout = { wrapperCol: { span: 4, offset: labelColSpan } };

        return (
            <div>
                <Form {...formLayout}>
                    <Form.Item label="当前密码">
                        {getFieldDecorator('curPwd', {
                            validate: [{ trigger: 'onBlur', rules: [{ validator: this.handleCheckCurPwd }] }]
                        })(
                            <Input.Password placeholder="请输入当前密码" autoComplete="off" />
                        )}
                    </Form.Item>
                    <Form.Item label="新密码">
                        {getFieldDecorator('newPwd', {
                            rules: [
                                { required: true, message: "请输入密码" },
                                { min: 6, message: "请输入至少六位密码" },
                                { validator: this.validateToNextPassword }
                            ]
                        })(
                            <Input.Password placeholder="请输入当前密码" autoComplete="off" />
                        )}
                    </Form.Item>
                    <Form.Item label="确认密码">
                        {getFieldDecorator('confirmPwd', {
                            rules: [{ message: "请输入密码", required: true }, { min: 6, message: "请输入至少六位密码" }],
                            validate: [{ trigger: "onBlur", rules: [{ validator: this.handleCheckConfirmPwd }] }],
                        })(
                            <Input.Password placeholder="请输入当前密码" autoComplete="off" />
                        )}
                    </Form.Item>
                    <Form.Item {...buttonLayout}>
                        <Button type="primary" onClick={this.handleClickConfirm}>确认修改</Button>
                    </Form.Item>
                </Form>

            </div>
        )
    }
}

export default Form.create({ name: "UpdatePwd" })(UpdatePwd);