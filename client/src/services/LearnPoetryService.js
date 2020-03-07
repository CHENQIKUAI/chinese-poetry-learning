import axios, { POST } from "./axios"

export default {
    getPoetry: (id) => {
        const url = "/poetryLearning/getPoetry";
        return axios(url, { id }, POST);
    },
    getWriter: (writer) => {
        const url = '/poetryLearning/getWriter';
        return axios(url, { writer }, POST)
    }
} 
