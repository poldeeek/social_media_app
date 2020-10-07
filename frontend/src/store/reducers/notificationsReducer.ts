import * as actions from "../actions/actionTypes";

export interface INotificationReducer {
  messages: boolean;
  bell: boolean;
  invitations: boolean;
}

export const initState = {
  messages: false,
  bell: false,
  invitations: false,
};

const notificationReducer = (
  state: INotificationReducer = initState,
  action: any
) => {
  switch (action.type) {
    case actions.GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        ...action.notifications,
      };
    case actions.SET_NOTIFICATION_ERROR:
    case actions.GET_NOTIFICATIONS_ERROR:
      return state;
    case actions.SET_NOTIFICATION_INVITATIONS:
      return {
        ...state,
        invitations: action.value,
      };
    case actions.SET_NOTIFICATION_BELL:
      console.log(state, action.value);
      return {
        ...state,
        bell: action.value,
      };
    default:
      return state;
  }
};

export default notificationReducer;
