import React, { Component } from "react";
import { Spin } from "antd"
import MyPoetry from "../MyPoetry/MyPoetry";


export default class MyPoetryList extends Component {

    getData = () => {
        return this.props.data || [];
    }

    getLoading = () => {
        return this.props.loading;
    }

    render() {
        const list = this.getData();
        return (
            <Spin spinning={this.getLoading()}>
                {list.map((poetry) => {
                    return <MyPoetry data={poetry} key={poetry._id} searchWords={this.props.searchWords}/>
                })}
            </Spin>
        )
    }
}