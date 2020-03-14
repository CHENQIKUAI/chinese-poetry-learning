import React, { useEffect, useState } from 'react'
import { Input, Modal } from 'antd'
import { createSet, updateSetName } from "../../../services/LearningSetService"

export default class SetModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps._id !== this.props._id) {
            this.setState({
                value: this.props.title,
            })
        }
    }

    handleOk = () => {
        const { value } = this.state;
        if (this.props.mode === "create") {
            createSet(value).then(ret => {
                if (ret && ret.code === 1) {
                    this.props.hideModal();
                    this.props.refreshFunction();
                    this.resetValue(value);
                }
            })
        } else {
            updateSetName(this.props._id, value).then(ret => {
                if (ret && ret.code === 1) {
                    this.props.hideModal();
                    this.props.refreshFunction();
                    this.resetValue(value);
                }
            })
        }
    }

    resetValue = (value) => {
        if (value) {
            this.setState({
                value
            })
        } else {
            this.setState({
                value: this.props.title
            })
        }
    }

    handleCancel = () => {
        this.props.hideModal();
        this.resetValue();
    }

    handleValueChange = (e) => {
        this.setState({
            value: e.target.value,
        })
    }

    getTitle = () => {
        if (this.props.mode === "create") {
            return <div>新建学习集</div>
        } else {
            return <div>修改学习集</div>
        }
    }

    render() {
        return (
            <div>
                <Modal
                    visible={this.props.setModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    title={this.getTitle()}
                >
                    <label htmlFor="title">
                        学习集名称：
                    </label>
                    <Input style={{ width: "300px" }} value={this.state.value} onChange={this.handleValueChange} />
                </Modal>
            </div>
        )
    }
}

