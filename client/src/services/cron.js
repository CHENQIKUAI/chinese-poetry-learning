import axios, { POST } from "./axios"

export function getCron() {
    const url = "/poetryLearningSet/getCron";
    return axios(url, {}, POST);
}

export function getPoetryMsg(created_poetry_list_id) {
    const url = '/poetryLearningSet/getPoetryMsg'
    return axios(url, { created_poetry_list_id }, POST);
}

export function getNotify() {
    const url = '/poetryLearningSet/getNotify';
    return axios(url, {}, POST);
}