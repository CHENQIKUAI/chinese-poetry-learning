import React from 'react'
import AboutWriter from '../AboutWriter/AboutWriter'

export default function NotFindWriter() {

    function getProps() {
        return {
            name: "未找到",
            simpleIntro:
                `本系统未录入该作者`,
        }
    }

    return (
        <div>
            <AboutWriter {...getProps()} />
        </div>
    )
}