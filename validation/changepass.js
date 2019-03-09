const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateChangePassInput(data) {
  let errors = {};
  data.opassword = !isEmpty(data.opassword) ? data.opassword : "";
  data.npassword = !isEmpty(data.npassword) ? data.npassword : "";
  data.npassword2 = !isEmpty(data.npassword2) ? data.npassword2 : "";

  //Password Validation

  if (Validator.isEmpty(data.opassword)) {
    errors.opassword = "Old Password field is required";
  }

  //Password Validation
  if (!Validator.isLength(data.npassword, { min: 6, max: 30 })) {
    errors.npassword = "New Password must be atleast 6 characters";
  }
  if (Validator.isEmpty(data.npassword)) {
    errors.npassword = "New Password field is required";
  }

  //Check for re using old Password
  if (Validator.equals(data.npassword, data.opassword)) {
    errors.npassword = "You should use a different password";
  }

  //Confirmation Password Validation
  if (!Validator.equals(data.npassword, data.npassword2)) {
    errors.npassword2 = "New Passwords must match";
  }

  if (Validator.isEmpty(data.npassword2)) {
    errors.npassword2 = "Confirm Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
