import React, { Component } from 'react'
import MyPoetry from '../MyPoetry/MyPoetry'
import LearnPoetryService from '../../services/LearnPoetryService';
import Appreciation from './Components/Appreciation/Appreciation';
import Translation from './Components/Translation/Translation';
import Remark from './Components/Remark/Remark';
import AboutWriter from './Components/AboutWriter/AboutWriter';
import { withRouter } from "react-router-dom"
import { POETRY_MODE, WRITER_MODE } from './const';
import DetailWriter from './Components/DetailWriter/DetailWriter';
import NotFindWriter from './Components/NotFindWriter/NotFindWriter';
import { Spin } from 'antd'
import ScrollToTop from '../ScrollToTop/ScrollToTop';


class LearnPoetry extends Component {

    state = {
        poetry: null,
        writer: null,
        mode: POETRY_MODE,
        loading: true,
    }

    getLoading = () => {
        return this.state.loading;
    }

    getPoetryIdFromUrl = (url) => {
        if (typeof url === "string") {
            const pattern = /_id=(.*)/;
            const matchResult = url.match(pattern);
            const id = matchResult ? matchResult[1] : null;
            return id;
        }
        return null;
    }

    getWriterNameFromUrl = (url) => {
        if (typeof url === "string") {
            const pattern = /writer=(.*)/;
            const matchResult = url.match(pattern);
            const name = matchResult ? matchResult[1] : null;
            return decodeURI(name)
        }
        return null;
    }

    fetchAccordingToUrl = (url) => {
        if (url.match('_id')) {
            this.setState({
                mode: POETRY_MODE,
            }, () => {
                const id = this.getPoetryIdFromUrl(url)
                if (id) {
                    this.fetchPoetry(id);
                }
            })
        }
        else if (url.match('writer')) {
            this.setState({
                mode: WRITER_MODE,
            }, () => {
                const name = this.getWriterNameFromUrl(url)
                if (name) {
                    this.fetchWriter(name);
                }
            })
        }
    }

    componentDidMount() {
        const href = window.location.href;
        this.fetchAccordingToUrl(href);
        this.unregisterHistoryListener = this.props.history.listen((location) => {
            this.fetchAccordingToUrl(location.search);
        })
    }

    componentWillUnmount() {
        this.unregisterHistoryListener();
    }

    fetchWriter = (name) => {
        this.setState({
            loading: true,
        }, () => {
            LearnPoetryService.getWriter(name).then(ret => {
                if (ret && ret.code === 1) {
                    this.setState({
                        writer: ret.result,
                        loading: false,
                    })
                }
            })
        })
    }


    fetchPoetry = (id) => {
        this.setState({
            loading: true,
        }, () => {
            LearnPoetryService.getPoetry(id).then(ret => {
                if (ret && ret.code === 1) {
                    this.setState({
                        poetry: ret.result,
                        writer: ret.writer,
                        loading: false,
                    })
                } else {
                    console.error(ret);
                }
            }).catch(error => {
                console.error(error);
            })
        })
    }

    getPoetryData = () => {
        return this.state.poetry || {};
    }

    getPoetryAppreciation = () => {
        const { appreciation } = this.getPoetryData();
        return appreciation;
    }

    getTranslation = () => {
        return this.getPoetryData().translation;
    }

    getPoetryRemark = () => {
        return this.getPoetryData().remark
    }

    getAboutWriterProps = () => {
        return {
            ...this.state.writer,
            goToWriter: this.handleGoToWriter
        };
    }

    handleGoToWriter = () => {
        this.setState({
            mode: WRITER_MODE,
        })
    }


    getDetailInfo = () => {
        return this.state.writer && this.state.writer.detailIntro;
    }

    render() {
        const { poetry, mode, writer } = this.state;

        return (
            <Spin spinning={this.getLoading()}>
                {
                    mode === POETRY_MODE ? (poetry && (
                        <div>
                            <MyPoetry data={this.getPoetryData()} goToWriter={this.handleGoToWriter} />
                            <Translation translation={this.getTranslation()} />
                            <Remark remark={this.getPoetryRemark()} />
                            <Appreciation appreciation={this.getPoetryAppreciation()} />
                            {
                                writer &&
                                <AboutWriter {...this.getAboutWriterProps()} />
                            }
                        </div>
                    )) : (
                            writer ?
                                (<div>
                                    <AboutWriter {...this.getAboutWriterProps()} goToWriter={this.handleGoToWriter} />
                                    <DetailWriter detailIntro={this.getDetailInfo()} />
                                </div>) : <NotFindWriter />
                        )
                }
                <ScrollToTop />
            </Spin>
        )
    }
}
export default withRouter(LearnPoetry);