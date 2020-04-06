import React, { Component } from 'react'
import { Input, Button } from "antd"
import "./style.less"

class SearchBox extends Component {

    handleChange = (e) => {
        this.props.handleChange(e);
    }

    handleSearch = () => {
        this.props.handleSearch();
    }

    handleInputPressEnter = () => {
        this.handleSearch();
    }

    handleClickButton = () => {
        this.handleSearch();
    }

    render() {
        return (
            <div className="search-box">
                <div className="search-items">
                    <div className="search-item">
                        <label htmlFor="title">题目</label>
                        <Input onPressEnter={this.handleInputPressEnter} onChange={this.handleChange} id="title" autoComplete="off"></Input>
                    </div>
                    <div className="search-item">
                        <label htmlFor="dynasty">朝代</label>
                        <Input onPressEnter={this.handleInputPressEnter} onChange={this.handleChange} id="dynasty" autoComplete="off"></Input>
                    </div>
                    <div className="search-item">
                        <label htmlFor="writer">作者</label>
                        <Input onPressEnter={this.handleInputPressEnter} onChange={this.handleChange} id="writer" autoComplete="off"></Input>
                    </div>
                    <div className="search-item">
                        <label htmlFor="content">内容</label>
                        <Input onPressEnter={this.handleInputPressEnter} onChange={this.handleChange} id="content" autoComplete="off"></Input>
                    </div>
                    <div className="search-item">
                        <label htmlFor="type">类型</label>
                        <Input onPressEnter={this.handleInputPressEnter} onChange={this.handleChange} id="type" autoComplete="off"></Input>
                    </div>
                    <div className="search-button">
                        <Button onClick={this.handleClickButton} icon="search">搜索</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchBox;