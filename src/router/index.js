import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminLayout from '../views/AdminLayout.vue'
import Home from '../views/Home.vue'
import ProductManagement from '../views/ProductManagement.vue'
import NewsManagement from '../views/NewsManagement.vue'
import ContactManagement from '../views/ContactManagement.vue'
import ChangePassword from '../views/ChangePassword.vue'
import UserManagement from '../views/UserManagement.vue'
import SiteSettings from '../views/SiteSettings.vue'
import GoodsManagement from '../views/GoodsManagement.vue'
import CategoryManagement from '../views/CategoryManagement.vue'

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
        path: 'users',
        name: 'UserManagement',
        component: UserManagement
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: ChangePassword
      },
      {
        path: 'site-settings',
        name: 'SiteSettings',
        component: SiteSettings
      },
      {
        path: 'goods',
        name: 'GoodsManagement',
        component: GoodsManagement
      },
      {
        path: 'categories',
        name: 'CategoryManagement',
        component: CategoryManagement
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