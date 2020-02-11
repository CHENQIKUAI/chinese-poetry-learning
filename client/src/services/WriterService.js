import axios, { POST } from "./axios"

export const getWriters = (current, pageSize, filterObj) => {
    const url = "/writer/getWriters";
    return axios(url, { current, pageSize, filterObj }, POST);
}


export const createWriter = (writer) => {
    const url = '/writer/createWriter'
    return axios(url, { writer }, POST)
}


export const deleteWriter = (_id) => {
    const url = '/writer/deleteWriter';
    return axios(url, { _id }, POST)
}

export const modifyWriter = (writer) => {
    const url = '/writer/modifyWriter';
    return axios(url, { writer }, POST);
}