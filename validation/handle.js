const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateHandleInput(data) {
  let errors = {};
  data.handle = !isEmpty(data.handle) ? data.handle : "";

  //Handle Validation

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Handle field is required";
  }

  //Handle Validation
  if (!Validator.isLength(data.handle, { min: 6, max: 40 })) {
    errors.handle = " Handle must be between 6 to 40 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
