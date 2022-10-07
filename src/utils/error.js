const Error = (path, message) => {
  return {
    path,
    message,
  };
};

module.exports = Error;
