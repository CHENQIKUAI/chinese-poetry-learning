import axios, { POST } from "./axios"

export default {
    getPoetry: (id) => {
        const url = "/learningCenter/getPoetry";
        return axios(url, { id }, POST);
    },
    getWriter: (writer) => {
        const url = '/learningCenter/getWriter';
        return axios(url, { writer }, POST)
    },
    compute: (fstStr, secStr) => {
        const url = '/learningCenter/compute';
        return axios(url, { fstStr, secStr }, POST)
    }
} 
