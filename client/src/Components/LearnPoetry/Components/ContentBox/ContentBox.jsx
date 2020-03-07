import React, { useEffect, useState } from 'react'
import "./style.less"

const HEIGHT_RECOMMENT = 300;

export default function ContentBox({ data, title, spreadable = false }) {
    const refContainer = React.createRef();
    let ref;
    const [spreadEleVisible, setSpreadVisible] = useState(true)

    function spreadContent() {
        setSpreadVisible(false);
    }

    function getContentHeight() {
        const ele = document.createElement("div");
        ele.innerText = data;
        ele.style.whiteSpace = "pre-wrap";
        document.body.appendChild(ele);
        const height = ele.offsetHeight;
        document.body.removeChild(ele);
        return height
    }

    useEffect(() => {
        if (spreadable) {
            const height = getContentHeight();
            if (height <= HEIGHT_RECOMMENT) {
                setSpreadVisible(false);
            } else {
                setSpreadVisible(true);
            }
        }
    }, [])


    title = title || "无题"

    return (
        data ?
            <div className="box-container" ref={(node) => ref = node}>
                <h1 className="box-title">
                    {title ? title : `对不起，没有${title}!`}
                </h1>
                <div className={(spreadable && spreadEleVisible) ? "box-content box-hidde-util" : "box-content"}>
                    {data}
                </div>
                {
                    spreadable && spreadEleVisible &&
                    <div className="box-spread">
                        <p onClick={spreadContent}>展开全文阅读 👇</p>
                    </div>
                }
            </div > : null
    )
}
