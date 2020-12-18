console.time('main')
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './service/axios'
import VueAxios from 'vue-axios'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import { get_lf_accesstoken, getUserInfoAPI, getAgentidAPI } from './service/api'
import { getQueryString } from './utils/utils'

Vue.use(ViewUI);
Vue.use(VueAxios,axios);
const QRCode = require('qrcodejs2');
Vue.prototype.QRCode = QRCode ;


// 获取code
const auth_code = getQueryString('auth_code');
console.log(auth_code)
if(!auth_code){

  Vue.prototype.$Message.error('请从企业微信管理登录！')
  
} else {

  get_lf_accesstoken().then( res => {
    Vue.prototype.accessToken = res.data.token;
    Vue.prototype.expiration = res.data.expiration
    console.log(Vue.prototype.accessToken)
  })

    const EventBus = new Vue();
    Object.defineProperties(Vue.prototype, {
      $bus: {
        get: function () {
          return EventBus
        }
      }
    })

    getUserInfoAPI({
      auth_code,
    }).then( (res) => {

      Vue.prototype.isAuthorized = res.data.success;
      console.log(JSON.stringify(res.data.userInfo))
     if(res.data.success){
      Vue.prototype.$userInfo = res.data.userInfo.user_info;
      Vue.prototype.$corpid = res.data.userInfo.corp_info.corpid;
      getAgentidAPI({
        corpid: Vue.prototype.$corpid,
      }).then( res => {
        Vue.prototype.$agenid = res.data.agentid;
      })

     }
      Vue.config.productionTip = false

      new Vue({
        router,
        render: h => h(App)
      }).$mount('#app')
      console.timeEnd('main')

    }).catch( (err) => {
      alert( err );
    })

}



// Vue.config.productionTip = false

// const EventBus = new Vue();
// Object.defineProperties(Vue.prototype, {
//   $bus: {
//     get: function () {
//       return EventBus
//     }
//   }
// })

// Vue.prototype.$userInfo= {"usertype":2,"user_info":{"userid":"YeXunXunZhi","name":"YeXunXunZhi","avatar":"https://wework.qpic.cn/bizmail/P5d1duKQUuS2bRC7IvPNglbhZ7ricc1oF2mn9dVY1jN0P9Hu59L2LGw/0"},"corp_info":{"corpid":"ww0b8772cfc1ed757c"},"agent":[{"agentid":
// 1000075,"auth_type":1}],"auth_info":{"department":[{"id":1,"writable":true}]}}

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')
// console.timeEnd('main')
