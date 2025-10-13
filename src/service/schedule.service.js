import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const getAllSchedule = () => {
    return axiosInstance.get(API_URL + `schedule`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}
const addSchedule = (course, semester, schoolYear, subjectCode, descriptiveTitle, units, time, day, room, instructor,yearLevel,section) => {
    return axiosInstance.post(API_URL + `schedule`,{
      course,
      semester,
      schoolYear,
      subjectCode,
      descriptiveTitle,
      units,
      time,
      day,
      room,
      instructor,
      yearLevel,
      section
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
const updateSchedule = (id,course, semester, schoolYear, subjectCode, descriptiveTitle, units, time, day, room, instructor,yearLevel,section) => {
    return axiosInstance.patch(API_URL + `schedule`,{
      id,
      course,
      semester,
      schoolYear,
      subjectCode,
      descriptiveTitle,
      units,
      time,
      day,
      room,
      instructor,
      yearLevel,section
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

const deleteSchedule = (id) => {
    return axiosInstance.delete(API_URL + `schedule/${id}`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}

export default {
    getAllSchedule,
    addSchedule,
    updateSchedule,
    deleteSchedule
}