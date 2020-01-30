const TOKEN = "token";
const TYPE = "type";



export const setToken = (token) => {
    localStorage.setItem(TOKEN, token);
}

export const getToken = () => {
    return localStorage.getItem(TOKEN);
}

export const clearToken = () => {
    localStorage.removeItem(TOKEN);
}




export const setType = (type) => {
    localStorage.setItem(TYPE, type);
}

export const getType = () => {
    return localStorage.getItem(TYPE);
}

export const clearType = () => {
    localStorage.removeItem(TYPE);
}