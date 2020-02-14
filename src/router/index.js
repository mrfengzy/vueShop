import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/User/Users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Role.vue'
import Cate from '../components/Goods/Cate.vue'
Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', 
    component: Home ,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate }
    ]
  },

  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//导航首位
router.beforeEach((to, from, next) => {
  //将要访问的路径
  //from 代表从那个路径跳转过来的
  //next 函数 放行
  //next() next('/login') 强制跳转
  if (to.path === '/login') return next()
  if (!window.sessionStorage.getItem('token')) return next('login')
  next()
})
export default router
