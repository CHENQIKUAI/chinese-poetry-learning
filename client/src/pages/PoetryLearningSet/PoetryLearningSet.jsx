import React, { Component } from "react";
import { Card, Spin, Button } from "antd"
import { withRouter } from "react-router-dom"
import { SET_MODE, SETS_MODE } from "./const";
import { POETRY_LEARNING_SET } from "../../Components/Menu/menuConstants";
import SetsDescription from "../../Components/LearningSet/SetsDescription/SetsDescription";
import { getSets, getSpeificSet } from "../../services/LearningSetService";
import SetsList from "../../Components/LearningSet/SetsList/SetsList";
import SetDescription from "../../Components/LearningSet/SetDescription/SetDescription";
import "./style.less"
import PoetryList from "../../Components/LearningSet/PoetryList/PoetryList";
import SetModal from "./SetModal/SetModal";

class PoetryLearningSet extends Component {

    state = {
        mode: SETS_MODE,
        setsList: [],
        setList: [],
        setsDescription: {},
        setDescription: {},
        loading: true,
        setModalVisible: false,
        created_poetry_list_id: null,
        setMsg: { title: "", _id: "", cron: null },
    }

    handleGoToSets = () => {
        this.setState({
            mode: SETS_MODE
        })
    }

    handleGoToSet = (created_poetry_list_id) => {
        this.setState({
            mode: SET_MODE,
            created_poetry_list_id
        })
    }

    componentDidMount() {
        if (this.state.mode === SETS_MODE) {
            this.fetchSets();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.mode !== this.state.mode) {
            if (this.state.mode === SETS_MODE) {
                this.fetchSets();
            } else if (this.state.mode === SET_MODE) {
                this.fetchSet();
            }
        }
    }

    fetchSets = () => {
        this.setState({
            loading: true,
        }, () => {
            getSets().then(ret => {
                if (ret && ret.code === 1) {
                    this.setState({
                        setsList: ret.result.list,
                        setsDescription: ret.result.description,
                        loading: false,
                    })
                }
            })
        })
    }


    fetchSet = () => {
        this.setState({
            loading: true,
        }, () => {
            getSpeificSet(this.state.created_poetry_list_id).then(ret => {
                if (ret && ret.code === 1) {
                    this.setState({
                        setList: ret.result.list,
                        setDescription: ret.result.description,
                        loading: false,
                    })
                }
            })
        })
    }

    getSetsProps = () => {
        return {
            ...this.state.setsDescription,
            clickAdd: () => {
                this.setState({
                    setModalVisible: true,
                    setMsg: {
                        _id: null,
                        title: "",
                        cron: null,
                    }
                })
            }
        };
    }

    getSetsData = () => {
        return this.state.setsList;
    }

    getSetProps = () => {
        return {
            ...this.state.setDescription,
            _id: this.state.created_poetry_list_id,
            type: "description",
            refreshFunction: this.refresh
        };
    }

    getCardTitle = () => {
        if (this.state.mode === SETS_MODE)
            return <div className="card-title">学习集集合</div>
        else
            return <div className="card-title">学习集</div>
    }

    handleClickBack = () => {
        this.setState({
            mode: SETS_MODE
        })
    }

    getCardExtra = () => {
        if (this.state.mode === SET_MODE)
            return <Button icon="left" className="back" onClick={this.handleClickBack}>返回</Button>
    }

    getCardProps = () => {
        return {
            title: this.getCardTitle(),
            extra: this.getCardExtra(),
            className: "learning-set"
        }
    }


    getPoetryListProps = () => {
        return {
            data: this.state.setList,
            created_poetry_list_id: this.state.created_poetry_list_id,
            refreshFunction: this.refresh
        }
    }

    getSetModalProps = () => {
        return {
            ...this.state.setMsg,
            setModalVisible: this.state.setModalVisible,
            refreshFunction: this.refresh,
            hideModal: this.hideModal,
            handleChangeSetMsg: this.handleChangeSetMsg
        };
    }

    setSelectedSet = (_id, title, cron) => {
        this.setState({
            setMsg: {
                _id,
                title,
                cron,
            },
            setModalVisible: true,
        })
    }

    refresh = () => {
        if (this.state.mode === SETS_MODE) {
            this.fetchSets();
        } else {
            this.fetchSet();
        }
    }

    hideModal = () => {
        this.setState({
            setModalVisible: false,
        })
    }

    handleChangeSetMsg = ({ title, cron }) => {

        if (title) {
            this.setState((state) => {
                return {
                    ...state,
                    setMsg: {
                        ...state.setMsg,
                        title
                    }
                }
            })
        }

        if (cron) {
            this.setState((state) => {
                return {
                    ...state,
                    setMsg: {
                        ...state.setMsg,
                        cron
                    }
                }
            })
        }
    }

    render() {
        const { mode } = this.state;
        return (
            <div>
                <Card {...this.getCardProps()}>
                    <Spin spinning={this.state.loading}>
                        {
                            mode === SETS_MODE && (
                                <div>
                                    <SetsDescription {...this.getSetsProps()} />
                                    <SetsList refreshFunction={this.refresh} setSelectedSet={this.setSelectedSet} list={this.getSetsData()} handleGoToSet={this.handleGoToSet} />
                                    {/* <SetModal {...this.getSetModalProps()} /> */}
                                    <SetModal {...this.getSetModalProps()} />
                                </div>
                            )
                        }
                        {
                            mode === SET_MODE && (
                                <div>
                                    <SetDescription {...this.getSetProps()} />
                                    <PoetryList {...this.getPoetryListProps()} />
                                </div>
                            )
                        }
                    </Spin>
                </Card>
            </div>
        )
    }
}

export default withRouter(PoetryLearningSet);