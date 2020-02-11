import React, { Component } from "react";
import { Card, Cascader, Table, Button, Modal, Input, message, Icon, Popconfirm } from "antd"
import { getGradeSemester, getMustLearnPoetryList, getPoetryByTitle, addPoetry, removePoetry } from "../../services/PoetryMustLearnService";
import "./PoetryMustLearn.less"
class PoetryMustLearn extends Component {

    state = {
        gradeSemesterList: [], // 级联选择器的options
        gradeSemester: "0,0", // 年级＋学期的表示
        poetryList: [], //主页面下方的诗词列表的数据
        loading: true, // 加载中？
        modalVisible: false, //modal可视？
        searchText: "", // 搜索标题的字符
        searchedPoetryList: [],
        searchedLoading: false,
        gradeColRowSpan: [],
        semesterColRowSpan: [],
    }

    componentDidMount() {
        this.fetchGradeSemesterList();
        this.fetchMustLearnPoetryList("0,0");

    }

    fetchGradeSemesterList = () => {
        getGradeSemester().then((ret) => {
            if (ret && ret.code === 1) {
                this.setState({
                    gradeSemesterList: ret.result
                })
            }
        })
    }

    getCardTitle = () => {
        return <div className="card-title">必学篇目管理</div>
    }

    getCardProps = () => {
        return {
            title: this.getCardTitle(),
        }
    }

    getCascaderOptions = () => {
        return this.state.gradeSemesterList;
    }

    getCascaderPlaceholder = () => {
        return "请选择年级和学期"
    }

    setGradeSemester = (gradeSemester) => {
        this.setState({
            gradeSemester
        })
    }

    fetchMustLearnPoetryList = (gradeSemester) => {
        this.setState({
            loading: true,
        }, () => {
            getMustLearnPoetryList(gradeSemester).then((ret) => {
                if (ret && ret.code === 1) {
                    this.setState({
                        poetryList: ret.result,
                        loading: false,
                    }, () => {
                        const gradeColRowSpan = this.calcColRowSpan(this.state.poetryList, "grade");
                        const semesterColRowSpan = this.calcColRowSpan(this.state.poetryList, "semester");
                        console.log(gradeColRowSpan, semesterColRowSpan);

                        this.setState({
                            gradeColRowSpan,
                            semesterColRowSpan
                        })
                    })
                }
            });
        })
    }

    handleCascaderChange = (value) => {
        if (Array.isArray(value)) {
            let theValue;
            if (value.length === 3) {
                theValue = value[1] + "," + value[2];
            } else {
                theValue = "0,0";
            }
            this.setGradeSemester(theValue);
            this.fetchMustLearnPoetryList(theValue);
        }
    }

    getCascaderProps = () => {
        return {
            options: this.getCascaderOptions(),
            onChange: this.handleCascaderChange,
            placeholder: this.getCascaderPlaceholder(),
            className: "grade-semester-selector"
        }
    }

    calcColRowSpan = (dataList, dataIndex) => {
        const colRowSpanArr = [];
        const len = dataList.length

        if (len == 0) {
            return [];
        }

        let count = 0;
        for (let i = len - 1; i > 0; --i) {
            if (dataList[i][dataIndex] === dataList[i - 1][dataIndex]) {
                count++;
                colRowSpanArr[i] = {
                    colSpan: 0
                }
            } else {
                colRowSpanArr[i] = {
                    rowSpan: count + 1
                }
                count = 0;
            }
        }

        colRowSpanArr[0] = {
            rowSpan: count + 1
        }

        return colRowSpanArr
    }

