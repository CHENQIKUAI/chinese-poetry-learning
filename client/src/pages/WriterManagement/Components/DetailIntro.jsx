import React, { useState, useEffect } from 'react'
import DetailIntroContent from "./DetailIntroContent"
import DetailTitle from "./DetailIntroTitle"

function DetailIntro(props, ref) {
    const value = props.value;
    const onChange = props.onChange;

    let detail = JSON.parse(value || '{}');
    let introTitles = Object.keys(detail);

    const [selectedIndex, setSelectedIndex] = useState(-1)

    //每次标签数量发生改变时 设置index为-1
    useEffect(() => {
        setSelectedIndex(-1);
    }, [introTitles.length])

    function handleChangeTitles(newTitles) {
        // 删除
        for (let key in detail) {
            if (newTitles.every(t => t !== key)) {
                delete detail[key]
            }
        }
        //新增
        for (let i = 0; i < newTitles.length; ++i) {
            const title = newTitles[i];
            if (introTitles.every(t => t !== title)) {
                detail[title] = "";
            }
        }
        onChange(JSON.stringify(detail));
    }

    function getIntroContent() {
        if (selectedIndex !== -1) {
            const key = introTitles[selectedIndex];
            return detail[key];
        } else {
            return null;
        }
    }

    function handleClickTag(index) {
        if (index === selectedIndex) {
            setSelectedIndex(-1);
        } else {
            setSelectedIndex(index);
        }
    }

    function handleChangeContent(value) {
        const key = introTitles[selectedIndex]
        detail[key] = value;
        onChange(JSON.stringify(detail))
    }

    return (
        <>
            <DetailTitle
                introTitles={introTitles}
                selectedIndex={selectedIndex}
                handleChangeTitles={handleChangeTitles}
                handleClickTag={handleClickTag}
            />
            <DetailIntroContent
                content={getIntroContent()}
                handleChangeContent={handleChangeContent} />
        </>
    )
}

export default React.forwardRef(DetailIntro)

