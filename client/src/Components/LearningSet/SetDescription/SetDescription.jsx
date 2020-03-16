import React, { useState } from 'react'
import { Row, Col, message, Popconfirm, Progress, Tooltip, Button } from "antd"
import "./style.less"
import { deleteSet, addNewPoetry } from '../../../services/LearningSetService'
import SeachPoetryModal from '../../../pages/PoetryMustLearn/SearchPoetryModal/SearchPoetryModal'
import DataBox from '../DataBox/DataBox'

/**
 * type为list的时候，是修改查看删除
 * 为 description的时候，是添加
 */
export default function SetDescription(
    {
        refreshFunction,
        setSelectedSet,
        handleGoToSet,
        _id,
        title,
        cron,
        learnedCount,
        cumulativeDays,
        learningProgress,
        type
    }) {

    const [searchModalVisible, setSearchModalVisible] = useState(false)


    function handleClickSet() {
        handleGoToSet && handleGoToSet(_id)
    }

    function handleClickModify() {
        setSelectedSet && setSelectedSet(_id, title, cron)
    }

    function handleClickDelete() {
        deleteSet(_id).then(ret => {
            if (ret && ret.code === 1) {
                message.success("删除成功")
                refreshFunction();
            }
        })
    }

    function handleClickAdd() {
        setSearchModalVisible(true);
    }

    function getSeachPoetryModalProps() {
        function hideModal() {
            setSearchModalVisible(false);
        }

        function addPoetryToCollection(poetry_id) {

            return addNewPoetry(_id, poetry_id);
        }

        function refresh() {
            refreshFunction();
        }

        return {
            visible: searchModalVisible,
            hideModal,
            ajaxFunction: addPoetryToCollection,
            refreshFunction: refresh,
        }
    }

    function getTitle() {
        const len = 20;
        if (title && title.length > len) {
            return title.substr(0, len) + "...";
        }
        return title;
    }
    return (
        <div className="set-description" >
            <Row type="flex" align="middle">
                <Col span={20}>
                    <div className="container">
                        <p className="title">{getTitle()}</p>
                    </div>
                    <div className="progress">
                        <Progress percent={parseFloat((learningProgress * 100).toFixed(2))} />
                    </div>
                    <Row>
                        <Col span={8}>
                            <DataBox
                                number={learnedCount}
                                unit="篇"
                                belong="已学习"
                            />
                        </Col>
                        <Col span={8}>
                            <DataBox
                                number={cumulativeDays}
                                unit="天"
                                belong="天数"
                            />
                        </Col>
                        <Col span={8}>
                            <DataBox
                                number={(learningProgress * 100).toFixed(2)}
                                unit="%"
                                belong="进度"
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={4} >
                    {
                        type === "list" && (
                            <div className="operation">
                                <div>
                                    <a onClick={handleClickModify}>修改</a>
                                </div>
                                <div>
                                    <a onClick={handleClickSet} >查看</a>
                                </div>
                                <div>
                                    <Popconfirm
                                        title="你确定要删除本学习集？"
                                        onConfirm={handleClickDelete}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a href="#" className="delete">删除</a>
                                    </Popconfirm>
                                </div>
                            </div>
                        )
                    }
                    {
                        type === "description" && (
                            <div>
                                <Tooltip title="添加诗词到本学习集">
                                    <Button icon="plus" shape="circle" onClick={handleClickAdd}></Button>
                                </Tooltip>
                                <SeachPoetryModal {...getSeachPoetryModalProps()} />
                            </div>
                        )
                    }
                </Col>
            </Row>
        </div>
    )
}

const DemoBox = props => <p style={{ height: `${props.value}px`, backgroundColor: "blue" }}>{props.children}</p>;