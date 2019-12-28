import axios, {  POST } from "./axios"

export const profile = () => {
    const url = "/profile";
    return axios(url, {}, POST);
}

