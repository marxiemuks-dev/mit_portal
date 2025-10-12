import { ADD_APPLICANTS, GET_ALL_APPLICANTS } from './types'
import applicantServince from '../service/applicant.service'

export const getAllApplicants = () => (dispatch) => {
    return applicantServince.getAllApplicants()
    .then((response)=> {
        dispatch({
            type: GET_ALL_APPLICANTS,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}

export const searchApplicant = (query) => (dispatch) => {
    return applicantServince.searchApplicant(query)
    .then((response)=> {
        dispatch({
            type: GET_ALL_APPLICANTS,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}

export const searchApplicantByMunicipality = (query) => (dispatch) => {
    return applicantServince.searchApplicantByMunicipality(query)
    .then((response)=> {
        dispatch({
            type: GET_ALL_APPLICANTS,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}
export const searchApplicantBySchool = (query) => (dispatch) => {
    return applicantServince.searchApplicantBySchool(query)
    .then((response)=> {
        dispatch({
            type: GET_ALL_APPLICANTS,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}

export const addApplicant = (application_no,firstname,middlename,lastname,contact_num,municipality,school) => (dispatch) => {
    return applicantServince.addApplicant(application_no,firstname,middlename,lastname,contact_num,municipality,school)
    .then((response)=> {
        dispatch({
            type: ADD_APPLICANTS,
            payload: response
        });
        return response
    },(error) => {
        return error
    })
}

export const deleteApplicant = (applicant_id) => (dispatch) => {
    return applicantServince.deleteApplicant(applicant_id)
    .then((response)=> {
        dispatch({
            type: ADD_APPLICANTS,
            payload: response
        });
        return response
    },(error) => {
        return error
    })
}
export const updateApplicant = (applicant_id,application_no,firstname,middlename,lastname,contact_num,municipality,school) => (dispatch) => {
    return applicantServince.updateApplicant(applicant_id,application_no,firstname,middlename,lastname,contact_num,municipality,school)
    .then((response)=> {
        dispatch({
            type: ADD_APPLICANTS,
            payload: response
        });
        return response
    },(error) => {
        return error
    })
}