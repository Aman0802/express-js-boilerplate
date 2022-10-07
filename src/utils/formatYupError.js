import Error from "./Error";

const formatYupError = (err) => {
  const errors = [];
  err.inner.forEach((e) => {
    errors.push(Error(e.path, e.message));
  });

  return errors;
};

export default formatYupError;
