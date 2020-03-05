import React, { Component } from 'react'
import MyPoetry from '../MyPoetry/MyPoetry'
import LearnPoetryService from '../../services/LearnPoetryService';
import Appreciation from './Components/Appreciation/Appreciation';
import Translation from './Components/Translation/Translation';
import Remark from './Components/Remark/Remark';

class LearnPoetry extends Component {

    state = {
        poetry: null,
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

    componentDidMount() {
        const url = window.location.href;
        const id = this.getPoetryIdFromUrl(url)
        if (id) {
            this.fetchPoetry(id);
        }
    }

    fetchPoetry = (id) => {
        LearnPoetryService.getPoetry(id).then(ret => {
            if (ret && ret.code === 1) {
                this.setState({
                    poetry: ret.result,
                })
            } else {
                console.error(ret);
            }
        }).catch(error => {
            console.error(error);
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

    render() {
        return (
            <div>
                {this.state.poetry && (
                    <div>
                        <MyPoetry data={this.getPoetryData()} />
                        <Translation translation={this.getTranslation()} />
                        <Remark remark={this.getPoetryRemark()} />
                        <Appreciation appreciation={this.getPoetryAppreciation()} />

                    </div>
                )}
            </div>
        )
    }
}
export default LearnPoetry;