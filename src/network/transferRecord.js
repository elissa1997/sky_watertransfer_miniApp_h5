import {instance_api} from "./axios.js";

// 获取调水记录列表
export function transferRecordList(params) {
  return instance_api({
    url: process.env.VUE_APP_API+'gateway/only.do',
    method: 'get',
    params
  })
}

export function transferRecordDetail(params) {
  return instance_api({
    url: process.env.VUE_APP_API+'gateway/only.do',
    method: 'get',
    params
  })
}

// 调水指令执行下一步
export function next(params, data) {
  return instance_api({
    url: process.env.VUE_APP_API+'gateway/only.do',
    method: 'post',
    params,
    data
  })
}