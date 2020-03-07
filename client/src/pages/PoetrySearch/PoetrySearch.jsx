import React, { Component } from "react";
import { Pagination, message, Card, Input, Icon, Button } from "antd"
import { getPoetryList } from "../../services/PoetrySearchService";
import { pageSizeOptions } from "./const";
import { withRouter } from "react-router-dom"
import MyPoetryList from "../../Components/MyPoetryList/MyPoetryList";
import { POETRY_SEARCH } from "../../Components/Menu/menuConstants";
import "./PoetrySearch.less";

class PoetrySearch extends Component {

    state = {
        current: 1,
        pageSize: 10,
        total: 0,
        poetryList: [],
        loading: true,
        value: "",
        highLightWorlds: [],
    }

    fetchPoetryList = (current, pageSize, value = null) => {
        this.setState({
            loading: true,
        }, () => {
            getPoetryList(current, pageSize, value).then((ret) => {
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

    getUrlValue = () => {
        const search = this.props.history.location.search;
        const value = search.split('=')[1];
        return (value && decodeURI(value)) || null;
    }

    componentDidMount() {
        const { pageSize } = this.state;
        const value = this.getUrlValue();
        if (value) {
            this.fetchPoetryList(1, pageSize, value);
            this.setState({
                value
            })
            this.setHighlightWords(value);
        } else {
            this.fetchPoetryList(1, pageSize);
        }
    }

    handlePageChange = (current, pageSize) => {
        const { value } = this.state;
        this.fetchPoetryList(current, pageSize, value);
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

    getCardTitle = () => {
        return <div className="card-title">诗词搜索</div>
    }

    getCardProps = () => {
        return {
            title: this.getCardTitle(),
        }
    }

    handleSearch = () => {
        const { value, pageSize } = this.state;
        this.fetchPoetryList(1, pageSize, value);
        this.setHighlightWords(value);
        this.props.history.push(`${POETRY_SEARCH}?value=${value}`)
    }

    handleInputPressEnter = () => {
        this.handleSearch();
    }

    handleClickButton = () => {
        this.handleSearch();
    }

    handleInputChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    hasData = () => {
        if (this.state.poetryList.length === 0)
            return false;
        else
            return true;
    }

    setHighlightWords = (value) => {
        if (value) {
            this.setState({
                highLightWorlds: value.split(' '),
            })
        } else {
            this.setState({
                highLightWorlds: []
            })
        }
    }

    render() {

        const hasData = this.hasData();

        return (
            <div>
                <Card {...this.getCardProps()}>

                    <div className="search-line">
                        <Input className='search-input' onPressEnter={this.handleInputPressEnter} value={this.state.value} onChange={this.handleInputChange} />
                        <Button className="search-button" icon="search" onClick={this.handleClickButton}>搜索</Button>
                    </div>

                    <MyPoetryList
                        data={this.state.poetryList}
                        loading={this.state.loading}
                        searchWords={this.state.highLightWorlds}
                    />
                    {
                        !this.state.loading && !hasData && <div className="no-data-container">
                            <svg t="1582207914922" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2104" width="200" height="200"><path d="M769.591241 318.486658 251.302001 318.486658c-10.216689 0-18.48705 8.5487-18.48705 19.045775 0 10.495028 8.270361 18.993586 18.48705 18.993586L769.591241 356.526019c10.217712 0 18.486026-8.552793 18.486026-18.993586C788.078291 327.09164 779.809977 318.486658 769.591241 318.486658L769.591241 318.486658zM788.078291 222.147496 232.814951 222.147496c-10.273994 0-18.549471 8.494465-18.549471 18.98847 0 10.496052 8.275477 18.933211 18.549471 18.933211l555.263339 0c10.275018 0 18.550495-8.43716 18.550495-18.98847C806.628786 230.640937 798.353308 222.147496 788.078291 222.147496L788.078291 222.147496zM944.891779 420.269809l-73.01699-272.919856c-0.166799-0.668219-0.333598-1.218758-0.61296-1.886977-11.495822-30.040177-28.264741-50.031487-72.853261-50.031487L221.262848 97.04115c-36.981263 0-58.691727 14.937201-72.682369 49.753147-0.279363 0.778736-0.556679 1.558495-0.724501 2.276856L75.447854 427.76655c-5.605671 5.498224-9.216919 12.438287-9.216919 20.48659l0 436.723549c0 20.880563 24.376177 41.08779 44.700061 41.08779L925.399843 926.06448c20.323884 0 29.264511-20.207227 29.264511-41.08779L954.664354 448.25314C954.664354 436.09217 951.498244 426.319595 944.891779 420.269809L944.891779 420.269809zM732.55472 728.609363 288.338522 728.609363 288.338522 617.555058l444.216197 0L732.55472 728.609363 732.55472 728.609363zM677.025009 450.974112c0 0-39.257096 0.500397-58.635445 0.500397L411.776879 451.474508c-19.378349 0-67.906599-0.500397-67.906599-0.500397L121.760646 450.974112l61.524239-290.851251c7.552-18.49319 14.713097-25.045419 38.033221-25.045419l577.202001-1.662873c25.653263 0 30.819936 6.54916 37.982056 24.986067l62.632479 292.572452L677.025009 450.973088 677.025009 450.974112zM677.025009 450.974112" p-id="2105" fill="#707070"></path></svg>
                            <p>没有匹配诗词...</p>
                        </div>
                    }
                    <Pagination {...this.getPaginationProps()} />
                </Card>
            </div>
        )
    }
}


export default withRouter(PoetrySearch);