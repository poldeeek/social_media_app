import * as actions from "./actionTypes";
import { api, authenticationHeader } from "../../config/apiHost";

export const loadNotifications = (id: string) => (
  dispatch: Function,
  getState: Function
) => {
  console.log("gdf");
  api
    .get(
      `http://localhost:5000/api/notifications/getNotificationsStatus/${id}`,
      {
        headers: authenticationHeader(),
      }
    )
    .then((resp) => {
      dispatch({
        type: actions.GET_NOTIFICATIONS_SUCCESS,
        notifications: resp.data,
      });
    })
    .catch((err) => {
      dispatch({ type: actions.GET_NOTIFICATIONS_ERROR });
    });
};

export const setNotification = (action: string, value: boolean, id: string) => (
  dispatch: Function,
  getState: Function
) => {
  if (action === "invitations") {
    if (!value)
      api
        .post(
          `http://localhost:5000/api/invitations/seeAllInvitations/${id}`,
          {},
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          console.log(resp);
          dispatch({
            type: actions.SET_NOTIFICATION_INVITATIONS,
            value,
          });
        })
        .catch((err) => {
          console.log(err);
          dispatch({
            type: actions.SET_NOTIFICATION_ERROR,
          });
        });
    if (value)
      dispatch({
        type: actions.SET_NOTIFICATION_INVITATIONS,
        value,
      });
  } else if (action === "bell") {
    if (!value)
      api
        .post(
          `http://localhost:5000/api/notifications/seeAllBells/${id}`,
          {},
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          dispatch({
            type: actions.SET_NOTIFICATION_BELL,
            value,
          });
        })
        .catch((err) => {
          console.log(err);
          dispatch({
            type: actions.SET_NOTIFICATION_ERROR,
          });
        });
    if (value)
      dispatch({
        type: actions.SET_NOTIFICATION_BELL,
        value,
      });
  } else if (action === "messages") {
    dispatch({
      type: actions.SET_NOTIFICATION_MESSAGES,
      value,
    });
  }
};
