// import SignUp from './containers/Auth/SignUp';
import Error404 from './containers/Error404/Error404';
import ProductPage from './containers/ProductPage/ProductPage';
import ProductDetails from './containers/ProductDetails/ProductDetails';
import CategoryPage from './containers/CategoryPage/CategoryPage';
import Cart from './containers/Cart/Cart';
import Checkout from './containers/Checkout/Checkout';
import OrderSuccessRedirect from './containers/OrderSuccessRedirect/OrderSuccessRedirect';
import OrderPage from './containers/OrderPage/OrderPage';
import ProductSearchPage from './containers/ProductSearchPage/ProductSearchPage';
const routes = [
  {
    title: 'Product Page',
    path: '/',
    exact: true,
    component: ProductPage
  },
  {
    title: 'Product Search Page',
    path: '/search',
    exact: true,
    component: ProductSearchPage
  },
  {
    title: 'Process payment Page',
    path: '/process-payment-verify-module',
    exact: true,
    component: OrderSuccessRedirect
  },
  {
    title: 'Success Page',
    path: '/orders',
    exact: true,
    component: OrderPage
  },
  {
    title: 'Success Page',
    path: '/orders/processing',
    exact: true,
    component: OrderPage
  },
  {
    title: 'Success Page',
    path: '/orders/shipped',
    exact: true,
    component: OrderPage
  },
  {
    title: 'Success Page',
    path: '/orders/delivered',
    exact: true,
    component: OrderPage
  },

  {
    title: 'Product Details',
    path: '/details/:productId',
    exact: true,
    component: ProductDetails
  },
  {
    title: 'Search By Category',
    path: '/category/:category',
    exact: true,
    component: CategoryPage
  },
  {
    title: 'Cart Page',
    path: '/cart',
    exact: true,
    component: Cart
  },
  {
    title: 'Check Out Page',
    path: '/checkout',
    exact: true,
    forAuthUser: true,
    component: Checkout
  },
  {
    title: 'Error',
    path: '*',
    exact: true,

    component: Error404
  }
];

export default routes;
