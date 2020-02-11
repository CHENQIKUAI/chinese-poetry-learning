import axios, { POST } from "./axios"

export const addPoetry = (poetry_id, grade_semester) => {
    const url = "/mustLearn/add";
    return axios(url, { poetry_id, grade_semester }, POST);
}

export const removePoetry = (must_learn_poetry_id) => {
    const url = "/mustLearn/remove";
    return axios(url, { must_learn_poetry_id }, POST);
}

export const getMustLearnPoetryList = (grade_semester) => {
    const url = "/mustLearn/getMustLearnPoetryList";
    return axios(url, { grade_semester }, POST);
}

export const getGradeSemester = () => {
    const url = "/mustLearn/getGradeSemester";
    return axios(url, {}, POST);
}


export const getPoetryByTitle = (searchText)=>{
    const url = "/mustLearn/findByTitle";
    return axios(url, {searchText}, POST);
}
