import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminLayout from '../views/AdminLayout.vue'
import Home from '../views/Home.vue'
import ProductManagement from '../views/ProductManagement.vue'
import NewsManagement from '../views/NewsManagement.vue'
import ContactManagement from '../views/ContactManagement.vue'
import ChangePassword from '../views/ChangePassword.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'products',
        name: 'ProductManagement',
        component: ProductManagement
      },
      {
        path: 'news',
        name: 'NewsManagement',
        component: NewsManagement
      },
      {
        path: 'contacts',
        name: 'ContactManagement',
        component: ContactManagement
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: ChangePassword
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router