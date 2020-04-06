import React, { Component } from "react";
import { Pagination, message, Card } from "antd"
import { getPoetryList } from "../../services/PoetrySearchService";
import { pageSizeOptions } from "./const";
import MyPoetryList from "../../Components/MyPoetryList/MyPoetryList";
import SearchBox from "./SearchBox/SearchBox";
import "./PoetrySearch.less";

class PoetrySearch extends Component {
    constructor(props) {
        super(props);
        this.cardRef = null;
        this.state = {
            loading: true,
            current: 1,
            pageSize: 10,
            total: 0,
            poetryList: [],
            highLightWorlds: [],
            title: "",
            dynasty: "",
            writer: "",
            content: "",
            type: "",
        }
    }

    componentDidMount() {
        const { pageSize } = this.state;
        const { title, dynasty, writer, content, type } = this.state;
        this.fetchPoetryList(1, pageSize, { title, dynasty, writer, content, type });
    }

    getSearchWordsArray = (filterObj) => {
        let arr = [];
        for (const key in filterObj) {
            arr = arr.concat(filterObj[key].split(/\s|，/));
        }
        return arr;
    }

    fetchPoetryList = (current, pageSize, filterObj, callback) => {
        this.setState({
            loading: true,
        }, () => {
            getPoetryList(current, pageSize, filterObj).then((ret) => {
                const { result: list, total, current } = ret;
                this.setState({
                    poetryList: list,
                    total,
                    current,
                    loading: false,
                    highLightWorlds: this.getSearchWordsArray(filterObj)
                },
                    callback
                )
            }).catch((error) => {
                console.error(error);
                message.error("error in fetching!");
            })
        })
    }

    handlePageChange = (current, pageSize) => {
        const { title, dynasty, writer, content, type } = this.state;
        this.fetchPoetryList(current, pageSize, { title, dynasty, writer, content, type }, this.scrollToTop);
    }

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
        })
    }

    handleSearch = () => {
        const { title, dynasty, writer, content, type, pageSize } = this.state;
        this.fetchPoetryList(1, pageSize, { title, dynasty, writer, content, type });
    }

    handleChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        this.setState({
            [id]: value
        })
    }

    getCardProps = () => {
        return {
            title: <div className="card-title">诗词搜索</div>,
        }
    }

    getSearchBoxProps = () => {
        return {
            handleSearch: this.handleSearch,
            handleChange: this.handleChange,
        }
    }

    getMyPoetryListProps = () => {
        return {
            data: this.state.poetryList,
            loading: this.state.loading,
            searchWords: this.state.highLightWorlds,
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

    render() {
        return (
            <Card {...this.getCardProps()}>
                <SearchBox {...this.getSearchBoxProps()} />
                <MyPoetryList {...this.getMyPoetryListProps()} />
                <Pagination {...this.getPaginationProps()} />
            </Card>
        )
    }
}

export default PoetrySearch