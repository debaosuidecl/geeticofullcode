// import SignUp from './containers/Auth/SignUp';
// import BusinessSellerSignUp from './containers/Auth/BusinessSellerSignUp/BusinessSellerSignUp';
// import SignUp from "./containers/ProductPage/ProductPage";
import InputTag from './containers/SellerBackend/AddProductContainer/InputTag';
import SellerBackendHome from './containers/SellerBackend/Home/Home';
import Error404 from './containers/Error404/Error404';
// import Loadin from './containers/LoadingPage/LoadingPage';
import SellerBackendProducts from './containers/SellerBackend/Product/Product';
import SellerBackendInventory from './containers/SellerBackend/Inventory/Inventory';
import SellerBackendAnalytics from './containers/SellerBackend/Analytics/Analytics';
import SellerBackendOrder from './containers/SellerBackend/OrdersManagement/OrdersManagement';
import AddProductContainer from './containers/SellerBackend/AddProductContainer/AddProductContainer';
import ProductDetail from './containers/SellerBackend/ProductDetail/ProductDetail';
// import LoadingPage from './containers/LoadingPage/LoadingPage';
// import AddProductContainer2 from './containers/SellerBackend/AddProductContainer/AddProductContainer2';

const routes = [
  {
    title: 'SellerBackendHome',
    path: '/',
    exact: true,

    component: SellerBackendHome
  },

  {
    title: 'SellerBackendProducts',
    path: '/sellerpage/products',
    exact: true,

    component: SellerBackendProducts
  },
  {
    title: 'SellerBackendProducts',
    path: '/sellerpage/products/productdetail/:productId',
    exact: true,

    component: ProductDetail
  },
  {
    title: 'SellerBackendOrder',
    path: '/sellerpage/order',
    exact: true,

    component: SellerBackendOrder
  },
  {
    title: 'Success Page',
    path: '/sellerpage/order/processing',
    exact: true,
    component: SellerBackendOrder
  },
  {
    title: 'Success Page',
    path: '/sellerpage/order/shipped',
    exact: true,
    component: SellerBackendOrder
  },
  {
    title: 'Success Page',
    path: '/sellerpage/orders/delivered',
    exact: true,
    component: SellerBackendOrder
  },
  {
    title: 'SellerBackendInventory',
    path: '/sellerpage/inventory',
    exact: true,

    component: SellerBackendInventory
  },
  {
    title: 'SellerBackendAnalytics',
    path: '/sellerpage/analytics',
    exact: true,
    component: SellerBackendAnalytics
  },
  {
    title: 'AddProductContainer',
    path: '/sellerpage/products/addnewproduct',
    exact: true,
    component: AddProductContainer
  },
  {
    title: 'testinput',
    path: '/test',
    exact: true,

    component: InputTag
  },
  {
    title: 'Error',
    path: '*',
    exact: true,

    component: Error404
  }
];

export default routes;
