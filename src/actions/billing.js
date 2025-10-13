import billingService from "../service/billing.service";
import { ADD_BILLING, ADD_PAYMENT, GET_ALL_BILLING, GET_ALL_STUDENT_BILL, UPDATE_BILLING } from "./types"; // define your action types

export const addBilling = (studentID,semester,school_year,scholarship_status,total_unit,tuition_fee,total_misc,total_misc_other_fee,previouse_balance,subsidized_by_school,full_payment,total_bill) => (dispatch) => {
  return billingService.addBilling(studentID,semester,school_year,scholarship_status,total_unit,tuition_fee,total_misc,total_misc_other_fee,previouse_balance,subsidized_by_school,full_payment,total_bill).then(
    (response) => {
      dispatch({
        type: ADD_BILLING,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};
export const getAllBilling = () => (dispatch) => {
    return billingService.getAllBilling()
    .then((response)=> {
        dispatch({
            type: GET_ALL_BILLING,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}
export const addPayment = (billing_id, payment_date, amount_paid, reference_no) => (dispatch) => {
  console.log(billing_id, payment_date, amount_paid, reference_no)
  return billingService.addPayment(billing_id, payment_date, amount_paid, reference_no).then(
    (response) => {
      dispatch({
        type: ADD_PAYMENT,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};
export const updateBilling = (billing_id,semester,school_year,scholarship_status,total_unit,tuition_fee,total_misc,total_misc_other_fee,previouse_balance,subsidized_by_school,full_payment,total_bill) => (dispatch) => {
  return billingService.updateBilling(billing_id,semester,school_year,scholarship_status,total_unit,tuition_fee,total_misc,total_misc_other_fee,previouse_balance,subsidized_by_school,full_payment,total_bill).then(
    (response) => {
      dispatch({
        type: UPDATE_BILLING,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};
export const getBillingByStudentId = (id) => (dispatch) => {
    return billingService.getBillingByStudentId(id)
    .then((response)=> {
        dispatch({
            type: GET_ALL_STUDENT_BILL,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}