import axios, { POST } from "./axios"

export const getPoetryList = (current, pageSize, value) => {
    const url = "/poetrySearch/getPoetries";
    return axios(url, { current, pageSize, value }, POST);
}

export const likePoetry = (poetry_id) => {
    const url = '/poetrySearch/like';
    return axios(url, { poetry_id }, POST);
}

export const dislikePoetry = (poetry_id) => {
    const url = '/poetrySearch/dislike';
    return axios(url, { poetry_id }, POST);
}