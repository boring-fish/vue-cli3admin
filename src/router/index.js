import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/components/main/main'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login.vue')
  },
  {
    path: '/',
    name: 'main',
    redirect: '/home',
    component: Main,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/home/home.vue')
      },
      {
        path: '/material',
        name: 'material',
        component: () => import('../views/material/material.vue')
      },
      {
        path: '/taskList',
        name: 'taskList',
        component: () => import('../views/task/taskList.vue')
      },
      {
        path: '/taskClass',
        name: 'taskClass',
        component: () => import('../views/task/taskClass.vue')
      },
      {
        path: '/taskRule',
        name: 'taskRule',
        component: () => import('../views/task/taskRule.vue')
      },
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
