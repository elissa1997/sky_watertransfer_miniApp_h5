import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat";
import Cookies from 'js-cookie'
import {install} from '@icon-park/vue/es/all';
import { Notify } from 'vant';

import { saveToken, saveUserInfo } from "@/util/auth.js";
import { hasPermission } from "@/util/hasPermission.js";


Vue.config.productionTip = false;


//加载需要异步查询的参数、数据 如：esri gis模块，将异步方法同步执行完后再初始化vue，
const initParamsStart = async () => {
  try {
    await saveToken();
    await saveUserInfo();
    Vue.use(Notify);
    dayjs.extend(customParseFormat);
    Vue.prototype.$dayjs = dayjs;
    Vue.prototype.$hasPermission = hasPermission;
    Vue.prototype.$Cookies = Cookies;


  } catch (error) {
    console.log(error);
  }
  install(Vue);
new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

}

initParamsStart();