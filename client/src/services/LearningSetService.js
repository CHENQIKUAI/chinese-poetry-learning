import axios, { POST } from "./axios"

export const getSets = () => {
    const url = "/poetryLearningSet/getLearningSets";
    return axios(url, {}, POST);
}

export const getSpeificSet = (created_poetry_list_id) => {
    const url = "/poetryLearningSet/getSetPoetryList";
    return axios(url, { created_poetry_list_id }, POST);
}

// 学习集相关
export const updateSetName = (created_poetry_list_id, title) => {
    const url = "/poetryLearningSet/updateSetName";
    return axios(url, { created_poetry_list_id, title }, POST);
}

export const deleteSet = (created_poetry_list_id) => {
    const url = "/poetryLearningSet/deleteSet";
    return axios(url, { created_poetry_list_id }, POST);
}

export const createSet = (title) => {
    const url = "/poetryLearningSet/createSet";
    return axios(url, { title }, POST);
}

// 学习集中的诗词相关
export const poetryCheckIn = (created_poetry_list_id, poetry_id) => {
    const url = "/poetryLearningSet/poetryCheckIn";
    return axios(url, { created_poetry_list_id, poetry_id }, POST);
}

export const addNewPoetry = (created_poetry_list_id, poetry_id) => {
    const url = "/poetryLearningSet/addNewPoetry";
    return axios(url, { created_poetry_list_id, poetry_id }, POST);
}

export const deletePoetryFromCollection = (created_poetry_list_id, poetry_id) => {
    const url = "/poetryLearningSet/deletePoetryFromCollection";
    return axios(url, { created_poetry_list_id, poetry_id }, POST);
}