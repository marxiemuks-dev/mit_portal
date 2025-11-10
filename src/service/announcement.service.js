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

const addAnnouncement = (title, description, isRead, targetUser, visibility,category, image) => {
    console.log(title, description, isRead, targetUser, visibility,category, image)
      // ✅ Use FormData for file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isRead", isRead);
    formData.append("targetUser", targetUser);
    formData.append("visibility", visibility);
    formData.append("category", category);

    // Only append if an image file is selected
    if (image) {
        formData.append("image", image);
    }

    return axiosInstance.post(API_URL + `announcement`,formData,{
      headers: {
        "Content-Type": "multipart/form-data", // important for multer
      },
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
const updateAnnouncement = (id,title, description, isRead, targetUser, visibility,category, image) => {
    console.log(id,title, description, isRead, targetUser, visibility,category, image)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isRead", isRead);
    formData.append("targetUser", targetUser);
    formData.append("visibility", visibility);
    formData.append("category", category);

    // Only append if an image file is selected
    if (image) {
        formData.append("image", image);
    }
    return axiosInstance.put(API_URL + `announcement/${id}`,formData,{
      headers: {
        "Content-Type": "multipart/form-data", // important for multer
      },
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

const deleteAnnouncement = (id) => {
    return axiosInstance.delete(API_URL + `announcement/${id}`,{
      headers: {
        "Content-Type": "multipart/form-data", // important for multer
      },
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
    updateAnnouncement,
    deleteAnnouncement
}