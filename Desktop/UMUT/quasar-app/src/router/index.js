import { createRouter, createWebHashHistory } from 'vue-router'
import AddProductPage from '../pages/AddProductPage.vue'
import ProductListPage from '../pages/ProductListPage.vue'
import ActiveProductsPage from '../pages/ActiveProductsPage.vue'
import AdminPanelPage from '../pages/AdminPanelPage.vue'
import CustomerViewPage from '../pages/CustomerViewPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: CustomerViewPage
  },
  {
    path: '/add-product',
    name: 'add-product',
    component: AddProductPage
  },
  {
    path: '/products',
    name: 'products',
    component: ProductListPage
  },
  {
    path: '/active-products',
    name: 'active-products',
    component: ActiveProductsPage
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanelPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
