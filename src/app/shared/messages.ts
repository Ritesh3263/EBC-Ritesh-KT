export const APP_NAME = window.localStorage['__ebc__cmp_nm'] ? window.localStorage['__ebc__cmp_nm'] : 'Smart Digital Business Card';

export const DATEFORMAT = 'd-m-Y';
export const TIMEFORMAT = 'h:i K';

export const DATE_TIME_FORMAT = {
  dateFormat: DATEFORMAT + ' ' + TIMEFORMAT,
  enableTime: true,
  defaultDate: new Date()
  // minDate: null
};

export const DATE_FORMAT = {
  dateFormat: DATEFORMAT,
  enableTime: false,
  // minDate: null
};

export const DATERANGE_FORMAT = {
  dateFormat: DATEFORMAT,
  mode: 'range'
};

export const TIME_FORMAT = {
  dateFormat: TIMEFORMAT,
  time_24hr: false,
  enableTime: true,
  noCalendar: true,
  defaultDate: new Date()
};

export const errorMessage = {
  change_password_success: 'Your password changed Successfully',

  delete_dialogue_type: 'error',
  delete_header_text: 'Are you sure you want to delete?',
  delete_confirm_button: 'Yes, Delete it!',
  delete_cancel_button: 'No, Keep it',
  delete_smalll_text: 'You will not be able to recover this!',

  not_delete_dialogue_type: 'error',
  not_delete_header_text: `You can't delete this`,
  not_delete_confirm_button: 'Yes, Delete it!',
  not_delete_cancel_button: 'No, Keep it',
  not_delete_smalll_text: ' This Threshold Attached With Profile',

  unassign_dialogue_type: 'error',
  unassign_header_text: 'Are you sure want to un-assign?',
  unassign_confirm_button: 'Yes, Un-Assign it!',
  unassign_cancel_button: 'No, Keep it',
  unassign_smalll_text: 'You will not be able to recover this!',

  accept_installment_request_dialogue_type: 'success',
  accept_installment_request_header_text: 'Are you sure want to Accept?',
  accept_installment_request_confirm_button: 'Yes, Accept it!',
  accept_installment_request_cancel_button: 'No, Keep it',
  accept_installment_request_smalll_text: 'You will not be able to recover this!',

  reject_installment_request_dialogue_type: 'success',
  reject_installment_request_header_text: 'Are you sure want to Reject?',
  reject_installment_request_confirm_button: 'Yes, Reject it!',
  reject_installment_request_cancel_button: 'No, Keep it',
  reject_installment_request_smalll_text: 'You will not be able to recover this!',

  status_change_dialogue_type: 'warning',
  status_change_header_text: 'Are you sure want to change?',
  status_change_confirm_button: 'Yes',
  status_change_cancel_button: 'No, Keep it',
  status_change_smalll_text: '',

};
