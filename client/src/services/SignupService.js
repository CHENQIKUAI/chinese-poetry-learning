import axios, { POST } from "./axios"

export const signup = (username, password, grade) => {
    const url = "/signup";
    return axios(url, { username, password, grade }, POST);
}

export const checkUsername = (username) => {
    const url = '/signup/checkUsername';
    return axios(url, { username }, POST);
}