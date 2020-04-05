import React, { Component } from "react";
import { Card, Table, Popconfirm, message, Button, Form, Input, Icon } from "antd";
import { pageSizeOptions, NAME_TITLE, NAME, HEADIMAGEURL_TITLE, HEADIMAGEURL, SIMPLEINTRO_TITLE, SIMPLEINTRO, DETAILINTRO_TITLE, DETAILINTRO, OPERATION_TITLE } from "./const";
import { getWriters, deleteWriter, modifyWriter, createWriter } from "../../services/WriterService";
import Highlighter from 'react-highlight-words';
import MyModal from "../../Components/MyModal/MyModal";
import TextArea from "antd/lib/input/TextArea";
import "./WriterManagement.less"

class AuthorManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            writers: null,
            loading: true,
            current: 1,
            pageSize: parseInt(pageSizeOptions[0]),
            total: 0,
            modalVisible: false,
            modalMode: 0,
            searchText: "",
        }
    }


    fetchWriterList = (current, pageSize, { name } = { name: "" }) => {

        this.setState({
            loading: true,
        }, () => {
            getWriters(current, pageSize, { name }).then((ret) => {
                if (ret && ret.code === 1) {
                    const writerList = ret.result;
                    const { current, total } = ret;
                    this.setState({
                        current,
                        total,
                        writers: writerList,
                        loading: false,
                    })
                } else {

                }
            })
        })
    }

    componentDidMount() {
        this.fetchWriterList(this.state.current, this.state.pageSize);
    }

    getCardTitle = () => {
        return <div className="card-title">作者管理</div>
    }

    showMyModal = (mode) => {
        this.setState({
            modalMode: mode
        }, () => {
            this.setMyModalVisible(true);
        })
    }

    handleClickAddWriter = () => {
        this.showMyModal(2);
    }

    getCardExtra = () => {
        return <Button icon="plus" onClick={this.handleClickAddWriter}>添加</Button>
    }

    getCardProps = () => {
        return {
            title: this.getCardTitle(),
            extra: this.getCardExtra(),
        }
    }


    handleSearch = (selectedKeys, confirm, dataIndex) => {
        // confirm();
        this.setState({
            searchText: selectedKeys[0],
        }, () => {
            this.fetchWriterList(1, this.state.pageSize, { name: selectedKeys[0] });
        });

    }

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
        this.fetchWriterList(1, this.state.pageSize, { name: "" });
    };

    getTitleByDataIndex = (dataIndex) => {
        const arr = this.getTableColumns();
        let title;
        arr.forEach((item) => {
            if (item.dataIndex === dataIndex) {
                title = item.title;
            }
        })
        return title;
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`搜索${this.getTitleByDataIndex(dataIndex)}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 90, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, display:"block"}}
                >
                    搜索
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />

    });


    getTableColumns = () => {

        return [
            {
                title: NAME_TITLE,
                dataIndex: NAME,
                ...this.getColumnSearchProps(NAME),
                width: '10%',
                align: "center",
            },
            {
                title: "头像",
                dataIndex: HEADIMAGEURL,
                render: (text, record) => {
                    const name = record.name;
                    // return <a href={text} target="_blank">{text}</a>
                    return <img src={text} alt={name} style={{ width: "105px" }} />
                },
                width: "1%",
                align: "center",
            },
            {
                title: SIMPLEINTRO_TITLE,
                dataIndex: SIMPLEINTRO,
                width: "70%",
                align: "center",
            },
            // {
            //     title: DETAILINTRO_TITLE,
            //     dataIndex: DETAILINTRO,
            // },
            {
                title: OPERATION_TITLE,
                render: (record) => {
                    return <>
                        <div className="operate-edit" onClick={this.handleClickEditWriter.bind(this, record)}>编辑更多</div>
                        <Popconfirm title="确定要删除此作者嘛" onConfirm={this.handleDeleteWriter.bind(this, record)}>
                            <div className="operate-delete">删除作者</div>
                        </Popconfirm>
                    </>
                },
                width: "10%",
                align: "center",
            },
        ]
    }

    handleClickEditWriter = (record) => {
        const { _id, name, simpleIntro, detailIntro, headImageUrl } = record;

        this.showMyModal(1);
        this.props.form.setFieldsValue({ _id, name, simpleIntro, detailIntro, headImageUrl });
    }

    handleCalcShowingPage = (current, pageSize, total_after_operate) => {

        if (total_after_operate <= (current - 1) * pageSize) {
            return current === 1 ? 1 : current - 1;
        } else {
            return current;
        }
    }



    handleDeleteWriter = (record) => {
        const { _id } = record;
        deleteWriter(_id).then((ret) => {
            if (ret && ret.code === 1) {
                message.success("删除成功!");
                const { current, pageSize, total } = this.state;
                const showingPage = this.handleCalcShowingPage(current, pageSize, total - 1);
                this.fetchWriterList(showingPage, pageSize, { name: this.state.searchText });
            } else {
                console.error(ret);
                message.error("删除失败!");
            }
        }).catch((err) => {
            console.error(err);
            message.error("删除失败!")
        })
    }

    getTableDataSource = () => {
        return this.state.writers;
    }

    getTableLoading = () => {
        return this.state.loading;
    }

    getPaginationCurrent = () => {
        return this.state.current;
    }

    handlePaginationChange = (page, pageSize) => {
        this.setState({
            current: page,
            pageSize,
        }, () => {
            this.fetchWriterList(page, pageSize, { name: this.state.searchText });
        })
    }

    getPaginationPageSize = () => {
        return this.state.pageSize;
    }

    getPaginationPageSizeOptions = () => {
        return pageSizeOptions;
    }

    getPaginationTotal = () => {
        return this.state.total
    }

    handlePaginationSizeChange = (current, size) => {
        this.setState({
            current,
            pageSize: size,
        }, () => {
            this.fetchWriterList(current, size, { name: this.state.searchText });
        })
    }
    getTablePagination = () => {
        return {
            current: this.getPaginationCurrent(),
            pageSize: this.getPaginationPageSize(),
            total: this.getPaginationTotal(),
            onChange: this.handlePaginationChange,
            onShowSizeChange: this.handlePaginationSizeChange,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: this.getPaginationPageSizeOptions(),
        }
    }

    getTableProps = () => {
        return {
            columns: this.getTableColumns(),
            dataSource: this.getTableDataSource(),
            rowKey: "_id",
            bordered: true,
            loading: this.getTableLoading(),
            pagination: this.getTablePagination(),
        }
    }

    getMyModalFieldsConfig = () => {
        return [
            {
                label: "ID",
                id: "_id",
                formControl: <Input autoComplete="off" />,
                hide: true,
            },
            {
                label: "名字",
                id: "name",
                formControl: <Input autoComplete="off" />,
                labelCol: { span: 4 },
                wrapperCol: { span: 4 },
                rules: [
                    {
                        required: true,
                        message: "请输入名字",
                    }
                ]
            },
            {
                label: "头像地址",
                id: "headImageUrl",
                formControl: <Input autoComplete="off" />,
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            {
                label: "简介",
                id: "simpleIntro",
                formControl: <TextArea rows={6} autoComplete="off" />,
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            {
                label: "详细介绍",
                id: "detailIntro",
                formControl: <TextArea rows={6} autoComplete="off" />,
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
        ]
    }

    getMyModalVisible = () => {
        return this.state.modalVisible;
    }

    getMyModalForm = () => {
        return this.props.form;
    }

    setMyModalVisible = (visible) => {
        this.setState({
            modalVisible: visible,
        })

    }

    handleHideMyModal = () => {
        this.setMyModalVisible(false);
    }

    saveFunc = (mode) => {
        if (mode === 1) { //编辑
            return modifyWriter;
        } else if (mode === 2) {//增加
            return createWriter;
        }
    }

    getModalMode = () => {
        return this.state.modalMode;
    }

    modalOnOkCallback = () => {
        const { current, pageSize } = this.state;
        this.fetchWriterList(current, pageSize, { name: this.state.searchText });
    }

    getMyModalProps = () => {
        return {
            fieldsConfig: this.getMyModalFieldsConfig(),
            visible: this.getMyModalVisible(),
            form: this.getMyModalForm(),
            handleHide: this.handleHideMyModal,
            saveFunc: this.saveFunc,
            mode: this.getModalMode(),
            callback: this.modalOnOkCallback
        }
    }

    render() {
        return (
            <div>
                <Card {...this.getCardProps()}>
                    <Table {...this.getTableProps()} />
                </Card>
                <MyModal {...this.getMyModalProps()} />
            </div>
        )
    }

}


export default Form.create({ name: "my-modal" })(AuthorManagement)