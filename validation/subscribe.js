const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSubscriberInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";

  //Email Validation

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is Invalid";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
