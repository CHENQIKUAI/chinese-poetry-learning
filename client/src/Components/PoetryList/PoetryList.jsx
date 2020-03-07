import React, { Component } from "react"
import { Table, Card, Button, message, Modal, Input, Form, Tag, Tooltip, Icon } from "antd"
import { pageSizeOptions, TITLE_TITLE, TITLE, DYNASTY_TITLE, DYNASTY, WRITER_TITLE, WRITER, TYPE_TITLE, TYPE, OPERATION_TITLE, CREATE_MODE, EDIT_MODE } from "./const";
import { getPoetryList, deletePoetry, createPoetry, editPoetry } from "../../services/PoetryService";
import "./PoetryList.less"
import TypeList from "../TypeList/TypeList";
import Highlighter from 'react-highlight-words';
import DeleteConfirm from "../DeleteConfirm/DeleteConfirm";


const TextArea = Input.TextArea;
const FormItem = Form.Item;

class PoetryList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            poetryList: [],
            current: 1,
            pageSize: 10,
            total: 0,
            poetryModalVisible: false,
            modalMode: 0,
            loading: true,

            [TITLE]: "",
            [WRITER]: "",
            [DYNASTY]: "",
            [TYPE]: [],
            searchedColumn: "",
        }
    }

    fetchPoetryList = (current, pageSize, { title, writer, dynasty, type } = {}) => {
        this.setState({
            loading: true,
        }, () => {
            getPoetryList(current, pageSize, { title, writer, dynasty, type }).then((ret) => {
                const { result: list, total, current } = ret;
                this.setState({
                    poetryList: list,
                    total,
                    current,
                    loading: false,
                })
            })
        })
    }

    componentDidMount() {
        const current = this.state.current;
        const pageSize = this.state.pageSize;
        this.fetchPoetryList(current, pageSize);
    }

    getDataSource = () => {
        return this.state.poetryList;
    }

    getColumns = () => {
        return [
            {
                title: TITLE_TITLE,
                dataIndex: TITLE,
                width: 10,
                align: "center",
                ...this.getColumnSearchProps(TITLE)
            },
            {
                title: WRITER_TITLE,
                dataIndex: WRITER,
                width: 5,
                align: "center",
            },
            {
                title: DYNASTY_TITLE,
                dataIndex: DYNASTY,
                width: 5,
                align: "center",
            },
            // {
            //     title: CONTENT_TITLE,
            //     dataIndex: CONTENT,
            //     width: 2,
            // align: "center",
            // },
            {
                title: TYPE_TITLE,
                dataIndex: TYPE,
                width: 20,
                align: "center",
                render: (text, record) => {
                    const tags = text;
                    return (
                        tags && tags.map((tag, index) => {
                            const isLongTag = tag.length > 20;
                            const tagElem = (
                                <Tag key={tag}>
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
                        })
                    )
                }
            },
            // {
            //     title: REMARK_TITLE,
            //     dataIndex: REMARK,
            // align: "center",
            // },
            // {
            //     title: TRANSLATION_TITLE,
            //     dataIndex: TRANSLATION,
            // align: "center",
            // },
            // {
            //     title: APPRECIATION_TITLE,
            // align: "center",
            //     dataIndex: APPRECIATION,
            // }
            {
                title: OPERATION_TITLE,
                align: "center",
                render: (record, text) => {
                    const title = record.title;
                    const _id = record._id;
                    return (
                        <div>
                            <span onClick={this.handleClickEdit.bind(this, record)} className="poetry_edit_more">编辑更多</span>
                            <DeleteConfirm confirmMsg={title} deleteFunc={() => {
                                return deletePoetry(_id)
                            }}
                                deleteCallback={() => {
                                    const { current, pageSize, total } = this.state;
                                    let num = total - 1;
                                    let page = current;
                                    if (num <= (current - 1) * pageSize) {
                                        page = current - 1;
                                    }
                                    const filterObj = this.getPoetryFilterObj();
                                    this.fetchPoetryList(page, pageSize, filterObj);
                                }}
                            >
                                <span className="poetry_delete">删除</span>
                            </DeleteConfirm>
                        </div>
                    )
                },
                width: 10
            }
        ];
    }


    getColumnSearchProps = dataIndex => ({
        // 自定义筛选菜单
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                {
                    dataIndex === "type" ?
                        "一个type组件" :
                        <Input
                            autoComplete="off"
                            ref={node => {
                                this.searchInput = node;
                            }}
                            placeholder={`Search ${dataIndex}`}
                            value={selectedKeys[0]}
                            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                            onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                            style={{ width: 188, marginBottom: 8, display: 'block' }}
                        />
                }
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
            </Button>
            </div>
        ),
        // 筛选icon
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        // 自定义筛选菜单 可见变化 时 调用
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        // 渲染该项的列
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state[dataIndex]]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                    text
                ),
    });


    getPoetryFilterObj = () => {
        let obj = {};

        const columns = [
            {
                dataIndex: TITLE,
            },
            {
                dataIndex: WRITER,
            },
            {
                dataIndex: DYNASTY,
            },
            {
                dataIndex: TYPE,
            }
        ]

        columns.map((item) => {
            obj = {
                ...obj,
                [item.dataIndex]: this.state[item.dataIndex],
            }
        });
        return obj;
    }

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        this.setState({
            [dataIndex]: selectedKeys[0],
            searchedColumn: dataIndex,
        }, () => {
            const filterObj = this.getPoetryFilterObj();
            this.fetchPoetryList(1, this.state.pageSize, filterObj);
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        const { searchedColumn } = this.state;
        if (searchedColumn === TYPE) {
            this.setState({ [searchedColumn]: [] });
        } else {
            this.setState({
                [searchedColumn]: '',
            }, () => {
                console.log(searchedColumn, this.state.searchedColumn, this.state.title);
            })
        }
        this.fetchPoetryList(this.state.current, this.state.pageSize, {});
    };

    handleDeletePoetry = (_id) => {
        deletePoetry(_id).then((ret) => {
            const { current, pageSize, total } = this.state;
            let num;
            // 计算现在剩下了多少数目的诗词num
            if (ret && ret.total) {
                num = ret.total;
            } else {
                num = total - 1;
            }

            let page = current;

            if (num <= (current - 1) * pageSize) {
                page = current - 1;
            }
            const filterObj = this.getPoetryFilterObj();
            this.fetchPoetryList(page, pageSize, filterObj);
        }).catch((e) => {
            message.error("删除错误！")
        })
    }


    getPageTotal = () => {
        const { total, } = this.state;
        return total;
    }

    handlePageChange = (page, pageSize) => {
        const filterObj = this.getPoetryFilterObj();
        this.fetchPoetryList(page, pageSize, filterObj);
    }

    handleSizeChange = (current, size) => {
        const filterObj = this.getPoetryFilterObj();
        this.fetchPoetryList(current, size, filterObj)
    }


    getPagination = () => {

        return {
            current: this.state.current,
            showSizeChanger: true,
            total: this.getPageTotal(),
            pageSizeOptions: pageSizeOptions,
            onChange: this.handlePageChange,
            onShowSizeChange: this.handleSizeChange,
            showQuickJumper: true,
        }
    }

    getTableLoading = () => {
        return this.state.loading;
    }

    getTableProps = () => {
        return {
            dataSource: this.getDataSource(),
            columns: this.getColumns(),
            rowKey: "_id",
            pagination: this.getPagination(),
            bordered: true,
            loading: this.getTableLoading(),
        }
    }

    getCardTitle = () => {
        return <div className="card-title">诗词管理</div>
    }

    getCardExtra = () => {
        return <Button icon="plus" onClick={this.handleClickCreate}>添加</Button>
    }


    getCardProps = () => {
        return {
            title: this.getCardTitle(),
            extra: this.getCardExtra(),
        }
    }


    handleClickCreate = () => {
        this.setModalMode(CREATE_MODE)
        this.showModal();
        this.setModalContentField({ type: [] });
    }

    handleClickEdit = (item) => {
        this.setModalMode(EDIT_MODE)
        this.showModal();
        this.setModalContentField(item);
    }

    setModalContentField = (poetry) => {
        const { _id, type, title, dynasty, writer, content, remark, translation, appreciation } = poetry;
        this.props.form.setFieldsValue({
            _id,
            title,
            dynasty,
            writer,
            content,
            remark,
            translation,
            appreciation,
            type
        })
    }

    setModalMode = (mode) => {
        this.setState({
            modalMode: mode,
        })
    }

    showModal = () => {
        this.setState({
            poetryModalVisible: true,
        })
    }

    hideModal = () => {
        this.setState({
            poetryModalVisible: false,
            editData: null, //清除数据
        })
    }

    handleModalOk = () => {
        const poetry = this.props.form.getFieldsValue();
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                if (this.state.modalMode === CREATE_MODE) {
                    this.handleSaveNewPoetry(poetry);
                } else if (this.state.modalMode === EDIT_MODE) {
                    this.handleSaveModifiedPoetry(poetry);
                }
                this.hideModal();
            }
        })


    }

    handleRefreshPage = () => {
        const filterObj = this.getPoetryFilterObj();
        this.fetchPoetryList(this.state.current, this.state.pageSize, filterObj);
    }

    //保存修改过的诗词
    handleSaveModifiedPoetry = (poetry) => {
        editPoetry(poetry).then((result) => {
            if (result && result.code === 1) {
                message.success("保存成功");
                this.handleRefreshPage();
            } else {
                message.error("保存失败");
                console.log("saved error:", result)
            }
        }).catch((err) => {
            message.error("保存失败");
            console.log("saved error:", err)
        })
    }

    //保存新建的诗词
    handleSaveNewPoetry = (poetry) => {
        createPoetry(poetry).then((result) => {
            if (result && result.code === 1) {
                message.success("保存成功, 请到最后一页查看");
                this.handleRefreshPage();
            } else {
                message.error("保存失败");
                console.log("saved error:", result);
            }
        }).catch((err) => {
            message.error("保存失败");
            console.log("saved error:", err)
        })
    }

    handleModalCancel = () => {
        this.hideModal();
    }


    getModalContent = () => {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form layout="horizontal" >
                <FormItem label="" style={{ display: "none" }} >
                    {getFieldDecorator("_id")(
                        <Input
                            autoComplete="off"
                        />
                    )}
                </FormItem>
                <FormItem label="标题" labelCol={{ span: 2 }} wrapperCol={{ span: 10 }}>
                    {getFieldDecorator("title", {
                        rules: [
                            {
                                required: true,
                                message: "请输入标题",
                            }
                        ],
                    })(
                        <Input
                            autoComplete="off"
                        />
                    )}
                </FormItem>
                <FormItem label="作者" labelCol={{ span: 2 }} wrapperCol={{ span: 3 }}>
                    {getFieldDecorator("writer", {
                        rules: [
                            {
                                required: true,
                                message: "请输入作者名字",
                            }
                        ]
                    })(
                        <Input
                            autoComplete="off"
                        />
                    )}
                </FormItem>
                <FormItem label="朝代" labelCol={{ span: 2 }} wrapperCol={{ span: 3 }}>
                    {getFieldDecorator("dynasty", {
                        rules: [
                            {
                                required: false,
                                message: "请输入朝代",
                            }
                        ]
                    })(
                        <Input
                            autoComplete="off"
                        />
                    )}
                </FormItem>
                <FormItem label="类型" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    {getFieldDecorator("type", {})(
                        <TypeList />
                    )}
                </FormItem>
                <FormItem label="内容" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    {getFieldDecorator("content", {
                        rules: [
                            {
                                required: true,
                                message: "请输入内容",
                            }
                        ]
                    })(
                        <TextArea rows={4} />
                    )}
                </FormItem>
                <FormItem label="注释" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    {getFieldDecorator("remark", {
                        rules: [
                            {
                                required: false,
                                message: "请输入注释",
                            }
                        ]
                    })(
                        <TextArea rows={4} />
                    )}
                </FormItem >
                <FormItem label="翻译" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    {getFieldDecorator("translation", {
                        rules: [
                            {
                                required: false,
                                message: "请输入翻译",
                            }
                        ]
                    })(
                        <TextArea rows={4} />
                    )}
                </FormItem >
                <FormItem label="赏析" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                    {getFieldDecorator("appreciation", {
                        rules: [
                            {
                                required: false,
                                message: "请输入标题",
                            }
                        ]
                    })(
                        <TextArea rows={4} />
                    )}
                </FormItem >
            </Form>
        )
    }


    render() {
        return (
            <>
                <Card {...this.getCardProps()}>
                    <Table {...this.getTableProps()} />
                </Card>

                <Modal
                    title={this.getTitle()}
                    visible={this.getModalVisible()}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    width={900}
                    okText="保存"
                    className="modal-poetry-list"
                >
                    {this.getModalContent()}
                </Modal>
            </>
        )
    }

    getTitle = () => {
        let text;
        if (this.state.modalMode === CREATE_MODE) {
            text = "添加诗词"
        } else {
            text = "编辑诗词"
        }
        return <div className="modal-poetry-title">{text}</div>;
    }

    getModalVisible = () => {
        return this.state.poetryModalVisible;
    }

    getEditData = () => {
        return this.state.editData;
    }

}

export default Form.create({ name: "PoetryList" })(PoetryList);