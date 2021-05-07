const httpResource = ({ success, code, message, data }) => {
  if (typeof message === "object") message = "Server error.";
  return {
    success,
    code,
    message: message || null,
    data: success ? data : null,
    error: !success,
  };
};

module.exports = httpResource;
