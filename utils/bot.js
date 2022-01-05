const fetch = require('node-fetch');

class Bot {
  constructor(token) {
    this.token = token;
  }

  async sendMessage(chatId, message) {
    await fetch(
      `https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=HTML`
    );
  }
}

module.exports = Bot;
