import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utitlity';

const initialState = {
  notificationCount: 0,
  notifications: null
};

const getNotificationCount = (state, action) => {
  // console.log(action.notificationCount, 'from reducer');
  return updateObject(state, {
    notificationCount: action.notificationCount,
    notifications: action.notifications
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_NOTIFICATION_COUNT:
      return getNotificationCount(state, action);

    default:
      return state;
  }
};

export default reducer;
