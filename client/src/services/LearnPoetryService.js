import axios, { POST } from "./axios"

export default {
    getPoetry: (id) => {
        const url = "/poetryLearning/getPoetry";
        return axios(url, { id }, POST);
    }
} 
