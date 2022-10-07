const Error = require("./Error");

const formatYupError = (err) => {
  const errors = [];
  err.inner.forEach((e) => {
    errors.push(Error(e.path, e.message));
  });

  return errors;
};

module.exports = formatYupError;
