const pg = require('../utils/pg');

async function getStudentCountByGroupId(groupId) {
  try {
    return await pg(
      true,
      `
    select count(*) from students where is_active = 'true' and group_id = $1;
  `,
      groupId
    );
  } catch (error) {
    throw Error(`Students repository [getStudentCountByGroupId]:${error}`);
  }
}

async function getUserById(userId) {
  try {
    return await pg(
      true,
      `
    select * from users where id = $1 and is_active = 'true';
  `,
      userId
    );
  } catch (error) {
    throw Error(`Students repository [getUserById]:${error}`);
  }
}

async function getGroupById(groupId) {
  try {
    return await pg(
      true,
      `
        select * from groups where id = $1 and status not in ('closed', 'deleted');
      `,
      groupId
    );
  } catch (error) {
    throw Error(`Students repository [getGroupById]:${error}`);
  }
}

async function getStudentsCount(id) {
  try {
    return await pg(
      true,
      `
    select count(id) from students where is_active = 'true' and group_id = $1;
  `,
      id
    );
  } catch (error) {
    throw Error(`Students repository [getStudentsCount]:${error}`);
  }
}

async function getStudents(params) {
  try {
    const whereFileds = {
      groupId: ` and group_id = ${params.groupId}`,
      statusId: ` and status_id = ${params.statusId}`,
      regionId: ` and users.region_id = ${params.regionId}`,
      comePlaceId: ` and come_place_id = ${params.comePlaceId}`,
      inviterUserId: ` and inviter_user_id = ${params.inviterUserId}`
    };

    let query = 'select * from students ';

    const joinUsersTable = ' join users on users.id = students.user_id';

    const whereQuery = " where is_active = 'true'";
    const joinWhereQuery = " where students.is_active = 'true'";

    if (params.regionId) {
      query += joinUsersTable;
      query += joinWhereQuery;
      query += whereFileds.regionId;
    } else {
      query += whereQuery;
    }

    if (params.groupId) {
      query += whereFileds.groupId;
    }

    if (params.statusId) {
      query += whereFileds.statusId;
    }

    if (params.regionId) {
      query += whereFileds.regionId;
    }

    if (params.comePlaceId) {
      query += whereFileds.comePlaceId;
    }

    if (params.inviterUserId) {
      query += whereFileds.inviterUserId;
    }

    const paginationQuery = ` order by students.id desc offset (${params.page} - 1) * ${params.limit} fetch next ${params.limit} rows only;`;

    query += paginationQuery;

    return await pg(false, query);
  } catch (error) {
    throw Error(`Students repository [getStudentsCount]:${error}`);
  }
}

async function getStudentsByGroupId(groupId) {
  try {
    return await pg(
      false,
      `
    select * from students where is_active = 'true' and group_id = $1;
  `,
      groupId
    );
  } catch (error) {
    throw Error(`Students repository [getStudentsByGroupId]:${error}`);
  }
}

async function updateStudent(
  id,
  groupId,
  firstName,
  lastName,
  borntDate,
  phoneNumber,
  regionId,
  districtId,
  comePlaceId,
  statusId,
  fatherFullName,
  gender,
  comment,
  isMarried,
  userId
) {
  try {
    const userUpdateFields = {
      firstName: ` first_name = '${firstName}',`,
      lastName: ` last_name = '${lastName}',`,
      borntDate: ` bornt_date = '${borntDate}',`,
      regionId: ` region_id = '${regionId}',`,
      districtId: ` district_id = '${districtId}',`,
      phoneNumber: ` phone_number = '${phoneNumber}',`
    };

    const userWhereQuery = ` where id = ${userId} )`;

    const studentUpdateFilds = {
      comePlaceId: ` come_place_id = '${comePlaceId}',`,
      statusId: ` status_id = '${statusId}',`,
      fatherFullName: ` father_full_name = '${fatherFullName}',`,
      gender: ` gender = '${gender}',`,
      comment: ` comment = '${comment}',`,
      isMarried: ` is_married = '${isMarried}',`,
      groupId: ` group_id = ${groupId},`
    };

    const studentWhereQuery = ` where id = ${id}`;
    const returningQuery = ' returning *';

    const firstPart = ' with users_update as (update users set ';

    const secondPart = ' update students set ';

    let query = ' ';

    if (firstName || lastName || borntDate || regionId || districtId || phoneNumber) {
      query += firstPart;

      if (firstName) {
        query += userUpdateFields.firstName;
      }

      if (lastName) {
        query += userUpdateFields.lastName;
      }

      if (borntDate) {
        query += userUpdateFields.borntDate;
      }

      if (regionId) {
        query += userUpdateFields.regionId;
      }

      if (districtId) {
        query += userUpdateFields.districtId;
      }

      if (phoneNumber) {
        if (!/^998[123456789][012345789][0-9]{7}$/.test(String(phoneNumber))) {
          return new Error('This phone number invalid');
        }
        query += userUpdateFields.phoneNumber;
      }

      query = query.substring(0, query.length - 1);
      query += userWhereQuery;
    }

    if (comePlaceId || statusId || fatherFullName || gender || comment || isMarried || groupId) {
      query += secondPart;

      if (comePlaceId) {
        query += studentUpdateFilds.comePlaceId;
      }

      if (statusId) {
        query += studentUpdateFilds.statusId;
      }

      if (fatherFullName) {
        query += studentUpdateFilds.fatherFullName;
      }

      if (gender) {
        query += studentUpdateFilds.gender;
      }

      if (isMarried || isMarried === false) {
        query += studentUpdateFilds.isMarried;
      }

      if (comment) {
        query += studentUpdateFilds.comment;
      }

      if (groupId) {
        query += studentUpdateFilds.groupId;
      }

      query = query.substring(0, query.length - 1);
      query += studentWhereQuery;
      query += returningQuery;
    }

    return await pg(true, query);
  } catch (error) {
    return new Error(`students repository [updateStudent]:${error}`);
  }
}

