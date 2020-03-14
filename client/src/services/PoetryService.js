import axios, { POST } from "./axios"


export const createPoetry = (poetry) => {
    const url = "/poetry/createPoetry";
    return axios(url, { poetry }, POST);
}


export const deletePoetry = (_id) => {
    const url = "/poetry/deletePoetry";
    return axios(url, { _id }, POST);
}


export const editPoetry = (poetry) => {
    const url = "/poetry/modifyPoetry";
    return axios(url, { poetry }, POST);
}


export const getPoetryList = (current, pageSize, filterObj) => {
    const url = "/poetry/getPoetries";
    return axios(url, { current, pageSize, filterObj }, POST);
}