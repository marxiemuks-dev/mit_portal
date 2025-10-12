import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const login = (username, password) => {
  return axiosInstance.post(API_URL + 'login', {
    username,
    password,
  }).then((response) => {
    localStorage.setItem('mitportal_user', JSON.stringify(response.data.user));
    return {data: response.data};
  }).catch((error)=>{
    console.log(error)
    if(error.code === "ERR_NETWORK"){
      return {data:{message:"ERR_NETWORK", status:false}}
    }
    return {data: error.response.data}
  });
};


const getAllUser = () => {
  return axiosInstance.get(API_URL + 'users').then((response) => {
    return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.users
        })
  }).catch((error)=>{
    console.log(error)
    if(error.code === "ERR_NETWORK"){
      return {data:{message:"ERR_NETWORK", status:false}}
    }
    return {data: error.response.data}
  });
};

const addUser = (username,password,usertype,first_name,last_name,middle_name) => {
  return axiosInstance.post(API_URL + 'users',{
    username,password,usertype,first_name,last_name,middle_name
  }).then((response)=> ({
    message: response.data.message,
    status: response.data.status,
  }))
  .catch((error) => ({
    message: error.response?.data?.message || "Something went wrong",
    status: "error",
  }));
}
const updateUser = (selectedUserId,username,password,usertype,first_name,last_name,middle_name) => {
  return axiosInstance.put(API_URL + `users/${selectedUserId}`,{
    username,password,usertype,first_name,last_name,middle_name
  }).then((response)=> ({
    message: response.data.message,
    status: response.data.status,
  }))
  .catch((error) => ({
    message: error.response?.data?.message || "Something went wrong",
    status: "error",
  }));
}


const handleLogout = () => {

  localStorage.removeItem("mitportal_user");

  // Optionally clear session storage
  sessionStorage.clear();

  // Redirect to login page
  window.location.href = "/login";
};

export default {
  login,
  handleLogout,
  getAllUser,
  addUser,
  updateUser
};
