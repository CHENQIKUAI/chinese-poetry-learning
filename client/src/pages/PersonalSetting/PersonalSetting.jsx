import React, { Component } from "react";
import { Card, message, Form, Input, Button, Cascader, InputNumber } from "antd";
import PersonalSettingService from "../../services/PersonalSettingService";
import { checkUsername } from "../../services/SignupService";
import { gradeOptions } from "../Signup/const";
import { USERNAME_TITLE, USERNAME, GRADE_TITLE, GRADE, PASSWORD_TITLE, MAIN_MODE, PWD_MODE } from "./cons";
import UpdatePwd from "./component/UpdatePwd";
import "./PersonalSetting.less"

class PersonalSetting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            grade: 0,
            mode: MAIN_MODE,
        }
    }

    fetchUsername = () => {
        PersonalSettingService.fetchUsername().then(ret => {
            if (ret && ret.code) {
                this.setState({
                    username: ret.username
                })
            } else {
                console.error(ret);
            }
        }).catch(err => {
            console.error(err);
        })
    }

    fetchGrade = () => {
        PersonalSettingService.fetchGrade().then((ret) => {
            if (ret && ret.code === 1) {
                this.setState({
                    grade: ret.grade,
                })
            } else {
                console.error(ret);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
        this.fetchGrade();
        this.fetchUsername();
    }

    getGradeArr = (grade) => {
        if (grade === -1) {
            return ['D'];
        } else if (grade <= 6) {
            return ['A', grade];
        } else if (grade <= 9) {
            return ['B', grade];
        } else if (grade <= 12) {
            return ['C', grade];
        }
    }

    getCascaderOptions = () => {
        const { grade } = this.state
        return this.getGradeArr(grade);
    }

    getCardTitle = () => {
        return <div className="card-title">个人设置</div>
    }

    getCardExtra = () => {
        if (this.state.mode !== MAIN_MODE)
            return <Button icon="left" style={{ position: "absolute", left: 0, top: 0, margin: "16px" }} onClick={this.handleChangeMode.bind(this, MAIN_MODE)}>返回</Button>
    }

    getCardProps = () => {
        return {
            title: this.getCardTitle(),
            extra: this.getCardExtra(),
            className: "card_personal_setting"
        }
    }

    handleSaveSettings = ({ username, grade }) => {
        Promise.all(
            [PersonalSettingService.updateUsername(username),
            PersonalSettingService.updateGrade(grade)]
        ).then(rets => {
            let count = 0;
            for (let i = 0; i < rets.length; ++i) {
                if (rets[i] && rets[i].code === 1) {
                    count++;
                }
            }
            if (count === rets.length) {
                message.success("个人设置保存成功")
                console.log(username.trim());

                this.setState({
                    username: username.trim(),
                    grade
                })
            }
        })
    }


    handleClickSave = () => {
        const { validateFields } = this.props.form;
        validateFields([USERNAME, GRADE], (errors, values) => {
            if (!errors) {
                const username = values[USERNAME].trim();
                const grade = values[GRADE].length === 2 ? values[GRADE][1] : -1;
                this.handleSaveSettings({ username, grade })
            }
        })
    }

    handleChangeMode = (mode) => {
        this.setState({
            mode
        })
    }

    handleClickModifyPwd = () => {
        this.handleChangeMode(PWD_MODE);
    }

    handleCheckUsername = (rule, value, callback) => {
        if (typeof value === "string") {
            if (value.trim() === this.state.username) {
                callback();
            } else if (value.trim() === "") {
                callback("请输入用户名");
            } else {

                const username = value.trim();

                if (username.length < 6) {
                    callback("请输入至少六个字符")
                }

                checkUsername(username).then((ret) => {
                    if (ret && ret.code === 1) {
                        callback("用户名已被使用")
                    } else {
                        callback();
                    }
                }).catch((error) => {
                    callback("发生未知错误!");
                    console.error(error)
                })
            }
        } else {
            callback("用户名字段错误")
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { mode } = this.state;
        const labelColSpan = 2;
        const formLayout = { labelCol: { span: labelColSpan }, wrapperCol: { span: 5 } }
        const buttonLayout = { wrapperCol: { offset: labelColSpan } }
        return (
            <div>
                <Card {...this.getCardProps()}>
                    {
                        mode === MAIN_MODE ?
                            <Form {...formLayout}>
                                <Form.Item label={USERNAME_TITLE} hasFeedback>
                                    {getFieldDecorator(USERNAME, {
                                        initialValue: this.state.username,
                                        rules: [
                                            { min: 6, message: "密码至少为六位" },
                                            { pattern: /^[a-zA-Z0-9_]+$/, message: "请输入由英文字母、数字或下划线组成的字符" }
                                        ],
                                        validate: [{ trigger: "onBlur", rules: [{ validator: this.handleCheckUsername }] }],
                                    })(<Input placeholder="请输入用户名" autoComplete="off" />)}
                                </Form.Item>
                                <Form.Item label={PASSWORD_TITLE}>
                                    <Button onClick={this.handleClickModifyPwd}>修改密码</Button>
                                </Form.Item>
                                <Form.Item label={GRADE_TITLE}>
                                    {getFieldDecorator(GRADE, {
                                        initialValue: this.getCascaderOptions(),
                                        rules: [{ required: true, message: '请选择年级' }]
                                    })(<Cascader options={gradeOptions}></Cascader>)}
                                </Form.Item>
                                <Form.Item {...buttonLayout}>
                                    <Button type="primary" className="btn-save" onClick={this.handleClickSave}>保存</Button>
                                </Form.Item>
                            </Form> :
                            <UpdatePwd changeMode={this.handleChangeMode} />
                    }
                </Card>
            </div>
        )
    }
}

export default Form.create({ name: "personalSetting" })(PersonalSetting);