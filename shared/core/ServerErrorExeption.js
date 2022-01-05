class ServerErrorExeption extends Error {
  constructor(error, type, message = 'Internal Server Error') {
    super(error);
    this.message = error;
    this.code = type;
    this.error = message;
  }
}

module.exports = ServerErrorExeption;
