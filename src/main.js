import Vue from 'vue'
import VueRouter from "vue-router";
import VueResource from "vue-resource";
import App from './App'

//组件
import goods from 'components/goods/goods.vue'
import seller from 'components/seller/seller.vue'
import ratings from 'components/ratings/ratings.vue'


//集体引入styl
import 'common/stylus/index.styl'


Vue.use(VueRouter)
Vue.use(VueResource)

let app = Vue.extend(App)
let router  = new VueRouter({
  linkActiveClass:'active'
})

router.map({
  '/goods':{
    component:goods
  },
  '/seller':{
    component:seller
  },
  '/ratings':{
    component:ratings
  }
})
router.start(app,"#app")

//默认首页
// router.go('/ratings')

