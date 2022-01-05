const SuggestionStatusHistory = require('../mongodb/models/suggestionStatusHistory');
const pg = require('../utils/pg');

class SuggestionsRepository {
  static async updateSuggestionStatus(suggestionId, user, oldStatus, newStatus) {
    const history = new SuggestionStatusHistory({
      date: new Date(),
      suggestionId,
      user,
      oldStatus,
      newStatus
    });
    await history.save();
    await pg(
      true,
      `
        update suggestions set status = $1 where id = $2 returning *;
      `,
      newStatus,
      suggestionId
    );
    return history;
  }

  static async getSuggestionStatusHistories(suggestionId) {
    const history = await SuggestionStatusHistory.find({
      suggestionId
    }).lean();
    return history;
  }
}

module.exports = SuggestionsRepository;
