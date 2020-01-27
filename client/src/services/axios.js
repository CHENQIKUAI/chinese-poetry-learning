import axios from "axios"
import { message } from "antd"
import { getToken } from "../utils/token"
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
        // 2. 如果成功了, 调用resolve(value)
        promise.then(response => {
            resolve(response.data)
            // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
        }).catch(error => {
            // reject(error)
            // resolve(response.data)
            console.log(error);
            message.error('请求出错了: ' + error)
        })
    })
}
export const POST = "POST";
export const GET = "GET";