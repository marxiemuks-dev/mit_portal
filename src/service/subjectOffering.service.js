import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"


const getAllSubjectOffering = () => {
    return axiosInstance.get(API_URL + `subjectOffering`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.subject_offerings
        })
    })
}

// ✅ Add new subject offering
export const addSubjectOffering = (offering) => {
  return axiosInstance
    .post(API_URL + `subjectOffering`, offering)
    .then((response) => ({
      message: response.data.message,
      status: response.data.status,
      data: response.data.offering, // backend should return the inserted offering
    }))
    .catch((error) => {
      throw (
        error.response?.data || {
          message: "Error adding subject offering",
          status: "error",
        }
      );
    });
};

export default {
  getAllSubjectOffering,
  addSubjectOffering
};