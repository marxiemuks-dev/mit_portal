import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const getCalendarEvents = () => {
    return axiosInstance.get(API_URL + `calendar`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}

const addCalendarEvent = (title,description,event_type,start_date,end_date,semester,school_year,status,visibility,created_by) => {
    return axiosInstance.post(API_URL + `calendar`,{
      title,
      description,
      event_type,
      start_date,
      end_date,
      semester,
      school_year,
      status,
      visibility,
      created_by
    }).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
    .catch((error)=> {
    console.error('Error creating calendar:', error);
            if (error.status === 403){
                alert("Your session has expired. You will be logged out.");
            }
            if(error.status === 401){
                alert(error.response.data.message);
            }
            return ({message:error.response.data.message,status:error.response.data.status})
  })
}

const updateCalendarEvent = (id,title,description,event_type,start_date,end_date,semester,school_year,status,visibility,created_by) => {
    return axiosInstance.put(API_URL + `calendar/${id}`,{
      title,
      description,
      event_type,
      start_date,
      end_date,
      semester,
      school_year,
      status,
      visibility,
      created_by
    }).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
    .catch((error)=> {
    console.error('Error creating calendar:', error);
            if (error.status === 403){
                alert("Your session has expired. You will be logged out.");
            }
            if(error.status === 401){
                alert(error.response.data.message);
            }
            return ({message:error.response.data.message,status:error.response.data.status})
  })
}

const deleteCalendarEvent = (id) => {
    return axiosInstance.delete(API_URL + `calendar/${id}`).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
        })
    })
    .catch((error)=> {
    console.error('Error creating calendar:', error);
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
    getCalendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent
}