    getColumns = () => {
        return [
            {
                title: "年级",
                dataIndex: "grade",
                align: "center",
                render: (value, row, index) => {
                    var gradeStr = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一", `初二`, "初三", `高一`, `高二`, `高三`];
                    const obj = {
                        children: gradeStr[value - 1],
                        props: this.state.gradeColRowSpan[index],
                    };
                    return obj;
                }
            },
            {
                title: "学期",
                dataIndex: "semester",
                align: "center",
                render: (value, row, index) => {
                    var semesterStr = ["上册", "下册"]
                    const obj = {
                        children: semesterStr[value - 1],
                        props: this.state.semesterColRowSpan[index],
                    };
                    return obj;
                }
            },
            {
                title: "诗词标题",
                dataIndex: "title",
                align: "center",
            },
            {
                title: "作者",
                dataIndex: "writer",
                align: "center",
            },
            {
                title: "操作",
                align: "center",
                render: (record) => {

                    const _id = record._id;
                    return <>
                        <Popconfirm title="确认要删除该必学篇目吗？" onConfirm={this.handleDeletePoetry.bind(this, _id)}>
                            <a>删除</a>
                        </Popconfirm>
                    </>

                }
            }
        ]
    }

    handleDeletePoetry = (_id) => {
        removePoetry(_id).then((ret) => {
            if (ret && ret.code === 1) {
                message.success("删除成功");
                this.fetchMustLearnPoetryList(this.state.gradeSemester);
            } else {
                message.error("删除失败");
                console.log(ret);
            }
        }).catch((error) => {
            message.error("删除失败");
            console.log(error);
        })
    }

    getDataSource = () => {
        return this.state.poetryList;
    }

    getTableProps = () => {
        return {
            columns: this.getColumns(),
            dataSource: this.getDataSource(),
            rowKey: "_id",
            loading: this.state.loading,
            bordered: true,
            pagination: false,
        }
    }

    setModalVisible = (visible) => {
        this.setState({
            modalVisible: visible,
        })
    }

    handleClickAdd = () => {
        this.setModalVisible(true);
    }

    handleInputChange = (e) => {
        const value = e.target.value;
        this.setState({
            searchText: value,
        })
    }


    handleModalOk = () => {
        this.setModalVisible(false);
    }

    handleModalCancel = () => {
        this.setModalVisible(false);
        this.setState({
            searchText: "",
            searchedPoetryList: [],
        })
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
                    console.log(ret);
                }
                this.setState({
                    searchedLoading: false,
                })
            }).catch((err) => {
                message.error("搜索错误!")
                console.log(err);
                this.setState({
                    searchedLoading: false,
                })
            })
        })

    }

    handlePressEnter = () => {
        const { searchText } = this.state;
        if (searchText.trim() !== "")
            this.fetchPoetryByTitle(searchText);
    }

    handleClickSearch = () => {
        const { searchText } = this.state;
        if (searchText.trim() !== "")
            this.fetchPoetryByTitle(searchText);
    }


    handleAddPoetryToMustLearn = (_id, gradeSemester) => {
        addPoetry(_id, gradeSemester).then((ret) => {
            if (ret && ret.code === 1) {
                message.success("添加成功");
                this.fetchMustLearnPoetryList(this.state.gradeSemester)
            }
        })
    }


    getSearchedTableProps = () => {

        return {
            columns: [
                {
                    dataIndex: "title",
                    title: "标题",
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
                        const { gradeSemester } = this.state;
                        return <Icon type="plus" onClick={this.handleAddPoetryToMustLearn.bind(this, _id, gradeSemester)} />
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


    render() {
        const showBtn = this.state.gradeSemester === "0,0" ? false : true;
        return (
            <div>
                <Card {...this.getCardProps()}>
                    <Cascader {...this.getCascaderProps()} />
                    {showBtn && <Button type="primary" className="btn-search" onClick={this.handleClickAdd}>添加诗词</Button>}
                    <Table {...this.getTableProps()} />
                </Card>
                <Modal
                    title={<div className="modal-title-center">添加诗词</div>}
                    visible={this.state.modalVisible}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    footer={null}
                    cancelButtonProps={{ style: { display: "none" } }}
                    width="800px"
                    className="modal-search-poetry"
                >
                    <div className="modal-search-line">
                        <Input className="ipt-search-title" onChange={this.handleInputChange} onPressEnter={this.handlePressEnter} value={this.state.searchText} placeholder="请输入诗词标题" />
                        <Button className="btn-search" onClick={this.handleClickSearch} type="primary">搜索</Button>
                    </div>
                    <Table {...this.getSearchedTableProps()} />
                </Modal>
            </div>
        )
    }

}

export default PoetryMustLearn;
