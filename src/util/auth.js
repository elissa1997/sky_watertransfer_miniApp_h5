import store from '@/store/index.js';
import { userInfo } from "@/network/user.js";
import Cookies from 'js-cookie';
import wx from 'weixin-js-sdk'
import { Notify } from 'vant';
// 获取url参数
export function getUrlParams(name) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i=0;i<vars.length;i++) {
    let pair = vars[i].split("=");
    if(pair[0] == name){return pair[1];}
  }
  return false;
}

// 保存token
export function saveToken() {
  let token = getUrlParams("token");
  if (token) {
    let hour = 23
    let time= new Date(new Date().getTime() + hour * 60 * 60 * 1000);
    Cookies.set("token", token, { expires: time });
  }
}

// 保存用户信息
export async function saveUserInfo() {
  await userInfo().then(res => {
    if (res.code === "1") {
      store.commit('user/setInfo', res.data)
    }
  })
}

// 发送请求前检查是否存在token
export function checkTokenBeforeRequest() {
  let token = Cookies.get("token");
  if (token){
    return token;
  }else{
    console.log("token过期(cookie过期)");
    wx.miniProgram.navigateTo({url: '../login/login'});
  }
}

// 发送请求后判断token是否过期
export function checkTokenAfterRequest(err) {
  if (err.message.includes('timeout')) {
    Notify({ type: 'warning', message: '网络超时' });
  }else if (typeof err.response === 'undefined') {
    console.log("token过期(后端过期)");
    wx.miniProgram.navigateTo({url: '../login/login'});
  }
  console.log(err);
}