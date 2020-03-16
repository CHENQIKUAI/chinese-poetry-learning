import React, { useEffect, useState } from 'react'
import { Input, Modal, Checkbox } from 'antd'
import { weekOptions } from "./const"
import { createSet, updateSet } from "../../../services/LearningSetService"
import "./style.less";

export default class SetModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            weekValues: [],
        }
    }

    initState = () => {
        const state = {
            value: this.props.title,
            weekValues: this.getWeekValuesByCron(this.props.cron),
        }
        this.setState({
            ...state
        })
    }

    getCronByWeek = (weekValues) => {
        if (weekValues.length !== 0)
            return `0 0 * * * ${weekValues}`;
        else {
            return `0 0 * * * *`;
        }
    }

    getWeekValuesByCron = (cron) => {
        if (!cron) {
            return [];
        } else {
            const week = cron.split(' ')[5];
            if (week === '*') {
                return [0, 1, 2, 3, 4, 5, 6];
            } else {
                return week.split(',').map(str => Number(str));
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps._id !== this.props._id) {
            this.initState();
        }
    }


    handleOk = () => {
        const { value, weekValues } = this.state;
        const cron = this.getCronByWeek(weekValues);
        if (this.props.mode === "create") {
            createSet(value, cron).then(ret => {
                if (ret && ret.code === 1) {
                    this.props.hideModal();
                    this.props.refreshFunction();
                    this.resetValue(value, cron);
                }
            })
        } else {
            updateSet(this.props._id, value, cron).then(ret => {
                if (ret && ret.code === 1) {
                    this.props.hideModal();
                    this.props.refreshFunction();
                    this.resetValue(value, cron);
                }
            })
        }
    }

    resetValue = (value, cron) => {
        if (value || cron) {
            this.setState({
                value,
                cron
            })
        } else {
            this.initState();
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

    handleWeekChange = (values) => {
        this.setState({
            weekValues: values
        })
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
                    <div className="title-container">
                        <div className="title-label">
                            学习集名称：
                        </div>
                        <Input className="title-value" value={this.state.value} onChange={this.handleValueChange} />
                    </div>
                    <div className="week-container">
                        <div className="week-label">
                            提醒日期：
                        </div>
                        <Checkbox.Group className="week-value" options={weekOptions} value={this.state.weekValues} onChange={this.handleWeekChange} />
                    </div>
                </Modal>
            </div>
        )
    }
}

