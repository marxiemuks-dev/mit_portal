import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const addStudent = (formData) => {
  return axiosInstance.post(API_URL + "students", formData)
    .then((response) => {
      return {
        message: response.data.message,
        status: response.data.status,
        data: response.data.students, // make sure backend sends this
      };
    })
    .catch((error) => {
      console.error("Error creating applicant:", error);
      if (error.status === 403) {
        alert("Your session has expired. You will be logged out.");
      }
      if (error.status === 401) {
        alert(error.response.data.message);
      }
      return {
        message: error.response?.data?.message || "Something went wrong",
        status: error.response?.data?.status || "error",
      };
    });
};

const getAllStudents = () => {
    return axiosInstance.get(API_URL + `students`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.students
        })
    })
}

export default {
  addStudent,
  getAllStudents
};