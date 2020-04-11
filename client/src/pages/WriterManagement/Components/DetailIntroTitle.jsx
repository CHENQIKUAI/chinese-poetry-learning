import React, { useState, useEffect } from 'react'
import { Tag, Input, Tooltip, Icon } from 'antd';

function DetailIntroTitle(props) {
    const introTitles = props.introTitles;
    const handleChangeTitles = props.handleChangeTitles;
    const handleClickTag = props.handleClickTag;
    const selectedIndex = props.selectedIndex;

    const [inputValue, setInputValue] = useState('')

    const saveInputRef = React.createRef();
    const [inputVisible, setInputVisible] = useState(false)

    useEffect(() => {
        if (inputVisible) {
            saveInputRef.current.focus();
        }
    }, [inputVisible])

    const handleClickAddModule = () => {
        setInputVisible(true);
        handleClickTag(-1);
    }

    const handleClose = (title) => {
        const newTitle = introTitles.filter(t => t !== title)
        handleChangeTitles(newTitle);
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleInputConfirm = () => {

        if (inputValue && inputValue.length !== 0 && inputValue.trim() !== "") {
            handleChangeTitles(introTitles.concat(inputValue));
            setInputValue("");
        }
        setInputVisible(false)
    }

    return (
        <div>
            {introTitles.map((title, index) => {
                const isLongTitle = title.length > 20;
                const titleElem = (
                    <Tag onClick={() => handleClickTag(index)} color={index === selectedIndex ? "red" : "blue"} key={title} closable={true} onClose={() => handleClose(title)}>
                        {isLongTitle ? `${title.slice(0, 20)}...` : title}
                    </Tag>
                );
                return isLongTitle ? (
                    <Tooltip title={title} key={title}>
                        {titleElem}
                    </Tooltip>
                ) : (
                        titleElem
                    );
            })}
            {inputVisible && (
                <Input
                    ref={saveInputRef}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            )}
            {!inputVisible && (
                <Tag onClick={handleClickAddModule} style={{ background: '#fff', borderStyle: 'dashed' }}>
                    <Icon type="plus" /> 添加介绍模块
                </Tag>
            )}
        </div>
    )
}

DetailIntroTitle = React.memo(DetailIntroTitle)

export default DetailIntroTitle;