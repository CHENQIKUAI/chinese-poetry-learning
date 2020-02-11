import React, { Component } from "react"
import { Form, Card, Modal, Input } from "antd"
import TextArea from "antd/lib/input/TextArea";
import { CREATE_MODE } from "../PoetryList/const";

const FormItem = Form.Item;

class PoetryModal extends Component {

    clearContent = () => {
        this.props.form.setFieldsValue({
            title: "",
        })
    }

    handleOk = () => {
        this.props.handleOk();
        this.clearContent();
    }

    handleCancel = () => {
        this.props.handleCancel();
        this.clearContent();
    }

    getTitle = () => {
        if (this.props.mode === CREATE_MODE) {
            return "新增诗词";
        } else {
            return "编辑诗词";
        }
    }


    render() {
        const { getFieldDecorator, setFieldsValue } = this.props.form;
        const title = this.props.data ? this.props.data.title : "";

        return (
            <>
                <Modal
                    title={this.getTitle()}
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                        <FormItem label="标题" >
                            {getFieldDecorator("title", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入标题",
                                    }
                                ],
                                initialValue: title,
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="作者" >
                            {getFieldDecorator("writer", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入作者名字",
                                    }
                                ]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="朝代" >
                            {getFieldDecorator("dynasty", {
                                rules: [
                                    {
                                        required: false,
                                        message: "请输入朝代",
                                    }
                                ]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="类型" >
                            {getFieldDecorator("type", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入类型",
                                    }
                                ]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="内容" >
                            {getFieldDecorator("content", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入内容",
                                    }
                                ]
                            })(
                                <TextArea />
                            )}
                        </FormItem>
                        <FormItem label="注释" >
                            {getFieldDecorator("remark", {
                                rules: [
                                    {
                                        required: false,
                                        message: "请输入注释",
                                    }
                                ]
                            })(
                                <TextArea />
                            )}
                        </FormItem >
                        <FormItem label="翻译" >
                            {getFieldDecorator("translation", {
                                rules: [
                                    {
                                        required: false,
                                        message: "请输入翻译",
                                    }
                                ]
                            })(
                                <TextArea />
                            )}
                        </FormItem >
                        <FormItem label="赏析" >
                            {getFieldDecorator("appreciation", {
                                rules: [
                                    {
                                        required: false,
                                        message: "请输入标题",
                                    }
                                ]
                            })(
                                <TextArea />
                            )}
                        </FormItem >
                    </Form>
                </Modal>
            </>
        )

    }

}


export default Form.create()(PoetryModal);