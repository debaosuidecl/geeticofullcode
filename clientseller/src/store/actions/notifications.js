import * as actionTypes from './actionTypes';
import axios from 'axios';
import { authLogOut, authFail } from './auth';
import App from '../../App';
export const getNotificationCount = (notificationCount, notifications) => {
  return {
    type: actionTypes.GET_NOTIFICATION_COUNT,
    notificationCount,
    notifications
  };
};
export const notificationGet = () => {
  return dispatch => {
    let url;
    url = `${App.domain}api/notifications/1?getCount=true`;
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(authLogOut());
      dispatch(authFail(''));
    } else {
      let config = {
        headers: {
          'x-auth-token': token
        }
      };
      axios.get(url, config).then(res => {
        console.log(res.data, 'this is the freaking stuff');

        if (res.data.countOfUnreadMessages) {
          dispatch(
            getNotificationCount(
              res.data.countOfUnreadMessages,
              res.data.notifications
            )
          );
        } else {
          dispatch(getNotificationCount(0, res.data.notifications));
        }
      });
    }
  };
};
