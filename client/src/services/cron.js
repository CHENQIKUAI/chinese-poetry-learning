import axios, { POST, GET, PUT } from "./axios"

export function getCron() {
    const url = "/cron/getCron";
    return axios(url, {}, GET);
}

export function updateCron(created_poetry_list_id, cron) {
    const url = "/cron/updateCron";
    return axios(url, { created_poetry_list_id, cron }, PUT);
}

export function getPoetryMsg(created_poetry_list_id) {
    const url = '/cron/getPoetryMsg'
    return axios(url, { created_poetry_list_id }, GET);
}