async function getStudentById(studentId) {
  try {
    return await pg(
      true,
      `
    select * from students where id = $1 and is_active = 'true';
  `,
      studentId
    );
  } catch (error) {
    throw Error(`Students repository [getStudentById]:${error}`);
  }
}

async function getStudentByUserId(userId) {
  try {
    return await pg(
      true,
      `
    select * from students where user_id = $1 and is_active = 'true';
  `,
      userId
    );
  } catch (error) {
    throw Error(`Students repository [getStudentByUserId]:${error}`);
  }
}

async function deleteStudent(id) {
  try {
    return await pg(
      true,
      `
    update students set is_active = 'false' where id = $1 returning *;
  `,
      id
    );
  } catch (error) {
    throw Error(`Students repository [deleteStudent]:${error}`);
  }
}

async function getTeacherById(teacherId) {
  try {
    return await pg(
      true,
      `
    select * from teachers where id = $1 and status = 'teaching';
  `,
      teacherId
    );
  } catch (error) {
    throw Error(`Students repository [getTeacherById]:${error}`);
  }
}

async function getRoomById(roomId) {
  try {
    return await pg(
      true,
      `
    select * from rooms where id = $1 and is_active = true;
  `,
      roomId
    );
  } catch (error) {
    throw Error(`Students repository [getRoomById]:${error}`);
  }
}

async function insertStudent(args) {
  try {
    return await pg(
      true,
      `
        insert into students(
          discount,
          group_id,
          user_id,
          not_attended_lessons_and_stages
        ) values(
          $1, $2, $3, $4
        ) returning *;
      `,
      args.discount,
      args.groupId,
      args.userId,
      {
        stagesCount: args.passedStagesCount,
        lessonsCount: args.passedLessonsCount
      }
    );
  } catch (error) {
    throw Error(`Students repository [insertStudent]:${error}`);
  }
}

async function makeStudent(userId) {
  try {
    return await pg(
      true,
      `
    insert into students(
      discount,
      user_id
    ) values(
      $1, $2
    ) returning *;
  `,
      0,
      userId
    );
  } catch (error) {
    throw Error(`Students repository [makeStudent]:${error}`);
  }
}

async function isExistStudent(userId, groupId) {
  try {
    return await pg(
      true,
      `
    select * from students where is_active = 'true' and user_id = $1 and group_id = $2;
  `,
      userId,
      groupId
    );
  } catch (error) {
    throw Error(`Students repository [isExistStudent]:${error}`);
  }
}

const addStudentsByCandidates = (groupId, candidates) => {
  try {
    const add = `
      insert into students(group_id, user_id, discount) values($1, $2, $3);
    `;
    // eslint-disable-next-line camelcase
    candidates.forEach(async ({ user_id, discount }) => {
      await pg(true, add, groupId, user_id, discount);
    });
    return;
  } catch (error) {
    throw new Error(`[StudentsRepository]:[addStudentsByUserId]:${error}`);
  }
};

const findByGroupId = async (groupId) => {
  try {
    // prettir-ignore
    const find = "select * from students where group_id = $1 and is_active = 'true';";
    return await pg(false, find, groupId);
  } catch (error) {
    throw new Error(`[StudentsRepository]:[findByGroupId]:${error}`);
  }
};

async function getStudentsByUserId(userIds) {
  try {
    return await pg(
      false,
      `
    select * from students where user_id = ANY(ARRAY[${userIds}]) and is_active = 'true';
  `
    );
  } catch (error) {
    throw Error(`Students repository [getStudentsByUserId]:${error}`);
  }
}

async function getByUserIdAndGroupId(userId, groupId) {
  const query = `
    select * from students where user_id = $1 and group_id = $2;
  `;

  const data = await pg(true, query, userId, groupId);

  return data;
}

