import axios, { POST } from "./axios"

export function getCron() {
    const url = "/cron/getCron";
    return axios(url, {}, POST);
}

export function updateCron(created_poetry_list_id, cron) {
    const url = "/cron/updateCron";
    return axios(url, { created_poetry_list_id, cron }, POST);
}

export function getPoetryMsg(created_poetry_list_id) {
    const url = '/cron/getPoetryMsg'
    return axios(url, { created_poetry_list_id }, POST);
}

export function getNotify() {
    const url = '/cron/getNotify';
    return axios(url, {}, POST);
}