const pg = require('../utils/pg');

class AssistantsRepository {
  static insertAssistant(groupId, userId) {
    try {
      return pg(
        true,
        `
        INSERT INTO assistants (group_id, user_id)
        VALUES ($1, $2)
        RETURNING id, group_id, user_id, is_teacher, is_active, created_at;
      `,
        groupId,
        userId
      );
    } catch (error) {
      throw new Error(`Assistants repository [insertAssistant]: ${error.message}`);
    }
  }

  static getAssistants() {
    try {
      return pg(
        false,
        `
        SELECT id, group_id, user_id, is_teacher, is_active, created_at
        FROM assistants
        ORDER BY created_at DESC;
        `
      );
    } catch (error) {
      throw new Error(`Assistants repository [getAssistants]: ${error.message}`);
    }
  }

  static async getAssistantsByGroupId(groupId) {
    const assistants = await pg(
      false,
      `
        SELECT id, group_id, user_id, is_teacher, is_active, created_at
        FROM assistants WHERE group_id = $1 and is_active = true and is_teacher = false
        ORDER BY created_at DESC;
      `,
      groupId
    );

    return assistants;
  }
}

module.exports = AssistantsRepository;
