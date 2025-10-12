import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const getNotifications = () => {
    return axiosInstance.get(API_URL + `notification`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}

const addNotification = (title, message, target_type, target_user_id, is_read) => {
    return axiosInstance.post(API_URL + `notification`,{
        title,
        message,
        target_type,
        target_user_id,
        is_read
    }).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
    .catch((error)=> {
    console.error('Error creating notification:', error);
            if (error.status === 403){
                alert("Your session has expired. You will be logged out.");
            }
            if(error.status === 401){
                alert(error.response.data.message);
            }
            return ({message:error.response.data.message,status:error.response.data.status})
  })
}
const updateNotification = (id,title, message, target_type, target_user_id, is_read) => {
    console.log(id,title, message, target_type, target_user_id, is_read)
    return axiosInstance.put(API_URL + `notification/${id}`,{
        title,
        message,
        target_type,
        target_user_id,
        is_read
    }).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
    .catch((error)=> {
    console.error('Error creating notification:', error);
            if (error.status === 403){
                alert("Your session has expired. You will be logged out.");
            }
            if(error.status === 401){
                alert(error.response.data.message);
            }
            return ({message:error.response.data.message,status:error.response.data.status})
  })
}

export default {
    getNotifications,
    addNotification,
    updateNotification
}