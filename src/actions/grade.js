import gradeService from "../service/grade.service";
import { ADD_GRADES_BY_SCHEDULE, GET_GRADES_BY_SCHEDULE, UPDATE_STUDENT_GRADES } from "./types"; // define your action types

export const getStudentGradesBySchedule = (subjectId) => (dispatch) => {
    return gradeService.getStudentGradesBySchedule(subjectId)
    .then((response)=> {
        dispatch({
            type: GET_GRADES_BY_SCHEDULE,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}

export const addStudentGrades = (premid,midterm,prefinal,finalterm,student_id,subject_schedule_id) => (dispatch) => {
    return gradeService.addStudentGrades(premid,midterm,prefinal,finalterm,student_id,subject_schedule_id)
    .then((response)=> {
        dispatch({
            type: ADD_GRADES_BY_SCHEDULE,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}

export const updateStudentGrade = (id,premid,midterm,prefinal,finalterm) => (dispatch) => {
    return gradeService.updateStudentGrade(id,premid,midterm,prefinal,finalterm)
    .then((response) => {
        dispatch({
            type: UPDATE_STUDENT_GRADES,
            payload: response.data
        })
        return response
    },(error) => {
        return error
    })
}

export const getStudentGradesByStudentId = (currentStudentID) => (dispatch) => {
    return gradeService.getStudentGradesByStudentId(currentStudentID)
    .then((response)=> {
        dispatch({
            type: GET_GRADES_BY_SCHEDULE,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}
export const getStudentGradeEvaluation = (studentID) => (dispatch) => {
    return gradeService.getStudentGradeEvaluation(studentID)
    .then((response)=> {
        dispatch({
            type: GET_GRADES_BY_SCHEDULE,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}
export const getGradeForEverySchedule = () => (dispatch) => {
    return gradeService.getGradeForEverySchedule()
    .then((response)=> {
        dispatch({
            type: GET_GRADES_BY_SCHEDULE,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}