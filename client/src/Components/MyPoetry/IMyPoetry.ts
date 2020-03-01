export interface IMyPoetry {
    data: IData;
}

interface IData {
    _id: String;
    title: String;
    name: String;
    writer: String;
    dynasty?: String;
    content: String;
    type: String[];

    remark?: String;
    translation?: String;
    audioUrl?: String;
    appreciation?: String;
}



