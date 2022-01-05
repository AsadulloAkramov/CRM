const MessageHistory = require('../mongodb/models/messagesHistory');

class MessageHistoryRepository {
  static async insertMessageHistory(userId, via, message, sended) {
    try {
      const history = new MessageHistory({
        date: new Date(),
        userId,
        via,
        message,
        sended
      });
      await history.save();
      return history;
    } catch (error) {
      throw Error(`Message History Repository [insertMessageHistory]:${error}`);
    }
  }

  static async getMessageHistory(userId) {
    try {
      const history = await MessageHistory.find({
        userId
      }).lean();

      return history;
    } catch (error) {
      throw Error(`Message History Repository [getMessageHistory]:${error}`);
    }
  }

  static async deleteMessageHistory(userId, messageId) {
    try {
      const history = await MessageHistory.findOneAndDelete({
        userId,
        _id: messageId
      });

      return history;
    } catch (error) {
      throw Error(`Message History Repository [deleteMessageHistory]:${error}`);
    }
  }
}

module.exports = MessageHistoryRepository;
