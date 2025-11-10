import announcementService from "../service/announcement.service";
import {ADD_NOTIFICATION,GET_ALL_NOTIFICATION, UPDATE_NOTIFICATION } from "./types"; // define your action types

export const addAnnouncement = (title, description, isRead, targetUser, visibility,category, image) => (dispatch) => {
  return announcementService.addAnnouncement(title, description, isRead, targetUser, visibility,category, image).then(
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
export const getAnnouncements = () => (dispatch) => {
    return announcementService.getAnnouncements()
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
export const updateAnnouncement = (id,title, description, isRead, targetUser, visibility,category, image) => (dispatch) => {
  return announcementService.updateAnnouncement(id,title, description, isRead, targetUser, visibility,category, image).then(
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
export const deleteAnnouncement = (id) => (dispatch) => {
  return announcementService.deleteAnnouncement(id).then(
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