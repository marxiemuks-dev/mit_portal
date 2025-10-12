import notificationService from "../service/notification.service";
import {ADD_NOTIFICATION,GET_ALL_NOTIFICATION, UPDATE_NOTIFICATION } from "./types"; // define your action types

export const addNotification = (title, message, target_type, target_user_id, is_read) => (dispatch) => {
  return notificationService.addNotification(title, message, target_type, target_user_id, is_read).then(
    (response) => {
      dispatch({
        type: ADD_NOTIFICATION,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};
export const getNotifications = () => (dispatch) => {
    return notificationService.getNotifications()
    .then((response)=> {
        dispatch({
            type: GET_ALL_NOTIFICATION,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}
export const updateNotification = (id,title, message, target_type, target_user_id, is_read) => (dispatch) => {
  return notificationService.updateNotification(id,title, message, target_type, target_user_id, is_read).then(
    (response) => {
      dispatch({
        type: UPDATE_NOTIFICATION,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};