import scheduleService from "../service/schedule.service";
import { ADD_SCHEDULE, DELETE_SCHEDULE, GET_ALL_SCHEDULE, UPDATE_SCHEDULE } from "./types"; // define your action types

export const addSchedule = (course, semester, schoolYear, subjectCode, descriptiveTitle, units, time, day, room, instructor,yearLevel,section) => (dispatch) => {
  return scheduleService.addSchedule(course, semester, schoolYear, subjectCode, descriptiveTitle, units, time, day, room, instructor,yearLevel,section).then(
    (response) => {
      dispatch({
        type: ADD_SCHEDULE,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};
export const getAllSchedule = () => (dispatch) => {
    return scheduleService.getAllSchedule()
    .then((response)=> {
        dispatch({
            type: GET_ALL_SCHEDULE,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}
export const updateSchedule = (id,course, semester, schoolYear, subjectCode, descriptiveTitle, units, time, day, room, instructor,yearLevel,section) => (dispatch) => {
  return scheduleService.updateSchedule(id,course, semester, schoolYear, subjectCode, descriptiveTitle, units, time, day, room, instructor,yearLevel,section).then(
    (response) => {
      dispatch({
        type: UPDATE_SCHEDULE,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};
export const deleteSchedule = (id) => (dispatch) => {
    return scheduleService.deleteSchedule(id)
    .then((response)=> {
        dispatch({
            type: DELETE_SCHEDULE,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}