import React, { Component } from 'react'
import { Input, Button } from "antd"
import "./style.less"

function SearchBox(props) {
    const handleChange = (e) => {
        props.handleChange(e);
    }

    const handleSearch = () => {
        props.handleSearch();
    }

    const handleInputPressEnter = () => {
        handleSearch();
    }

    const handleClickButton = () => {
        handleSearch();
    }

    return (
        <div className="search-box">
            <div className="search-items">
                <div className="search-item">
                    <label htmlFor="title">题目</label>
                    <Input onPressEnter={handleInputPressEnter} onChange={handleChange} id="title" autoComplete="off"></Input>
                </div>
                <div className="search-item">
                    <label htmlFor="dynasty">朝代</label>
                    <Input onPressEnter={handleInputPressEnter} onChange={handleChange} id="dynasty" autoComplete="off"></Input>
                </div>
                <div className="search-item">
                    <label htmlFor="writer">作者</label>
                    <Input onPressEnter={handleInputPressEnter} onChange={handleChange} id="writer" autoComplete="off"></Input>
                </div>
                <div className="search-item">
                    <label htmlFor="content">内容</label>
                    <Input onPressEnter={handleInputPressEnter} onChange={handleChange} id="content" autoComplete="off"></Input>
                </div>
                <div className="search-item">
                    <label htmlFor="type">类型</label>
                    <Input onPressEnter={handleInputPressEnter} onChange={handleChange} id="type" autoComplete="off"></Input>
                </div>
                <div className="search-button">
                    <Button onClick={handleClickButton} icon="search">搜索</Button>
                </div>
            </div>
        </div>
    )
}

export default SearchBox;