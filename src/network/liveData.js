import {instance_api} from "./axios.js";

// 获取实时数据
export function live(params) {
  return instance_api({
    url: process.env.VUE_APP_API+'/indexZBController.api',
    method: 'get',
    params
  })
}