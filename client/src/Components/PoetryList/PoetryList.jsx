import React, { Component } from "react"
import { Table, Card, Button, Popconfirm, message, Modal, Input, Form, Tag, Tooltip } from "antd"
import { pageSizeOptions, TITLE_TITLE, TITLE, DYNASTY_TITLE, DYNASTY, WRITER_TITLE, WRITER, CONTENT_TITLE, CONTENT, TYPE_TITLE, TYPE, REMARK_TITLE, REMARK, TRANSLATION_TITLE, TRANSLATION, APPRECIATION_TITLE, APPRECIATION, OPERATION_TITLE, CREATE_MODE, EDIT_MODE } from "./const";
import { getPoetryList, deletePoetry, createPoetry, editPoetry } from "../../services/PoetryService";
import "./PoetryList.less"
import { POETRY_MANAGEMENT } from "../Menu/menuConstants";
import PoetryModal from "../PoetryModal/PoetryModal"
import TypeList from "../TypeList/TypeList";

const TextArea = Input.TextArea;
const FormItem = Form.Item;

class PoetryList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            poetryList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            poetryModalVisible: false,
            modalMode: 0,
            loading: true,
        }
    }


    fetchPoetryList = (currentPage, pageSize) => {
        this.setState({
            loading: true,
        }, () => {
            getPoetryList(currentPage, pageSize).then((ret) => {
                const { result: list, total, currentPage, pageSize } = ret;

                this.setState({
                    poetryList: list,
                    total,
                    currentPage,
                    pageSize,
                    loading: false,
                })
            })
        })
    }

    componentDidMount() {
        const currentPage = this.state.currentPage;
        const pageSize = this.state.pageSize;
        this.fetchPoetryList(currentPage, pageSize);
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
            },
            {
                title: WRITER_TITLE,
                dataIndex: WRITER,
                width: 5,
            },
            // {
            //     title: DYNASTY_TITLE,
            //     dataIndex: DYNASTY,
            //     width: 5,
            // },

            // {
            //     title: CONTENT_TITLE,
            //     dataIndex: CONTENT,
            //     width: 2,
            // },
            {
                title: TYPE_TITLE,
                dataIndex: TYPE,
                width: 20,
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
            // },
            // {
            //     title: TRANSLATION_TITLE,
            //     dataIndex: TRANSLATION,
            // },
            // {
            //     title: APPRECIATION_TITLE,
            //     dataIndex: APPRECIATION,
            // }
            {
                title: OPERATION_TITLE,
                render: (record, text) => {
                    return (
                        <div>
                            <span onClick={this.handleClickEdit.bind(this, record)} className="poetry_edit_more">编辑更多</span>
                            <Popconfirm
                                title="确定要删除本诗词吗？"
                                onConfirm={this.handleDeletePoetry.bind(this, text)}
                                okText="是"
                                cancelText="否"
                            >
                                <span onClick={this.handleClickDelete} className="poetry_delete">删除</span>
                            </Popconfirm>
                        </div>
                    )
                },
                width: 10
            }
        ];
    }



    handleDeletePoetry = (text) => {
        const _id = text._id;
        deletePoetry(_id).then((ret) => {
            const { currentPage, pageSize, total } = this.state;
            let num;
            // 计算现在剩下了多少数目的诗词num
            if (ret && ret.total) {
                num = ret.total;
            } else {
                num = total - 1;
            }

            let page = currentPage;

            if (num <= (currentPage - 1) * pageSize) {
                page = currentPage - 1;
            }

            this.fetchPoetryList(page, pageSize);
        }).catch((e) => {
            message.error("删除错误！")
        })
    }


    getPageTotal = () => {
        const { total, } = this.state;
        return total;
    }

    handlePageChange = (page, pageSize) => {
        this.fetchPoetryList(page, pageSize);
    }

    handleSizeChange = (current, size) => {
        this.fetchPoetryList(current, size)
    }


    getPagination = () => {

        return {
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
        this.fetchPoetryList(this.state.currentPage, this.state.pageSize);
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
                        <Input />
                    )}
                </FormItem>
                <FormItem label="题目" labelCol={{ span: 2 }} wrapperCol={{ span: 10 }}>
                    {getFieldDecorator("title", {
                        rules: [
                            {
                                required: true,
                                message: "请输入题目",
                            }
                        ],
                    })(
                        <Input />
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
                        <Input />
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
                        <Input />
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