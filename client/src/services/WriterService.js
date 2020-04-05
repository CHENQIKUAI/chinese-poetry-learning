import axios, { POST } from "./axios"

export const getWriters = (current, pageSize, filterObj) => {
    const url = "/writerManagement/getWriters";
    return axios(url, { current, pageSize, filterObj }, POST);
}


export const createWriter = (writer) => {
    const url = '/writerManagement/createWriter'
    return axios(url, { writer }, POST)
}


export const deleteWriter = (_id) => {
    const url = '/writerManagement/deleteWriter';
    return axios(url, { _id }, POST)
}

export const modifyWriter = (writer) => {
    const url = '/writerManagement/modifyWriter';
    return axios(url, { writer }, POST);
}