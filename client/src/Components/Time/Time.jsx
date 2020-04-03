import React, { Component } from "react"
import "./Time.less";

class Time extends Component {

    constructor(props) {
        super(props);
        const time = this.getTime();
        this.state = {
            time
        }
    }

    getTime = () => {
        var date = new Date();
        var week = date.getDay();
        var weekday;
        switch (week) {
            case 0: weekday = '星期天'; break;
            case 1: weekday = '星期一'; break;
            case 2: weekday = '星期二'; break;
            case 3: weekday = '星期三'; break;
            case 4: weekday = '星期四'; break;
            case 5: weekday = '星期五'; break;
            case 6: weekday = '星期六'; break;
        }
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        hour = (hour + "").length < 2 ? `0${hour}` : hour;
        minute = (minute + "").length < 2 ? `0${minute}` : minute;
        second = (second + "").length < 2 ? `0${second}` : second;

        const time = `${year}年${month}月${day}日  ${weekday} ${hour}:${minute}:${second}`;

        return time;
    }


    componentDidMount() {
        this.clockID = setInterval(() => {
            const time = this.getTime();
            this.setState({
                time: time
            })

        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.clockID);
    }

    render() {
        return (
            <div className="cmp-time" style={this.props.style}>
                {
                    this.state.time
                }
            </div>
        )
    }
}

export default Time;