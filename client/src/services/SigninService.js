import axios, { POST } from "./axios"

export const signin = (username, password) => {
    const url = "/signin";
    return axios(url, { username, password }, POST);
}