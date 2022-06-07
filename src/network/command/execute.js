import {instance_api, instance_test_local} from "../axios.js";

export function executeList(params) {
  return instance_api({
    url: process.env.VUE_APP_API+'gateway/only.do',
    method: 'get',
    params
  })
}

export function publish(params, data) {
  return instance_api({
    url: process.env.VUE_APP_API+'gateway/only.do',
    method: 'post',
    params,
    data
  })
}

export function receiveExecute(params) {
  return instance_api({
    url: process.env.VUE_APP_API+'gateway/only.do',
    method: 'post',
    params
  })
}