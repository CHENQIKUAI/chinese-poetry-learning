import axios from "axios"
import { message } from "antd"
import { getToken } from "../utils/localStorageManagement"
import { baseURL } from "../config/config";
axios.defaults.baseURL = baseURL;

export default function ajax(url, data = {}, type = 'GET') {
    const token = getToken();

    return new Promise((resolve, reject) => {
        let promise
        // 1. 执行异步ajax请求
        if (type === 'GET') { // 发GET请求
            promise = axios.get(url, { // 配置对象
                params: data // 指定请求参数
            })
        } else { // 发POST请求
            // 把token放在请求参数中
            if (token) {
                data = { ...data, token };
            }
            promise = axios.post(url, data)
        }
        promise.then(response => {
            // 2. 如果成功了, 调用resolve(value),传递结果
            resolve(response.data)
        }).catch(error => {
            // 3. 如果失败了, 调用reject(reason)，发送原因
            reject(error);
        })
    })
}
export const POST = "POST";
export const GET = "GET";