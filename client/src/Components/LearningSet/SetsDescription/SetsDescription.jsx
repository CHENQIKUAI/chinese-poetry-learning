import React from 'react'
import { Row, Col, Button, Tooltip } from "antd"
import "./style.less"
import DataBox from '../DataBox/DataBox'


export default function SetsDescription({ clickAdd, checkInNumber, consecutiveDays, cumulativeDays }) {

    return (
        <div className="sets-description">
            <Row type="flex" align="middle">
                <Col span={7}>
                    <DataBox
                        number={checkInNumber}
                        unit={'天'}
                        belong={'打卡'}
                    />
                </Col>
                <Col span={7}>
                    <DataBox
                        number={consecutiveDays}
                        unit={'天'}
                        belong={'连续打卡'}
                    />
                </Col>
                <Col span={7}>
                    <DataBox
                        number={cumulativeDays}
                        unit={'天'}
                        belong={'总打卡'}
                    />
                </Col>
                <Col span={3}>
                    <Tooltip title="新建学习集">
                        <Button icon="plus" shape="circle" onClick={clickAdd}></Button>
                    </Tooltip>
                </Col>
            </Row>
        </div>
    )
}