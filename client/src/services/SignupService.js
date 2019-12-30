import axios, { POST } from "./axios"

export const signup = (username, password, grade, type) => {
    const url = "/signup";
    return axios(url, { username, password, grade, type }, POST);
}

