import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const getAllBilling = () => {
    return axiosInstance.get(API_URL + `billing`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}

const addBilling = (studentID,semester,school_year,scholarship_status,total_unit,tuition_fee,total_misc,total_misc_other_fee,previouse_balance,subsidized_by_school,full_payment,total_bill) => {
    return axiosInstance.post(API_URL + `billing`,{
      studentID,
      semester,
      school_year,
      scholarship_status,
      total_unit,
      tuition_fee,
      total_misc,
      total_misc_other_fee,
      previouse_balance,
      subsidized_by_school,
      full_payment,
      total_bill
    }).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.billing
        })
    })
    .catch((error)=> {
    console.error('Error creating billing:', error);
            if (error.status === 403){
                alert("Your session has expired. You will be logged out.");
            }
            if(error.status === 401){
                alert(error.response.data.message);
            }
            return ({message:error.response.data.message,status:error.response.data.status})
  })
}

const addPayment = (billing_id, payment_date, amount_paid, reference_no) => {
    return axiosInstance.post(API_URL + `payment`,{
        billing_id, payment_date, amount_paid, reference_no
    }).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.payment
        })
    })
    .catch((error)=> {
    console.error('Error creating billing:', error);
            if (error.status === 403){
                alert("Your session has expired. You will be logged out.");
            }
            if(error.status === 401){
                alert(error.response.data.message);
            }
            return ({message:error.response.data.message,status:error.response.data.status})
  })
}
const updateBilling = (billing_id,semester,school_year,scholarship_status,total_unit,tuition_fee,total_misc,total_misc_other_fee,previouse_balance,subsidized_by_school,full_payment,total_bill) => {
    return axiosInstance.put(API_URL + `billing/${billing_id}`,{
        semester,
        school_year,
        scholarship_status,
        total_unit,
        tuition_fee,
        total_misc,
        total_misc_other_fee,
        previouse_balance,
        subsidized_by_school,
        full_payment,total_bill
    }).then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.billing
        })
    })
    .catch((error)=> {
    console.error('Error creating billing:', error);
            if (error.status === 403){
                alert("Your session has expired. You will be logged out.");
            }
            if(error.status === 401){
                alert(error.response.data.message);
            }
            return ({message:error.response.data.message,status:error.response.data.status})
  })
}
const getBillingByStudentId = (id) => {
    return axiosInstance.get(API_URL + `billing/student/${id}`)
    .then((response) => {
        return ({
            message: response.data.message,
            status: response.data.status,
            data: response.data.data
        })
    })
}
export default {
    getAllBilling,
    addBilling,
    addPayment,
    updateBilling,
    getBillingByStudentId
}