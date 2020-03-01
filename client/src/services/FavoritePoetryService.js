import axios, { POST } from "./axios"

const FavoritePoetryService = {
    getPoetryList: (current, pageSize) => {
        const url = "/favoritePoetry/getPoetries";
        return axios(url, { current, pageSize }, POST);
    }
}


export default FavoritePoetryService;