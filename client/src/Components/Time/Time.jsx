import React, { useState, useEffect } from "react"
import "./Time.less";

export default function Time(props) {
    const date = new Date();
    const [time, setTime] = useState(date)

    const getTime = () => {
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

    useEffect(() => {
        const clockID = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(clockID);
        }
    }, [])

    return (
        <div className="cmp-time" style={props.style}>
            {getTime(time)}
        </div>
    )
}