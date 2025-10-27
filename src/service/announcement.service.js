import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const getAnnouncements = () => {
    return axiosInstance.get(API_URL + `announcement`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}

const addAnnouncement = (title, description, isRead, targetUser, visibility) => {
    console.log(title, description, isRead, targetUser, visibility)
    return axiosInstance.post(API_URL + `announcement`,{
        title,
        description,
        isRead,
        targetUser,
        visibility
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
const updateAnnouncement = (id,title, description, isRead, targetUser, visibility) => {
    console.log(id,title, description, isRead, targetUser, visibility)
    return axiosInstance.put(API_URL + `announcement/${id}`,{
        title,
        description,
        isRead,
        targetUser,
        visibility
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
    getAnnouncements,
    addAnnouncement,
    updateAnnouncement
}