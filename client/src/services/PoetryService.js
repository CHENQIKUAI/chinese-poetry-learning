import axios, { POST } from "./axios"


export const createPoetry = (poetry) => {
    const url = "/poetryManagement/createPoetry";
    return axios(url, { poetry }, POST);
}


export const deletePoetry = (_id) => {
    const url = "/poetryManagement/deletePoetry";
    return axios(url, { _id }, POST);
}


export const editPoetry = (poetry) => {
    const url = "/poetryManagement/modifyPoetry";
    return axios(url, { poetry }, POST);
}


export const getPoetryList = (current, pageSize, filterObj) => {
    const url = "/poetryManagement/getPoetries";
    return axios(url, { current, pageSize, filterObj }, POST);
}