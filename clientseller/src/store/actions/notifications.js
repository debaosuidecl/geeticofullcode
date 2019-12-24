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
    url = `${App.domain}api/notifications?getCount=true`;
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
        console.log(res.data);
        // console.log(res.data[1].countOfUnreadMessages);
        if (res.data.countOfUnreadMessages) {
          // console.log('hey');
          dispatch(
            getNotificationCount(
              res.data.countOfUnreadMessages,
              res.data.notifications.notifications
            )
          );
          // dispatch(getNotificationCount(res.data.countOfUnreadMessages));
        }
      });
    }
  };
};
