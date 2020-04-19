// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import iView from 'view-design'
import '@/assets/theme/default/index.less';
import '@/assets/css/html.css'
import '@/assets/css/page.css'
import echarts from 'echarts'

//import 'iview/dist/styles/iview.css'

import lodash from 'lodash'
import 'babel-polyfill'
//滚动条
import Vuebar from 'vuebar' 
 

Vue.use(iView)
Vue.use(Vuebar) 
Vue.config.productionTip = false 

window.Vue = Vue

window.onmessage = function(event) {
  if (event.data === "reload") {
    location.reload();
  }
}; 

// 事件总线
let bus = new Vue({});

// 扩展 Vue 对象
Vue.prototype.$bus = bus;
Vue.prototype.$http = require('./vext/axios.js').default;
Vue.prototype.$user = require('./vext/user.js').default;
Vue.prototype.$args = require('./vext/args.js').default; 
Vue.prototype.$echarts = echarts;
/*权限控制*/
Vue.directive('power', {
  bind: function (el, binding, vnode) {
    var user = require('./vext/user.js').default;
    if(!user.hasPower(binding.value)){
      el.title = '暂无权限';
      el.style.opacity = 0.3
      if(el.tagName=='BUTTON'){
        el.disabled = true;
        el.click = null; 
      }
    }
  }
});

// 路由监听
router.beforeEach(function (to, from, next){
  Vue.prototype.$routerArgs = {to,from,next};
  // 已加载
  if(Vue.$app){
    Vue.$app.beforeEach(to,from,next);
  } 
});
// 路由监听
router.beforeEach(function (to, from, next){
  if(from && from.matched.length && from.matched[0].instances && from.matched[0].instances.default){
    var vm = from.matched[0].instances.default;
    if(vm.beforeEach){
      vm.beforeEach({to, from, next});
      return;
    }
  }
  next();
});
// 路由监听
router.afterEach(function (to, from){  
  bus.$emit('on-router-after-each', {to,from});
  var obj = require('./vext/router.js').default;
  obj.afterEach(to,from);
});

/* eslint-disable no-new */
var app = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
}) 