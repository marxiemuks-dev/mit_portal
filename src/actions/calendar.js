import calendarService from "../service/calendar.service";
import { ADD_CALENDAR, DELETE_CALENDAR, GET_ALL_CALENDER, UPDATE_CALENDAR } from "./types"; // define your action types

export const addCalendarEvent = (title,description,event_type,start_date,end_date,semester,school_year,status,visibility,created_by) => (dispatch) => {
  return calendarService.addCalendarEvent(title,description,event_type,start_date,end_date,semester,school_year,status,visibility,created_by).then(
    (response) => {
      dispatch({
        type: ADD_CALENDAR,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};
export const getCalendarEvents = () => (dispatch) => {
    return calendarService.getCalendarEvents()
    .then((response)=> {
        dispatch({
            type: GET_ALL_CALENDER,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}
export const updateCalendarEvent = (id,title,description,event_type,start_date,end_date,semester,school_year,status,visibility,created_by) => (dispatch) => {
  return calendarService.updateCalendarEvent(id,title,description,event_type,start_date,end_date,semester,school_year,status,visibility,created_by).then(
    (response) => {
      dispatch({
        type: UPDATE_CALENDAR,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};
export const deleteCalendarEvent = (id) => (dispatch) => {
  return calendarService.deleteCalendarEvent(id).then(
    (response) => {
      dispatch({
        type: DELETE_CALENDAR,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};