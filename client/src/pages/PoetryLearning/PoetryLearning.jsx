import React, { Component } from "react";
import { Card, Button } from "antd";
import "./PoetryLearning.less"
import LearnPoetry from "../../Components/LearnPoetry/LearnPoetry";

class PoetryLearning extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }


    getCardTitle = () => {
        return <div className="card-title">诗词学习</div>
    }


    getCardProps = () => {
        return {
            title: this.getCardTitle(),
            className: "card_personal_setting"
        }
    }

    render() {

        return (
            <div>
                <Card {...this.getCardProps()}>
                    <LearnPoetry/>
                </Card>
            </div>
        )
    }
}

export default PoetryLearning;