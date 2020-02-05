import React, { Component, } from "react"

import { Tag, Input, Tooltip, Icon } from "antd"

class TypeList extends Component {

    state = {
        tags: ['s', 'Tag 2', 'Tag 3'],
        inputVisible: false,
        inputValue: '',
    };

    handleClose = removedTag => {
        const { value, onChange } = this.props;
        const restTags = value.filter(tag => tag !== removedTag);
        console.log(restTags);
        onChange(restTags);
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { value: tags, onChange } = this.props;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({
            inputVisible: false,
            inputValue: '',
        });
        onChange(tags);
    };

    saveInputRef = input => (this.input = input);

    render() {
        const { value: tags } = this.props;
        const { inputVisible, inputValue } = this.state;
        return (
            <div>
                {tags && tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag} closable={true} onClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                            tagElem
                        );
                })}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <Icon type="plus" /> New Tag
                    </Tag>
                )}
            </div>
        );
    }
}





export default TypeList;