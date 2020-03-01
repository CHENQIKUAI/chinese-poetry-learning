import axios, { POST } from "./axios"

const PersonalSettingService = {
    updateUsername: (username) => {
        const url = "/personalSetting/updateUsername";
        return axios(url, { username }, POST);
    },
    checkCurPwd: (password) => {
        const url = "/personalSetting/checkCurPwd";
        return axios(url, { password }, POST);
    },
    updatePwd: (password) => {
        const url = "/personalSetting/updatePwd";
        return axios(url, { password }, POST);
    },
    updateGrade: (grade) => {
        const url = "/personalSetting/updateGrade";
        return axios(url, { grade }, POST);
    },
    fetchGrade: () => {
        const url = '/personalSetting/fetchGrade';
        return axios(url, {}, POST)
    },
    fetchUsername: () => {
        const url = '/personalSetting/fetchUsername';
        return axios(url, {}, POST)
    }
}

export default PersonalSettingService;