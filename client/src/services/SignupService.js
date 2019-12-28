import axios, { POST } from "./axios"

export const signup = (username, password) => {
    const url = "/signup";
    return axios(url, { username, password }, POST);
}

