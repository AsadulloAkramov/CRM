module.exports = (value) => {
  const dateObject = value ? new Date(value) : new Date();

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const date = String(dateObject.getDate()).padStart(2, '0');

  return `${year}-${month}-${date}`;
};
