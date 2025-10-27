import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const getStudentGradesBySchedule = (subjectId) => {
    return axiosInstance.get(API_URL + `grade/${subjectId}`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}
const getAllGrades = () => {
    return axiosInstance.get(API_URL + `grade`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}
const addStudentGrades = (premid,midterm,prefinal,finalterm,student_id,subject_schedule_id) => {
    return axiosInstance.post(API_URL + `grade`,{
        premid,midterm,prefinal,finalterm,student_id,subject_schedule_id
    }).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
    .catch((error)=> {
    console.error('Error:', error);
            if (error.status === 403){
                alert("Your session has expired. You will be logged out.");
            }
            if(error.status === 401){
                alert(error.response.data.message);
            }
            return ({message:error.response.data.message,status:error.response.data.status})
  })
}

const updateStudentGrade = (id,premid,midterm,prefinal,finalterm) =>{
    return axiosInstance.put(API_URL +`grade/${id}`, {
        premid,
        midterm,
        prefinal,
        finalterm
    }).then((response)=> {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    }).catch((error) => {
            console.error('Error creating notification:', error);
            if (error.status === 403){
                alert("Your session has expired. You will be logged out.");
            }
            if(error.status === 401){
                alert(error.response.data.message);
            }
            return ({message:error.response.data.message,status:error.response.data.status})
    })
};

const getStudentGradesByStudentId = (currentStudentID) => {
    return axiosInstance.get(API_URL + `grade/student/${currentStudentID}`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}
const getStudentGradeEvaluation = (studentID) => {
    return axiosInstance.get(API_URL + `grade/grade-evaluation/${studentID}`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}
const getGradeForEverySchedule = () => {
    return axiosInstance.get(API_URL + `grade/schedule/all/evaluation`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}
export default {
    getAllGrades,
    addStudentGrades,
    getStudentGradesBySchedule,
    updateStudentGrade,
    getStudentGradesByStudentId,
    getStudentGradeEvaluation,
    getGradeForEverySchedule
}