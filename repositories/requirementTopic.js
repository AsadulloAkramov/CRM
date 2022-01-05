const pg = require('../utils/pg');

class RequirementTopicsRepository {
  static async getRequirementTopics() {
    try {
      return await pg(
        false,
        `
          select * from requirement_topics
          order by id desc;
        `
      );
    } catch (error) {
      throw new Error(`[RequirementTopicsRepository]:[getRequirementTopics]:${error}`);
    }
  }

  static async getRequirementTopicById(id) {
    try {
      return await pg(
        true,
        `
          select * from requirement_topics
          where id = $1;
        `,
        id
      );
    } catch (error) {
      throw new Error(`[RequirementTopicsRepository]:[getRequirementTopicById]:${error}`);
    }
  }

  static async addRequirementTopic(name) {
    try {
      return await pg(
        true,
        `
          INSERT INTO
            requirement_topics(
              name
            )
          VALUES(
            $1
          ) returning *;
        `,
        name
      );
    } catch (error) {
      throw new Error(`[RequirementTopicsRepository]:[addRequirementTopic]:${error}`);
    }
  }
}

module.exports = RequirementTopicsRepository;
