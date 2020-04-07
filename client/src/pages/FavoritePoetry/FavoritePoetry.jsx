import React, { Component } from "react";
import { Card, message, Pagination } from "antd";
import MyPoetryList from "../../Components/MyPoetryList/MyPoetryList";
import FavoritePoetryService from "../../services/FavoritePoetryService";

export default class FavoritePoetry extends Component {

    state = {
        current: 1,
        pageSize: 10,
        total: 0,
        poetryList: [],
        loading: true,
    }

    componentDidMount() {
        this.fetchPoetryList(1, this.state.pageSize);
    }

    getCardTitle = () => {
        return <div className="card-title">收藏夹</div>
    }

    getCardProps = () => {
        return {
            title: this.getCardTitle(),
        }
    }

    getPaginationProps = () => {
        return {
            total: this.state.total,
            current: this.state.current,
            pageSize: this.state.pageSize,
            onChange: this.handlePageChange,
            className: "poetry-search-pagination"
        }
    }

    handlePageChange = (current, pageSize) => {
        this.fetchPoetryList(current, pageSize);
    }

    fetchPoetryList = (current, pageSize) => {
        this.setState({
            loading: true,
        }, () => {
            FavoritePoetryService.getPoetryList(current, pageSize).then((ret) => {
                const { result: list, total, current } = ret;
                this.setState({
                    poetryList: list,
                    total,
                    current,
                    loading: false,
                })
            }).catch((error) => {
                console.error(error);
                message.error("error in fetching!");
            })
        })
    }

    hasData = () => {
        if (this.state.poetryList && this.state.poetryList.length === 0)
            return false;
        else
            return true;
    }

    render() {
        const hasData = this.hasData();

        return (
            <div>
                <Card {...this.getCardProps()}>
                    <MyPoetryList
                        data={this.state.poetryList}
                        loading={this.state.loading}
                    />
                    <Pagination {...this.getPaginationProps()} />
                </Card>
            </div>
        )
    }
} 