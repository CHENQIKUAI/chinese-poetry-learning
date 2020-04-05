import React from 'react'
import { Input, Modal, Checkbox } from 'antd'
import { weekOptions } from "./const"
import { createSet, updateSet } from "../../../services/LearningSetService"
import "./style.less";

const MODE_CREATE = "create";
const MODE_EDIT = "edit";


export default class SetModal extends React.Component {

    getSetId = () => {
        return this.props._id;
    }

    getMode = () => {
        const id = this.getSetId();
        if (id === null) {
            return MODE_CREATE;
        } else {
            return MODE_EDIT;
        }
    }

    getInputValue = () => {
        return this.props.title;
    }

    getCheckboxValue = () => {
        return this.getWeekValuesByCron(this.props.cron);
    }

    handleChange = ({ title, cron }) => {
        this.props.handleChangeSetMsg({ title, cron });
    }

    handleHideModal = () => {
        this.props.hideModal();
    }

    handleRefresh = () => {
        this.props.refreshFunction();
    }

    getTitle = () => {
        const mode = this.getMode();
        if (mode === MODE_EDIT) {
            return <div>新建学习集</div>
        } else {
            return <div>修改学习集</div>
        }
    }


    getCronByWeek = (weekValues) => {
        if (weekValues.length !== 0)
            return `0 0 * * * ${weekValues}`;
        else {
            return null;
        }
    }

    getWeekValuesByCron = (cron) => {
        if (cron === null || cron === undefined) {
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

    handleOk = () => {
        const title = this.getInputValue()
        const cron = this.getCronByWeek(this.getCheckboxValue());
        const mode = this.getMode();
        if (mode === MODE_CREATE) {
            createSet(title, cron).then(ret => {
                if (ret && ret.code === 1) {
                    this.handleHideModal();
                    this.handleRefresh();
                }
            })
        } else if (mode === MODE_EDIT) {
            const id = this.getSetId();
            updateSet(id, title, cron).then(ret => {
                if (ret && ret.code === 1) {
                    this.handleHideModal();
                    this.handleRefresh();
                }
            })
        }
    }

    handleCancel = () => {
        this.handleHideModal();
    }

    handleChangeInput = (e) => {
        const value = e.target.value;
        this.handleChange({ title: value })
    }

    handleChangeCheckBox = (value) => {
        const cron = this.getCronByWeek(value);
        this.handleChange({ cron });
    }

    render() {
        return (
            <div>
                <Modal
                    visible={this.props.setModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    title={this.getTitle()}>

                    <div className="title-container">
                        <div className="title-label">
                            学习集名称：
                        </div>
                        <Input
                            ref={this.setInputRef}
                            className="title-value"
                            value={this.getInputValue()}
                            onChange={this.handleChangeInput}
                        />
                    </div>
                    <div className="week-container">
                        <div className="week-label">
                            提醒日期：
                        </div>
                        <Checkbox.Group
                            className="week-value"
                            options={weekOptions}
                            value={this.getCheckboxValue()}
                            onChange={this.handleChangeCheckBox}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}

