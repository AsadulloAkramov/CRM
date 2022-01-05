/* eslint-disable no-plusplus */
const pg = require('../utils/pg');

class GroupsStagesRepository {
  static async createStages(groupId, stagesCount, lessonsCountForPerStage) {
    // prettier-ignore
    let query = 'insert into group_stages(group_id, lessons_count, approximate_lessons_count) values';

    let i = 0;

    while (i !== stagesCount) {
      ++i;

      query += `(${groupId}, 0, ${lessonsCountForPerStage[i - 1]})`;

      if (i !== stagesCount) {
        query += ',';
      }
    }

    await pg(true, `${query};`);
  }

  static async update(groupId, lessonsCountForMonth) {
    try {
      const lastStage = await pg(
        true,
        "select * from group_stages where group_id = $1 and status = 'active' order by id asc limit 1",
        groupId
      );

      const allStagesQuery = 'select * from group_stages where group_id = $1';

      if (lastStage.lessons_count === lessonsCountForMonth) {
        const nextStage = await pg(
          true,
          `
            select * from group_stages where group_id = $1 and id != $2 and status = 'active' order by id asc limit 1
          `,
          groupId,
          lastStage.id
        );

        if (!nextStage) {
          const newStage = await pg(
            true,
            `
              with update_and_insert as (
                update group_stages set status = '!active' where id = ${lastStage.id}
              ) insert into group_stages(group_id, lessons_count) values(${groupId}, 1) returning *;
            `
          );

          return {
            lastStage: newStage,
            allStages: await pg(false, allStagesQuery, groupId)
          };
        }

        const lastUpdatedStage = await pg(
          true,
          `
            with update_and_insert as (
              update group_stages set status = '!active' where id = ${lastStage.id}
            ) update group_stages set lessons_count = 1 where id = ${nextStage.id} returning *;
          `
        );

        return {
          lastStage: lastUpdatedStage,
          allStages: await pg(false, allStagesQuery, groupId)
        };
      }

      // prettier-ignore
      const lastUpdatedStage = await pg(true, `
        update group_stages set lessons_count = ${lastStage.lessons_count + 1} where id = ${lastStage.id}
        returning *;
      `);

      return {
        lastStage: lastUpdatedStage,
        allStages: await pg(false, allStagesQuery, groupId)
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getStageIdByGroupId(groupId) {
    try {
      return await pg(
        true,
        `
      SELECT
        id
      FROM
        group_stages
      WHERE
        group_id = $1
      `,
        groupId
      );
    } catch (error) {
      throw new Error(`[GroupsStagesRepository]:[getStageIdByGroupId]:${error}`);
    }
  }

  static async findGroupByStageId(stageId) {
    try {
      return await pg(
        true,
        `
      SELECT g.id,
        g.created_at,
        g.name,
        g.course_id
      FROM
        group_stages as gs
      JOIN
        groups as g on gs.group_id = g.id
      WHERE
        gs.id = $1
      `,
        stageId
      );
    } catch (error) {
      throw new Error(`[GroupsStagesRepository]:[findGroupByStageId]:${error}`);
    }
  }

  static async findBranchByStageId(stageId) {
    try {
      return await pg(
        true,
        `
        SELECT
            b.id,
            b.created_at,
            b.name,
            b.size,
            b.region_id
          FROM
            group_stages as gs
          JOIN
            groups as g on gs.group_id = g.id
          JOIN
            rooms as r on g.room_id = r.id
          JOIN
            branches as b on r.branch_id = b.id
          WHERE
            gs.id = $1
      `,
        stageId
      );
    } catch (error) {
      throw new Error(`[GroupsStagesRepository]:[findBranchByStageId]:${error}`);
    }
  }

  static async getCompletedAndCurrentStageByGroupId(groupId) {
    const oldStages = await pg(
      false,
      "select * from group_stages where group_id = $1 and status = '!active' order by id asc",
      groupId
    );

    const currentStage = await pg(
      true,
      "select * from group_stages where group_id = $1 and status = 'active' order by id asc limit 1",
      groupId
    );

    return [...oldStages, currentStage];
  }

  static async getById(id) {
    const query = `
      select * from group_stages where id = $1;
    `;

    const data = await pg(true, query, id);

    return data;
  }

  static async getByGroupId(groupId) {
    const query = `
      select * from group_stages where group_id = $1 order by id asc;
    `;

    const data = await pg(false, query, groupId);

    return data;
  }

  static async updateApproximateLessonsCount(stageId, approximateLessonsCount) {
    const query = `
      update group_stages set approximate_lessons_count = $2 where id = $1;
    `;

    const data = await pg(true, query, stageId, approximateLessonsCount);

    return data;
  }
}

module.exports = GroupsStagesRepository;
