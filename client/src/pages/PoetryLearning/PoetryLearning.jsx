import React, { Component } from "react";
import { Card, Button } from "antd";
import "./PoetryLearning.less"
import LearnPoetry from "../../Components/LearnPoetry/LearnPoetry";
import { withRouter } from "react-router-dom"

class PoetryLearning extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }


    getCardTitle = () => {
        const search = this.props.history.location.search
        if (search.match(/id/)) {
            return <div className="card-title">诗词学习</div>
        } else if (search.match(/writer/)) {
            return <div className="card-title">作者介绍</div>
        }
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
                    <LearnPoetry />
                </Card>
            </div>
        )
    }
}

export default withRouter(PoetryLearning);