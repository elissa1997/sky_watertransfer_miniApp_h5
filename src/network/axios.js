import axios from 'axios';
import { checkTokenBeforeRequest, checkTokenAfterRequest } from "@/util/auth.js"


// 访问接口
export function instance_api(config) {
    let url = undefined;


    const instance = axios.create({
        timeout: 8000,
        headers: { 'Content-Type':'application/json'}
    })


    instance.interceptors.request.use(config => {
        config.params = {
            token: checkTokenBeforeRequest(),
            redirect: "no",
            ...config.params
        }
        return config
    },err => {
        console.log(err);
    })

    instance.interceptors.response.use(res => {
        return res.data
    },err => {
        checkTokenAfterRequest(err);
    })


    return instance(config)
}

// 访问静态资源
export function instance_static(config) {
    const instance = axios.create({
        baseURL: '/dist/',
        timeout: 8000,
        headers: {'Content-Type':'application/json'}
    })


    instance.interceptors.request.use(config => {
        return config
    },err => {
        console.log(err);
    })

    instance.interceptors.response.use(res => {
        return res.data
    },err => {
        console.log(err);
    })


    return instance(config)
}