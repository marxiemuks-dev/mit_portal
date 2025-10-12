import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const getAllApplicants = () => {
    return axiosInstance.get(API_URL + `applicants`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.applicants
        })
    })
}
const searchApplicant = (query) => {
    return axiosInstance.get(API_URL + `applicants/${query}`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.applicants
        })
    })
}
const searchApplicantByMunicipality = (query) => {
    return axiosInstance.get(API_URL + `applicants/municipality/${query}`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.applicants
        })
    })
}
const searchApplicantBySchool = (query) => {
    return axiosInstance.get(API_URL + `applicants/school/${query}`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.applicants
        })
    })
}
const addApplicant = (application_no,firstname,middlename,lastname,contact_num,municipality,school) => {
    return axiosInstance.post(API_URL + `applicants`,{
        application_no,firstname,middlename,lastname,contact_num,municipality,school
    }).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.applicants
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
const deleteApplicant = (applicant_id) => {
    return axiosInstance.delete(API_URL + `applicants/${applicant_id}`).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.applicants
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
const updateApplicant = (applicant_id,application_no,firstname,middlename,lastname,contact_num,municipality,school) => {
    return axiosInstance.put(API_URL + `applicants/${applicant_id}`,{
        application_no,
        firstname,
        middlename,
        lastname,
        contact_num,
        municipality,
        school
    }).then((response) => {
        console.log(response)
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.updated
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
    getAllApplicants,
    searchApplicant,
    searchApplicantByMunicipality,
    addApplicant,
    deleteApplicant,
    updateApplicant,
    searchApplicantBySchool
}