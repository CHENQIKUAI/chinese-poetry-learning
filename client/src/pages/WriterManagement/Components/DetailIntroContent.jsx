import React from 'react'
import TextArea from 'antd/lib/input/TextArea';

function DetailIntroContent(props) {
    const content = props.content;
    const handleChangeContent = props.handleChangeContent;

    function handleChange(e) {
        handleChangeContent(e.target.value);
    }

    if (content !== null) {
        return (
            <>
                <TextArea rows={6} value={content} onChange={handleChange} />
            </>
        )
    } else {
        return (
            <div>选中模块后修改</div>
        )
    }
}

export default DetailIntroContent;