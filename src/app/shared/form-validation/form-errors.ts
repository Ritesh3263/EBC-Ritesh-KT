export const VALIDATION_MESSAGES = {
  first_name: {
    required: `* Please enter first name`,
  },
  last_name: {
    required: `* Please enter last name`,
  },
  primaryEmailId: {
    // required: `* Please enter email`,
    email: `* Please enter valid email`,
    // validateEmail: `* Please enter valid email`,
  },
  phone_number: {
    required: `Please enter phone number`,
    minlength: `Please enter at least 8 digits`,
    maxlength: `Please enter at least 18 digits`
  },
  password: {
    required: `* Please enter password`,
    pattern: `* Password must contains at least 6 characters`,
  },
  confirm_password: {
    required: `* Please enter confirm password`,
    validatePassword: `* Your Password is not matched`,
  },

  login_pin: {
    required: `* Please enter PIN`,
    maxlength: `Pin Max 4 Digit`,
    minlength: `Please enter at least 4 digits`,
  },

  number_tag_to_create: {
    required: `* Please enter vlaue`,
    max: `Maximum 100`,
    min: ` Minimum 1`
  },

  reCaptcha: {
    isNotValid: 'Please enter a valid captcha'
  },

  linkedinId: {
    // required: `* LinkedIn Id is required`,
    pattern: `* LinkedIn Id is invalid`,
  },

  youtubeId: {
    // required: `* Youtube Id is required`,
    pattern: `* Youtube Id is invalid`,
  },

  linkedId: {
    // required: `* LinkedIn Id is required`,
    pattern: `* LinkedIn Id is invalid`,
  },

};
