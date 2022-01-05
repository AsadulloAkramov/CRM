const ResponseFormatter = (visibleDescription, baseDescription) => {
  const response = {
    visibleDescription,
    baseDescription
  };

  throw new Error(JSON.stringify(response));
};

module.exports = ResponseFormatter;
