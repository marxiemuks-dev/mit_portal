import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"


const getAllApplicantsScore = () => {
    return axiosInstance.get(API_URL + `scores`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.scores
        })
    })
}

const getApplicantsScore = (query) => {
    return axiosInstance.get(API_URL + `scores/${query}`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.scores
        })
    })
}

const updateApplicantsScore = (applicant_id, newScore, updated_by) => {
    return axiosInstance.put(API_URL + `scores`,{
        applicant_id, newScore, updated_by
    })
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.scores
        })
    })
}

export default {
    getAllApplicantsScore,
    getApplicantsScore,
    updateApplicantsScore
}