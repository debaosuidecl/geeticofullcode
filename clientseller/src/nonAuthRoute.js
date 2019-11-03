import SignUp from './containers/Auth/SignUp';
import Error404 from './containers/Error404/Error404';

const routes = [
  {
    title: 'SignUp',
    path: '/sellerpage',
    exact: true,
    component: SignUp
  },
  {
    title: 'Error',
    path: '*',
    exact: true,

    component: Error404
  }
];

export default routes;
