import React, { Component } from "react"
import { Modal, Form, message } from "antd"
import "./MyModal.less"

const FormItem = Form.Item;

class MyModal extends Component {

    onOkCallback = () => {
        this.props.callback();
    }

    getForm = () => {
        return this.props.form;
    }

    getModalVisible = () => {
        return this.props.visible;
    }

    handleOk = () => {
        const { validateFields } = this.getForm();
        validateFields((errors, values) => {
            if (!errors) {
                const mode = this.props.mode;
                const httpRequest = this.getSaveFuc(mode);

                httpRequest(values).then((ret) => {
                    if (ret && ret.code === 1) {
                        message.success("保存成功!, 请到最后一页查看");
                        this.handleHideModal();
                        this.onOkCallback();
                        this.handleClearMemory();
                    } else {
                        message.error("保存失败")
                    }
                })
            } else {
                console.log(errors);
            }
        })

    }

    handleClearMemory = () => {
        const form = this.getForm();
        const { setFieldsValue } = form;

        const config = this.getFielsConfig();
        config.map((item) => {
            setFieldsValue({
                [item.id]: null,
            });
        })
    }

    getSaveFuc = (mode) => {
        return this.props.saveFunc(mode);
    }

    handleCancel = () => {
        this.handleHideModal();
        this.handleClearMemory();
    }

    handleHideModal = () => {
        this.props.handleHide();
    }

    getModalTitle = () => {
        if (this.props.mode === 1) {
            return <div className="modal-my-modal-title">编辑作者信息</div>
        } else if (this.props.mode === 2) {
            return <div className="modal-my-modal-title">添加作者信息</div>
        }
    }

    getModalProps = () => {
        return {
            title: this.getModalTitle(),
            visible: this.getModalVisible(),
            onOk: this.handleOk,
            onCancel: this.handleCancel,
            className: "my-modal",
        }
    }

    getFielsConfig = () => {
        return this.props.fieldsConfig;
    }


    render() {
        const fieldsConfig = this.getFielsConfig();
        const form = this.getForm();
        const { getFieldDecorator } = form;

        return <>
            <Modal {...this.getModalProps()}>
                <Form>
                    {
                        fieldsConfig && fieldsConfig.map((item) => (
                            <FormItem
                                key={item.id}
                                label={item.label}
                                labelCol={item.labelCol}
                                wrapperCol={item.wrapperCol}
                                style={{ display: (item.hide ? "none" : "") }}
                            >
                                {
                                    getFieldDecorator(item.id, {
                                        rules: item.rules,
                                        initialValue: null,
                                    })(
                                        item.formControl
                                    )
                                }
                            </FormItem>
                        ))
                    }
                </Form>
            </Modal>
        </>
    }
}

export default MyModal;