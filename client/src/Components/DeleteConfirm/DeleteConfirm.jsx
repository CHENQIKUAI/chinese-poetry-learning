import React, { Component } from "react"
import { Modal, Button, Input, message } from "antd"
import "./DeleteConfirm.less"

class DeleteConfirm extends Component {

    state = {
        value: "",
        visible: false,
    }

    getModalTitle = () => {
        return <div style={{ fontWeight: "bold" }}>你确定吗</div>
    }

    getModalVisible = () => {
        return this.state.visible;
    }


    handleHide = () => {
        this.setState({
            visible: false,
            value: "",
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    handleOk = () => {
        this.handleHide();
    }

    handleCancel = () => {
        this.handleHide();
    }

    getModalProps = () => {
        return {
            title: this.getModalTitle(),
            visible: this.getModalVisible(),
            onOk: this.handleOk,
            onCancel: this.handleCancel,
            footer: null,
            className: "delete-confirm-modal"
        }
    }

    handleClick = () => {
        this.showModal();
    }


    getConfirmMsg = () => {
        return this.props.confirmMsg;
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        })
    }

    handleClickDelete = () => {
        this.props.deleteFunc().then((ret) => {
            if (ret && ret.code === 1) {
                setTimeout(() => {
                    this.setState({
                        visible: false
                    }, () => {
                        setTimeout(() => {
                            this.props.deleteCallback();
                        }, 100);
                    })
                    message.success("删除成功！")
                }, 500);
            }
        })
    }

    render() {
        return (
            <div>
                <div onClick={this.handleClick}>
                    {
                        this.props.children
                    }
                </div>

                < Modal {...this.getModalProps()} >
                    <div className="alert-info">如果您不阅读本文，将会发生意想不到的坏事！</div>
                    <div className="padding16">
                        <div className="info">
                            此操作无法撤消。这将永久删除
                        <strong>{this.getConfirmMsg()}</strong>
                            ，并所有和它关联的数据。
                        请输入<strong>{this.getConfirmMsg()}</strong>进行确认。
                        </div>
                        <Input className="input" value={this.state.value} onChange={this.handleChange} />
                        <button
                            className="btn"
                            disabled={this.state.value === this.getConfirmMsg() ? false : true}
                            onClick={this.handleClickDelete}
                        >
                            我明白这些，我已决意要删除！
                    </button>
                    </div>

                </Modal >
            </div >
        )

    }

}

export default DeleteConfirm;