import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const enrollStudent = (studentID,currentCourse,currentYearLevel,currentSemester,currentSchoolYear,enrollmentStatus,guardianEmail,studentEmail) => {
  return axiosInstance.post(API_URL + "enrollment", {
    studentID,currentCourse,currentYearLevel,currentSemester,currentSchoolYear,enrollmentStatus,guardianEmail,studentEmail
  })
  .then((response) => ({
    message: response.data.message,
    status: response.data.status,
    data: response.data.enrollment,
  }))
  .catch((error) => ({
    message: error.response?.data?.message || "Something went wrong",
    status: "error",
  }));
};

const getAllEnrollments = () => {
  return axiosInstance.get(API_URL + "enrollment")
  .then((response) => {
    return({
      message: response.data.message,
      status: response.data.status,
      data: response.data.enrollments
    })
  })
}

const updateEnrollment = (enrollmentID,currentCourse,currentYearLevel,currentSemester,currentSchoolYear,enrollmentStatus,guardianEmail) => {
  return axiosInstance.put(API_URL + "enrollment",{
      enrollmentID,
      currentCourse,
      currentYearLevel,
      currentSemester,
      currentSchoolYear,
      enrollmentStatus,
      guardianEmail,
  }).then((response) => {
    return({
      message: response.data.message,
      status: response.data.status,
    })
  })
}

const getEnrollmentsBySemesterAndYear = (semester, schoolYear) => {
  return axiosInstance
    .get(`${API_URL}enrollment/filter?semester=${encodeURIComponent(semester)}&schoolYear=${encodeURIComponent(schoolYear)}`)
    .then((response) => {
      return {
        message: response.data.message,
        status: response.data.status,
        data: response.data.enrollments
      };
    })
    .catch((error) => {
      console.error("Error fetching enrollments:", error);
      return {
        message: error.response?.data?.message || "Failed to fetch enrollments",
        status: false,
        data: []
      };
    });
};

const getEnrollmentById = (currentUserID) => {
  return axiosInstance
    .get(`${API_URL}enrollment/${currentUserID}`)
    .then((response) => {
      return {
        message: response.data.message,
        status: response.data.status,
        data: response.data.enrollment
      };
    })
    .catch((error) => {
      console.error("Error fetching enrollments:", error);
      return {
        message: error.response?.data?.message || "Failed to fetch enrollments",
        status: false,
        data: []
      };
    });
};
const deleteEnrollment = (id) => {
  return axiosInstance
    .delete(`${API_URL}enrollment/${id}`)
    .then((response) => {
      return {
        message: response.data.message,
        status: response.data.status,
        data: response.data.enrollment
      };
    })
    .catch((error) => {
      console.error("Error fetching enrollments:", error);
      return {
        message: error.response?.data?.message || "Failed to fetch enrollments",
        status: false,
        data: []
      };
    });
};

export default {
    enrollStudent,
    getAllEnrollments,
    updateEnrollment,
    getEnrollmentsBySemesterAndYear,
    getEnrollmentById,
    deleteEnrollment
};
