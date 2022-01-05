const RequirementStatusHistory = require('../mongodb/models/requirementStatusHistory');
const pg = require('../utils/pg');

class RequirementsRepository {
  static async getRequirementStatusHistories(requirementId) {
    const history = await RequirementStatusHistory.find({
      requirementId
    }).lean();
    return history;
  }

  static async updateRequirementStatus(requirementId, user, oldStatus, newStatus) {
    const history = new RequirementStatusHistory({
      date: new Date(),
      requirementId,
      user,
      oldStatus,
      newStatus
    });
    await history.save();
    await pg(
      true,
      `
        update requirements set status = $1 where id = $2 returning *;
      `,
      newStatus,
      requirementId
    );
    return history;
  }
}

module.exports = RequirementsRepository;
