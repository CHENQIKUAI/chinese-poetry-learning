import React, { Component, createRef } from "react";
import { withRouter } from "react-router-dom"
import "./MyPoetry.less"
import { POETRY_LEARNING } from "../Menu/menuConstants";
import { likePoetry, dislikePoetry } from "../../services/PoetrySearchService";
import { message, Icon } from "antd";
import ImgLike from "../../img/like.png";
import ImgDislike from "../../img/dislike.png";
import Highlighter from "react-highlight-words";
import urlUtil from "../../utils/urlUtil";

class MyPoetry extends Component {

    state = {
        like: false,
        audioVisible: false,
    }

    componentDidMount() {
        const { like } = this.getData();
        if (like) {
            this.setState({
                like: true,
            })
        }
        this.audioRef = React.createRef();
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {

            const { like } = nextProps.data;
            if (like) {
                this.setState({
                    like: true,
                })
            } else {
                this.setState({
                    like: false,
                })
            }
        }
    }

    getData = () => {
        return this.props.data || {};
    }

    getLoading = () => {
        return this.props.loading;
    }

    handleClick = () => {
        const { _id } = this.getData();
        this.props.history.push(urlUtil.getPoetryLearningPoetryUrl(_id))
    }

    handlePostLike = (_id) => { //一个有副作用的函数
        likePoetry(_id).then((ret) => {
            if (ret && ret.code === 1) {
                message.success("收藏成功")
                this.setState({
                    like: true,
                })
            } else {
                message.error("收藏失败")
                console.error(ret);
            }
        }).catch(error => {
            message.error("收藏失败")
            console.error(error);
        })
    }

    handlePostDislike = (_id) => { //一个有副作用的函数
        dislikePoetry(_id).then((ret) => {
            if (ret && ret.code === 1) {
                message.success("取消收藏成功")
                this.setState({
                    like: false,
                })
            } else {
                message.error("取消收藏失败")
                console.error(ret);
            }
        }).catch(error => {
            message.error("取消收藏失败")
            console.error(error);
        })
    }

    handleClickLike = () => {
        const { _id } = this.getData();
        if (this.state.like) { // 如果已经收藏了
            this.handlePostDislike(_id);
        } else {
            this.handlePostLike(_id);
        }
    }

    handleClickSound = () => {
        const audio = this.audioRef.current;

        this.setState((state) => ({
            audioVisible: !state.audioVisible,
        }), () => {
            if (this.state.audioVisible) { // 如果可以看见了
                audio.currentTime = 0;
                audio.play();
            } else {
                audio.pause();
            }
        })
    }


    handleClickWriter = () => {
        const { writer } = this.props.data;
        this.props.history.push(urlUtil.getPoetryLearningWriterUrl(writer))
        this.props.goToWriter && this.props.goToWriter();
    }


    render() {
        let {
            title,
            writer,
            dynasty,
            content,
            type,
            audioUrl,
        } = this.props.data || {};


        return (
            <div className="my-poetry">
                <div>
                    <span className="title" onClick={this.handleClick}>
                        <Highlighter
                            highlightClassName="high-light-text"
                            searchWords={this.props.searchWords || []}
                            textToHighlight={title || ""}
                        />
                    </span>
                </div>
                <div className="writer-msg">
                    <span >
                        <Highlighter
                            highlightClassName="high-light-text"
                            searchWords={this.props.searchWords || []}
                            textToHighlight={dynasty ? dynasty + ": " : ""}
                        />
                    </span>
                    <span onClick={this.handleClickWriter} className={"writer"}>
                        <Highlighter
                            highlightClassName="high-light-text"
                            searchWords={this.props.searchWords || []}
                            textToHighlight={writer || ""}
                        />
                    </span>
                </div>
                <div className="content">
                    <Highlighter
                        highlightClassName="high-light-text"
                        searchWords={this.props.searchWords || []}
                        textToHighlight={content || ""}
                    />
                </div>
                <div className="functions">
                    <img className="icon" onClick={this.handleClickLike} src={this.state.like ? ImgLike : ImgDislike} alt="" />
                    {audioUrl &&
                        <Icon onClick={this.handleClickSound} type="sound" className="icon" />
                    }
                    <audio className="audio" style={{ display: this.state.audioVisible ? "inline" : "none" }} src={audioUrl} controls ref={this.audioRef}></audio>
                </div>
                {Array.isArray(type) && type.map((item, index) => (
                    item + "   "
                ))}
            </div>
        )
    }
}

export default withRouter(MyPoetry)