async function createStudent(
  id,
  statusId,
  fatherFullName,
  comment,
  gender,
  comePlaceId,
  isMarried,
  inviterUserId
) {
  try {
    return await pg(
      true,
      `
        insert into students(
          user_id,
          status_id,
          father_full_name,
          comment,
          gender,
          come_place_id,
          is_married,
          inviter_user_id,
          discount
        ) values(
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        ) returning *;
      `,
      id,
      statusId,
      fatherFullName,
      comment,
      gender,
      comePlaceId,
      isMarried,
      inviterUserId,
      0
    );
  } catch (error) {
    throw Error(`Students repository [createStudent]:${error}`);
  }
}

async function getCountOfStudents() {
  try {
    return await pg(
      true,
      `
        select count(*) from students where is_active = 'true' and (status_id <> 1 or status_id is null);
      `
    );
  } catch (error) {
    throw Error(`students repository [getCountOfStudents]:${error}`);
  }
}

async function updateStudentGroup(args) {
  try {
    return await pg(
      true,
      `
        update students set discount = $1, group_id = $2, not_attended_lessons_and_stages = $3 where user_id = $4 returning *;
      `,
      args.discount,
      args.groupId,
      {
        stagesCount: args.passedStagesCount,
        lessonsCount: args.passedLessonsCount
      },
      args.userId
    );
  } catch (error) {
    throw Error(`Students repository [updateStudentGroup]:${error}`);
  }
}

async function createNewStudent(
  id,
  statusId,
  fatherFullName,
  comment,
  gender,
  comePlaceId,
  isMarried,
  inviterUserId,
  discount,
  groupId,
  passedStagesCount,
  passedLessonsCount
) {
  try {
    return await pg(
      true,
      `
        insert into students(
          user_id,
          status_id,
          father_full_name,
          comment,
          gender,
          come_place_id,
          is_married,
          inviter_user_id,
          discount,
          group_id,
          not_attended_lessons_and_stages
        ) values(
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        ) returning *;
      `,
      id,
      statusId,
      fatherFullName,
      comment,
      gender,
      comePlaceId,
      isMarried,
      inviterUserId,
      discount,
      groupId,
      {
        stagesCount: passedStagesCount,
        lessonsCount: passedLessonsCount
      }
    );
  } catch (error) {
    throw Error(`Students repository [createNewStudent]:${error}`);
  }
}

async function findStudentsByIds(ids) {
  try {
    return await pg(
      false,
      `
        select * from students where id = ANY(ARRAY[${ids}]) and is_active = 'true';
    `
    );
  } catch (error) {
    throw Error(`students repository [findStudentsByIds]:${error}`);
  }
}

async function findArchivedStudent(id) {
  try {
    return await pg(
      true,
      `
        select * from students where id = $1 and is_active = 'archive';
      `,
      id
    );
  } catch (error) {
    throw Error(`students repository [findStudentsByIds]:${error}`);
  }
}

async function archiveStudents(ids) {
  try {
    return await pg(
      false,
      `
        update students set is_active = 'archive' where id = ANY(ARRAY[${ids}]) returning *;
      `
    );
  } catch (error) {
    throw Error(`students repository [archiveStudents]:${error}`);
  }
}

async function unArchiveStudent(id) {
  try {
    return await pg(
      true,
      `
        update students set is_active = 'true' where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`students repository [unArchiveStudent]:${error}`);
  }
}

async function getCountOfArchivedStudents() {
  try {
    return await pg(
      true,
      `
      select  count(*) from students where is_active = 'archive';
      `
    );
  } catch (error) {
    throw Error(`students repository [getCountOfArchivedStudents]:${error}`);
  }
}

async function getArchiveStudents(page, limit) {
  try {
    return await pg(
      false,
      `
              select
                  *
              from
                  students
              where
              is_active = 'archive'
              order by id desc
              offset ($1 - 1) * $2 fetch next $2 rows only;
          `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`students repository [getArchiveStudents]:${error}`);
  }
}

module.exports = {
  getByUserIdAndGroupId,
  findByGroupId,
  addStudentsByCandidates,
  getStudentCountByGroupId,
  getUserById,
  getGroupById,
  getStudentsCount,
  getStudentsByGroupId,
  updateStudent,
  getStudentById,
  deleteStudent,
  getTeacherById,
  getRoomById,
  insertStudent,
  isExistStudent,
  makeStudent,
  getStudentByUserId,
  getStudents,
  getStudentsByUserId,
  createStudent,
  getCountOfStudents,
  updateStudentGroup,
  createNewStudent,
  findStudentsByIds,
  archiveStudents,
  getCountOfArchivedStudents,
  getArchiveStudents,
  findArchivedStudent,
  unArchiveStudent
};
