import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
  GET_ALL_STUDENTS,
  ADD_USER,
} from "./types";

import AuthService from "../service/auth.service";

export const login = (username, password) => (dispatch) => {
  return AuthService.login(username, password).then(
    (data) => {
      console.log(data)
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data.data.user },
      });
      return data.data
    },
    (error) => {
      console.log(error)
      const message = error.response;
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return error
    }
  );
};

export const logout = () => (dispatch) => {
  AuthService.handleLogout();
  dispatch({
    type: LOGOUT,
  });
};

export const getAllUsers = () => (dispatch) => {
    return AuthService.getAllUser()
    .then((response)=> {
        dispatch({
            type: GET_ALL_STUDENTS,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}

export const addUser = (formData) => (dispatch) => {
  console.log(formData)
  return AuthService.addUser(formData.username,formData.password,formData.usertype,formData.first_name,formData.last_name,formData.middle_name)
  .then((response)=> {
    dispatch({
      type:ADD_USER,
      payload: response
    })
    return response;
  },
(error) => {
  return error
})
}
export const updateUser = (selectedUserId, formData) => (dispatch) => {
  console.log(formData)
  return AuthService.updateUser(selectedUserId,formData.username,formData.password,formData.usertype,formData.first_name,formData.last_name,formData.middle_name)
  .then((response)=> {
    dispatch({
      type:ADD_USER,
      payload: response
    })
    return response;
  },
(error) => {
  return error
})
}