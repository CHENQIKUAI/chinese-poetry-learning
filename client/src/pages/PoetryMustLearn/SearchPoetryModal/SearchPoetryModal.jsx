import React from 'react'
import PropTypes from 'prop-types';
import { Modal, message, Icon, Input, Button, Table } from 'antd';
import { getPoetryByTitle } from '../../../services/PoetryMustLearnService';

class SeachPoetryModal extends React.Component {
    state = {
        searchText: "",
        searchedLoading: false,
        searchedPoetryList: [],
    }

    hideModal = () => {
        this.props.hideModal();
        this.setState({
            searchText: "",
            searchedPoetryList: [],
        })
    }

    handleCancel = () => {
        this.hideModal();
    }

    getModalProps = () => {

        const getModalTitle = () => {
            return <div className="modal-title-center">新增诗词</div>
        }

        const getVisible = () => {
            return this.props.visible;
        }

        return {
            visible: getVisible(),
            title: getModalTitle(),
            onCancel: this.handleCancel,
            footer: null,
            cancelButtonProps: { style: { display: "none" } },
            width: "800px",
            className: "modal-search-poetry",
        }
    }



    handleClickSearch = () => {
        const { searchText } = this.state;
        if (searchText.trim() !== "")
            this.fetchPoetryByTitle(searchText);
    }

    fetchPoetryByTitle = (searchText) => {
        this.setState({
            searchedLoading: true,
        }, () => {
            getPoetryByTitle(searchText).then((ret) => {
                if (ret && ret.code === 1) {
                    this.setState({
                        searchedPoetryList: ret.result,
                    })
                } else {
                    message.error("搜索错误!")
                    console.error(ret);
                }
                this.setState({
                    searchedLoading: false,
                })
            }).catch((err) => {
                message.error("搜索错误!")
                console.error(err);
                this.setState({
                    searchedLoading: false,
                })
            })
        })

    }

    getSearchedTableProps = () => {
        return {
            columns: [
                {
                    dataIndex: "title",
                    title: "题目",
                    align: "center",
                },
                {
                    dataIndex: "writer",
                    title: "作者",
                    align: "center",
                },
                {
                    dataIndex: "content",
                    title: "内容",
                    align: "center",
                    render: (text) => {
                        return text.split(/[\n。]/)[0] + "..."
                    }
                },
                {
                    title: "操作",
                    align: "center",
                    render: (record) => {
                        const { _id } = record;
                        return <Icon
                            type="plus"
                            onClick={this.handleClickPlus.bind(this, _id)} />
                    }
                }
            ],
            dataSource: this.state.searchedPoetryList,
            loading: this.state.searchedLoading,
            rowKey: "_id",
            pagination: {
                pageSize: 5,
            },
            bordered: true,
        }
    }

    handleClickPlus = (poetry_id) => {
        this.props.ajaxFunction(poetry_id).then(ret => {
            if (ret && ret.code === 1) {
                this.props.refreshFunction();
            } else {
                message.error(ret.message);
            }
            this.hideModal();
        }).catch(error => {
            message.error(error);
        })
    }


    handleSearch = () => {
        const { searchText } = this.state;
        if (searchText.trim() !== "")
            this.fetchPoetryByTitle(searchText);
    }


    getInputProps = () => {
        const handleInputChange = (e) => {
            const value = e.target.value;
            this.setState({
                searchText: value,
            })
        }
        const handlePressEnter = () => {
            this.handleSearch();
        }
        return {
            autoComplete: "off",
            className: "ipt-search-title",
            onChange: handleInputChange,
            onPressEnter: handlePressEnter,
            value: this.state.searchText,
            placeholder: "请输入诗词题目",
        }
    }


    getButtonProps = () => {
        const handleClickSearch = () => {
            this.handleSearch();
        }
        return {
            className: "btn-search",
            onClick: handleClickSearch,
            type: "primary"
        }
    }
    render() {
        return <Modal {...this.getModalProps()}>
            <div className="modal-search-line">
                <Input  {...this.getInputProps()} />
                <Button {...this.getButtonProps()}>搜索</Button>
            </div>
            <Table {...this.getSearchedTableProps()} />
        </Modal>
    }
}




SeachPoetryModal.propTypes = {
    // mode: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    ajaxFunction: PropTypes.func.isRequired,
    refreshFunction: PropTypes.func.isRequired,
}

export default SeachPoetryModal;