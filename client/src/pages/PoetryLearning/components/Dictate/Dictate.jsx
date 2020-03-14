import React from 'react'
import LearnPoetryService from '../../../../services/LearnPoetryService';
import "./style.less";
import { Input, Button } from 'antd';

class Dictate extends React.Component {
    state = {
        value: "",
        counterDownTime: 0,
        output: "",
        poetry: null,
        contentVisible: false,
    }

    fetchPoetry = () => {
        const id = window.location.href.match(/_id=(.*)/)[1];
        LearnPoetryService.getPoetry(id).then(ret => {
            if (ret && ret.code === 1) {
                const { title, dynasty, writer, content } = ret.result;
                this.setState({
                    poetry: { title, dynasty, writer, content }
                })
            }
        })
    }

    componentDidMount() {
        this.fetchPoetry();
    }

    handleCompute = () => {
        LearnPoetryService.compute(this.state.value, this.state.poetry.content).then(ret => {
            if (ret && ret.code === 1) {
                this.setState({
                    output: ret.result
                })
            }
        })
    }


    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    handleShowContent = () => {
        this.setState((state) => {
            return {
                contentVisible: !state.contentVisible
            }
        })
    }


    render() {
        const { poetry } = this.state;
        const { title, dynasty, writer, content } = poetry || {};

        return (
            <div>
                <div className="dictate-box">
                    <div className="first-line">
                        <div className="title">{title}</div>
                        <div className="mark">
                            <Button
                                onClick={this.handleCompute}
                                type={this.state.output ? "primary" : "default"}
                            >
                                打分
                            </Button>
                            <span>{this.state.output} {this.state.output ? "分" : null}</span>
                        </div>
                        <Button onClick={this.handleShowContent} type={this.state.contentVisible ? "primary" : "default"}>原文</Button>
                    </div>
                    <div>
                        <span>{dynasty}: </span>
                        <span>{writer}</span>
                    </div>
                    <div className="content">
                        <Input.TextArea
                            className="content-input"
                            rows={6}
                            onChange={this.handleChange}
                            value={this.state.value} />
                        <div className="content-original">
                            {this.state.contentVisible && content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dictate;