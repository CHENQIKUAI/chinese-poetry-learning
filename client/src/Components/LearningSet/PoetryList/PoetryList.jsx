import React from 'react'
import { Popconfirm, Row, Col, Button } from 'antd'
import "./style.less"
import { Link } from "react-router-dom"
import { poetryCheckIn, deletePoetryFromCollection } from '../../../services/LearningSetService';
import { POETRY_LEARNING } from '../../Menu/menuConstants';
import getPoetryLearningUrl from '../../../utils/urlUtil';
import urlUtil from '../../../utils/urlUtil';

function Poetry({ refreshFunction, created_poetry_list_id, _id, title, content, check_in }) {
    //取得第一句诗词，
    // const pattern = /(.*?[\n].*?[\n？！。])/;
    const pattern = /(.*?[。？！])/;
    const showContent = content.match(pattern)[1];


    function checkInPoetry() {
        poetryCheckIn(created_poetry_list_id, _id).then(ret => {
            if (ret && ret.code === 1) {
                refreshFunction();
            }
        })
    }


    function handleDelete() {
        deletePoetryFromCollection(created_poetry_list_id, _id).then(ret => {
            if (ret && ret.code === 1) {
                refreshFunction();
            }
        })
    }

    const leftSpan = 16;
    const rightSpan = 24 - leftSpan;

    return (
        <div className="poetry-list-container">
            <Row type="flex" align="middle">
                <Col span={leftSpan}>
                    <div className="title">
                        {title}
                    </div>
                    <div className="content">
                        {showContent}
                    </div>
                </Col>
                <Col span={rightSpan}>
                    <div>
                        <Link to={urlUtil.getPoetryLearningPoetryUrl(_id)}>去学习</Link>
                        <Button className="btn-check-in" disabled={check_in} onClick={checkInPoetry}>{check_in ? "已打卡" : "打卡"}</Button>
                        <Popconfirm
                            title="您确认要从诗词集中删除本诗词?"
                            okText="是"
                            cancelText="否"
                            onConfirm={handleDelete}
                        >
                            <a href="#" className="delete">删除</a>
                        </Popconfirm>
                    </div>
                </Col>
            </Row>
        </div>
    )

}


export default function PoetryList({ refreshFunction, data, created_poetry_list_id }) {
    return (
        data.map(item => {
            return <Poetry key={item._id} {...item} refreshFunction={refreshFunction} created_poetry_list_id={created_poetry_list_id} />
        })
    )

}