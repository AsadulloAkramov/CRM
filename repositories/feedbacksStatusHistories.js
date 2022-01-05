const FeedbacksHistory = require('../mongodb/models/feedbacksForTeachersHistory');
const pg = require('../utils/pg');

class FeedbacksRepositry {
  static async changeSuggestionStatus(feedbackId, user, oldStatus, newStatus) {
    const history = new FeedbacksHistory({
      date: new Date(),
      feedbackId,
      user,
      oldStatus,
      newStatus
    });
    await history.save();

    await pg(
      true,
      `
        update feedbacks_for_teachers set status = $1 where id = $2 returning *;
      `,
      newStatus,
      feedbackId
    );
    return history;
  }

  static async changeFeedbackStatus(feedbackId, user, oldStatus, newStatus) {
    const history = new FeedbacksHistory({
      date: new Date(),
      feedbackId,
      user,
      oldStatus,
      newStatus
    });
    await history.save();

    return history;
  }

  static async getFeedbackStatusHistories(feedbackId) {
    const history = await FeedbacksHistory.find({
      feedbackId
    }).lean();
    return history;
  }
}

module.exports = FeedbacksRepositry;
