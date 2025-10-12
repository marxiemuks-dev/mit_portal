import billingService from "../service/billing.service";
import { ADD_BILLING, ADD_PAYMENT, GET_ALL_BILLING, UPDATE_BILLING } from "./types"; // define your action types

export const addBilling = (student_id,total_misc,previouse_balance,subsidized_by_school,full_payment,semester,school_year) => (dispatch) => {
  return billingService.addBilling(student_id,total_misc,previouse_balance,subsidized_by_school,full_payment,semester,school_year).then(
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
export const updateBilling = (billing_id,total_misc,previouse_balance,subsidized_by_school,full_payment,semester,school_year,current_bill) => (dispatch) => {
  return billingService.updateBilling(billing_id,total_misc,previouse_balance,subsidized_by_school,full_payment,semester,school_year,current_bill).then(
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