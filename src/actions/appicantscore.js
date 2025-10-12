import { GET_ALL_APPLICANTS_SCORE, GET_APPLICANTS_SCORE } from './types'
import applicantscoreServince from '../service/applicantscore.service'

export const getAllApplicantsScore = () => (dispatch) => {
    return applicantscoreServince.getAllApplicantsScore()
    .then((response)=> {
        dispatch({
            type: GET_ALL_APPLICANTS_SCORE,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}

export const getApplicantsScore = (query) => (dispatch) => {
    return applicantscoreServince.getApplicantsScore(query)
    .then((response)=> {
        dispatch({
            type: GET_APPLICANTS_SCORE,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}
export const updateApplicantsScore = (applicant_id, newScore, updated_by) => (dispatch) => {
    return applicantscoreServince.updateApplicantsScore(applicant_id, newScore, updated_by)
    .then((response)=> {
        dispatch({
            type: GET_APPLICANTS_SCORE,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}