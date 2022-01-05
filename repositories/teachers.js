const pg = require('../utils/pg');

async function getTeachers(page, limit) {
  try {
    return await pg(
      false,
      `
    select * from teachers where status = 'teaching' order by id desc offset ($1 - 1) * $2 fetch next $2 rows only;
  `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`Teachers repository [getTeachers]:${error}`);
  }
}

async function getArchiveTeachers(page, limit) {
  try {
    return await pg(
      false,
      `
    select * from teachers where status = 'archived' order by id desc offset ($1 - 1) * $2 fetch next $2 rows only;
  `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`Teachers repository [getTeachers]:${error}`);
  }
}

async function getUserById(userId) {
  try {
    return await pg(
      true,
      `
  select * from users where id = $1 and is_active;
    `,
      userId
    );
  } catch (error) {
    throw Error(`Teachers repository [getUserById]:${error}`);
  }
}

async function getTeacherByUserId(userId) {
  try {
    return await pg(
      true,
      "select * from teachers where user_id = $1 and status = 'teaching';",
      userId
    );
  } catch (error) {
    throw Error(`Teachers repository [getTeacherByUserId]:${error}`);
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
    throw Error(`Teachers repository [getTeacherById]:${error}`);
  }
}

async function insertTeacher(userId) {
  try {
    return await pg(
      true,
      `
        insert into teachers(
          user_id
        ) values(
          $1
        ) returning *;
      `,
      userId
    );
  } catch (error) {
    throw Error(`Teachers repository [insertTeacher]:${error}`);
  }
}

async function deleteTeacher(teacherId) {
  try {
    return await pg(
      true,
      `
    update teachers set status = 'archived' where id = $1 returning *;
  `,
      teacherId
    );
  } catch (error) {
    throw Error(`Teachers repository [deleteTeacher]:${error}`);
  }
}

async function getTeacherGroups(teacherId) {
  try {
    return await pg(
      false,
      `
        select * from groups where status not in ('closed', 'deleted', 'queue') and teacher_id = $1;
      `,
      teacherId
    );
  } catch (error) {
    throw Error(`Teachers repository [getTeacherGroups]:${error}`);
  }
}

async function getTeacherCategories() {
  try {
    return await pg(
      false,
      `
        select id, name, created_at, category_id from teacher_categories;
      `
    );
  } catch (error) {
    throw Error(`Teachers repository [getTeacherCategory]:${error}`);
  }
}

async function insertTeacherCategory(name) {
  try {
    return await pg(
      true,
      `
        insert into teacher_categories (name) values ($1) returning  id, name, created_at;
      `,
      name
    );
  } catch (error) {
    throw Error(`Teachers repository [insertTeacherCategory]:${error}`);
  }
}

async function updateTeacherCategory(name, id) {
  try {
    return await pg(
      true,
      `
        update teacher_categories set name=$1 where id = $2 returning  id, name, created_at;
      `,
      name,
      id
    );
  } catch (error) {
    throw Error(`Teachers repository [updateTeacherCategory]:${error}`);
  }
}

async function updateTeacher(args, userId) {
  try {
    const {
      id,
      firstName,
      lastName,
      phoneNumber,
      regionId,
      districtId,
      borntDate,
      address,
      fatherFullName,
      gender,
      comment
    } = args;

    const userUpdateFields = {
      firstName: ` first_name = '${firstName}',`,
      lastName: ` last_name = '${lastName}',`,
      borntDate: ` bornt_date = '${borntDate}',`,
      regionId: ` region_id = '${regionId}',`,
      districtId: ` district_id = '${districtId}',`,
      phoneNumber: ` phone_number = '${phoneNumber}',`
    };

    const userWhereQuery = ` where id = ${userId} )`;

    const teacherUpdateFilds = {
      fatherFullName: ` father_full_name = '${fatherFullName}',`,
      gender: ` gender = '${gender}',`,
      comment: ` comment = '${comment}',`,
      address: ` address = '${address}',`
    };

    const teacherWhereQuery = ` where id = ${id}`;
    const returningQuery = ' returning *';

    const firstPart = ' with users_update as (update users set ';

    const secondPart = ' update teachers set ';

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

    if (fatherFullName || gender || comment || address) {
      query += secondPart;

      if (fatherFullName) {
        query += teacherUpdateFilds.fatherFullName;
      }

      if (gender) {
        query += teacherUpdateFilds.gender;
      }

      if (address) {
        query += teacherUpdateFilds.address;
      }

      if (comment) {
        query += teacherUpdateFilds.comment;
      }

      query = query.substring(0, query.length - 1);
      query += teacherWhereQuery;
      query += returningQuery;
    }

    return await pg(true, query);
  } catch (error) {
    throw Error(`Teachers repository [updateTeacher]:${error}`);
  }
}

async function deleteTeacherCategory(id) {
  try {
    return await pg(
      true,
      `
        delete from teacher_categories where id = $1 returning  id, name, created_at;
      `,
      id
    );
  } catch (error) {
    throw Error(`Teachers repository [deleteTeacherCategory]:${error}`);
  }
}

async function getTeacherCategoryById(teacherCategoryId) {
  try {
    return await pg(
      true,
      `
  select id, name, created_at from teacher_categories where id = $1;
`,
      teacherCategoryId
    );
  } catch (error) {
    throw Error(`Teachers repository [getTeacherCategoryById]:${error}`);
  }
}

async function getTeacherCategoryByName(name) {
  try {
    return await pg(
      true,
      `
  select name from teacher_categories where name = $1;
`,
      name
    );
  } catch (error) {
    throw Error(`Teachers repository [getTeacherCategoryByName]:${error}`);
  }
}

module.exports = {
  getTeachers,
  getUserById,
  getTeacherById,
  getTeacherByUserId,
  insertTeacher,
  deleteTeacher,
  getTeacherGroups,
  getTeacherCategories,
  insertTeacherCategory,
  updateTeacherCategory,
  deleteTeacherCategory,
  getTeacherCategoryById,
  getTeacherCategoryByName,
  updateTeacher,
  getArchiveTeachers
};
