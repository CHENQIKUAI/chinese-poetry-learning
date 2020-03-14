import React, { Component } from "react";
import { Card, Button, Affix } from "antd";
import "./PoetryLearning.less"
import LearnPoetry from "../../Components/LearnPoetry/LearnPoetry";
import { withRouter } from "react-router-dom"
import Recite from "./components/Recite/Recite";
import Dictate from "./components/Dictate/Dictate";

const MODE_RECITE = Symbol.for("recite")
const MODE_DICTATE = Symbol.for("dictate");

class PoetryLearning extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mode: null
        }
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

    handleClickRecite = () => {
        if (this.state.mode === MODE_RECITE) {
            this.setState({
                mode: null
            })
        } else {
            this.setState({
                mode: MODE_RECITE
            })
        }
    }

    handleClickDictate = () => {
        if (this.state.mode === MODE_DICTATE) {
            this.setState({
                mode: null
            })
        } else {
            this.setState({
                mode: MODE_DICTATE
            })
        }
    }

    isLearnPoetryVisible = () => {
        const isEmpty = this.isEmpty();
        return !isEmpty && this.state.mode === null;
    }

    isReciteVisible = () => {
        return this.state.mode === MODE_RECITE;
    }

    isDictateVisible = () => {
        return this.state.mode === MODE_DICTATE;
    }

    isBtnsVisible = () => {
        return !!window.location.href.match(/id/);
    }

    isEmpty = () => {
        return window.location.href.match(/poetryLearning$/)
    }

    render() {

        return (
            <div>
                {
                    (this.isBtnsVisible() && (<Affix offsetBottom="100px" style={{ zIndex: "1000", position: 'absolute', bottom: "100px", right: "100px" }}>
                        <div>
                            <Button type={this.state.mode === MODE_RECITE ? "primary" : "default"} onClick={this.handleClickRecite} shape="circle-outline">背</Button>
                            <Button type={this.state.mode === MODE_DICTATE ? "primary" : "default"} onClick={this.handleClickDictate} shape="circle">默</Button>
                        </div>
                    </Affix>))
                }
                {
                    (this.isReciteVisible() && <Recite />)
                }
                {
                    (this.isDictateVisible() && <Dictate />)
                }
                {
                    (this.isLearnPoetryVisible()) && (
                        <Card {...this.getCardProps()}>
                            <LearnPoetry />
                        </Card>
                    )
                }
                {
                    (this.isEmpty() && (
                        <div>
                            请先选择一首诗词后再来
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default withRouter(PoetryLearning);