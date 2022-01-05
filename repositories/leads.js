/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
const pg = require('../utils/pg');

async function findLeadById(id) {
  try {
    return await pg(
      true,
      `
        select * from leads where id = $1 and is_active = 'true';
    `,
      id
    );
  } catch (error) {
    throw Error(`leads repository [findLeadById]:${error}`);
  }
}

async function findLeadByUserId(userId) {
  try {
    return await pg(
      true,
      `
        select * from leads where user_id = $1 and is_active = 'true';
    `,
      userId
    );
  } catch (error) {
    throw Error(`leads repository [findLeadById]:${error}`);
  }
}

async function getLeads(params) {
  try {
    // prettier-ignore
    const {
      regionId, comePlaceId, statusId, inviterUserId, page = 1, limit = 15
    } = params;

    const whereFields = {
      regionId: ` and r.id = ${regionId} `,
      comePlaceId: ` and l.come_place_id = ${comePlaceId} `,
      inviterUserId: ` and l.inviter_user_id = '${inviterUserId}' `,
      statusId: ` and l.status_id = ${statusId}`
    };

    let selectQuery = `
        SELECT
          l.id,
          l.created_at,
          l.user_id,
          l.come_place_id,
          l.status_id,
          l.comment,
          l.is_active,
          l.inviter_user_id,
          l.gender,
          l.father_full_name,
          l.additional_phone_number,
          COUNT(l.id)
        FROM
          leads as l
        FULL OUTER JOIN
          users as u on u.id = l.user_id
        FULL OUTER JOIN
          regions as r on r.id = u.region_id
        WHERE
          1=1
    `;

    let whereQuery = " and l.is_active = 'true'  and (l.status_id <> 1 or l.status_id is null)";

    Object.keys(whereFields).forEach((key) => {
      if (params[key]) {
        whereQuery += `${whereFields[key]}`;
      }
    });

    selectQuery += whereQuery;

    const offset =
      ' group by l.id order by l.id desc offset ($1 - 1) * $2 fetch next $2 rows only;';

    selectQuery += offset;
    return await pg(false, selectQuery, page, limit);
  } catch (error) {
    throw Error(`leads repository [getLeads]:${error}`);
  }
}

async function insertLead(
  userId,
  comePlaceId,
  fatherFullName,
  comment,
  gender,
  statusId,
  additionalPhoneNumber,
  inviterUserId
) {
  try {
    return await pg(
      true,
      `
        insert into leads(user_id,come_place_id,father_full_name,comment,gender,status_id,additional_phone_number,inviter_user_id) values($1,$2,$3,$4,$5,$6,$7,$8) returning *;
      `,
      userId,
      comePlaceId,
      fatherFullName,
      comment,
      gender,
      statusId,
      additionalPhoneNumber,
      inviterUserId
    );
  } catch (error) {
    throw Error(`leads repository [insertLeadsComePlace]:${error}`);
  }
}

async function updateLead(args, user_id) {
  try {
    const userUpdateFields = {
      firstName: ` first_name = '${args.firstName}',`,
      lastName: ` last_name = '${args.lastName}',`,
      borntDate: ` bornt_date = '${args.borntDate}',`,
      regionId: ` region_id = '${args.regionId}',`,
      districtId: ` district_id = '${args.districtId}',`,
      phoneNumber: ` phone_number = '${args.phoneNumber}',`
    };

    const userWhereQuery = ` where id = ${user_id} )`;

    const leadUpdateFilds = {
      comePlaceId: ` come_place_id = '${args.comePlaceId}',`,
      statusId: ` status_id = '${args.statusId}',`,
      fatherFullName: ` father_full_name = '${args.fatherFullName}',`,
      gender: ` gender = '${args.gender}',`,
      comment: ` comment = '${args.comment}',`,
      additionalPhoneNumber: ` additional_phone_number = '${args.additionalPhoneNumber}',`
    };

    const leadWhereQuery = ` where id = ${args.leadId}`;
    const returningQuery = ' returning *';

    const firstPart = ' with users_update as (update users set ';

    const secondPart = ' update leads set ';

    let query = ' ';

    if (
      args.firstName ||
      args.lastName ||
      args.borntDate ||
      args.regionId ||
      args.districtId ||
      args.phoneNumber
    ) {
      query += firstPart;

      if (args.firstName) {
        query += userUpdateFields.firstName;
      }

      if (args.lastName) {
        query += userUpdateFields.lastName;
      }

      if (args.borntDate) {
        query += userUpdateFields.borntDate;
      }

      if (args.regionId) {
        query += userUpdateFields.regionId;
      }

      if (args.districtId) {
        query += userUpdateFields.districtId;
      }

      if (args.phoneNumber) {
        if (!/^998[123456789][012345789][0-9]{7}$/.test(String(args.phoneNumber))) {
          return new Error('This phone number invalid');
        }
        query += userUpdateFields.phoneNumber;
      }

      query = query.substring(0, query.length - 1);
      query += userWhereQuery;
    }

    if (
      args.comePlaceId ||
      args.statusId ||
      args.fatherFullName ||
      args.gender ||
      args.comment ||
      args.additionalPhoneNumber
    ) {
      query += secondPart;

      if (args.comePlaceId) {
        query += leadUpdateFilds.comePlaceId;
      }

      if (args.statusId) {
        query += leadUpdateFilds.statusId;
      }

      if (args.fatherFullName) {
        query += leadUpdateFilds.fatherFullName;
      }

      if (args.gender) {
        query += leadUpdateFilds.gender;
      }

      if (args.comment) {
        query += leadUpdateFilds.comment;
      }

      if (args.additionalPhoneNumber) {
        query += leadUpdateFilds.additionalPhoneNumber;
      }

      query = query.substring(0, query.length - 1);
      query += leadWhereQuery;
      query += returningQuery;
    }

    return await pg(true, query);
  } catch (error) {
    throw Error(`leads repository [updateLead]:${error}`);
  }
}

async function insertLeadAdditionalPhoneNumber(additionalPhoneNumber, leadId) {
  try {
    const updateQuery = 'update leads set additional_phone_number = $1 where id = $2 returning * ';

    return await pg(true, updateQuery, additionalPhoneNumber, leadId);
  } catch (error) {
    throw Error(`leads repository [updateLead]:${error}`);
  }
}

async function deleteLeads(ids) {
  try {
    return await pg(
      false,
      `
      update leads set is_active = 'false' where id = ANY(ARRAY[${ids}]) returning *;
    `
    );
  } catch (error) {
    throw Error(`leads repository [deleteLead]:${error}`);
  }
}

async function archiveLead(ids) {
  try {
    return await pg(
      false,
      `
        update leads set is_active = 'archive' where id = ANY(ARRAY[${ids}]) returning *;
      `
    );
  } catch (error) {
    throw Error(`leads repository [archiveLead]:${error}`);
  }
}

async function unArchiveLead(id) {
  try {
    return await pg(
      true,
      `
        update leads set is_active = 'true' where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`leads repository [unArchiveLead]:${error}`);
  }
}

async function findArchivedLead(id) {
  try {
    return await pg(
      true,
      `
        select * from leads where id = $1 and is_active = 'archive';
      `,
      id
    );
  } catch (error) {
    throw Error(`leads repository [findArchivedLead]:${error}`);
  }
}

async function getLeadByUserId(userId) {
  try {
    return await pg(
      true,
      `
        select
            *
        from
            leads
        where
            user_id = $1
        and is_active = 'true';
      `,
      userId
    );
  } catch (error) {
    throw Error(`leads repository [getLeadByUserIdAndComePlaceIdAndInviterUserId]:${error}`);
  }
}

async function getArchive(page, limit) {
  try {
    return await pg(
      false,
      `
              select
                  *
              from
                  leads
              where
              is_active = 'archive'
              order by id desc
              offset ($1 - 1) * $2 fetch next $2 rows only;
          `,
      page,
      limit
    );
  } catch (error) {
    throw Error(`leads repository [getArchive]:${error}`);
  }
}

async function getCountOfLeads() {
  try {
    return await pg(
      true,
      `
        select count(*) from leads where is_active = 'true' and (status_id <> 1 or status_id is null);
      `
    );
  } catch (error) {
    throw Error(`leads repository [getCountOfLeads]:${error}`);
  }
}

async function getCountOfArchivedLeads() {
  try {
    return await pg(
      true,
      `
      select  count(*) from leads where is_active = 'archive';
      `
    );
  } catch (error) {
    throw Error(`leads repository [getCountOfArchivedLeads]:${error}`);
  }
}

async function findLeadByFullName(firstName, lastName) {
  try {
    return await pg(
      true,
      `
        SELECT
          u.first_name,
          u.last_name
        FROM
          leads as l
        JOIN users as u on u.id = l.user_id
        WHERE
          first_name = $1
        AND
          last_name = $2
    `,
      firstName,
      lastName
    );
  } catch (error) {
    throw Error(`leads repository [findLeadByFullName]:${error}`);
  }
}

async function findLeadsById(ids) {
  try {
    return await pg(
      false,
      `
        select * from leads where id = ANY(ARRAY[${ids}]) and is_active = 'true';
    `
    );
  } catch (error) {
    throw Error(`leads repository [findLeadsById]:${error}`);
  }
}

async function findUserByLeadId(leadId) {
  try {
    return await pg(
      true,
      `
        select * from leads where id = $1 and is_active = 'true';
    `,
      leadId
    );
  } catch (error) {
    throw Error(`leads repository [findUserByLeadId]:${error}`);
  }
}

async function deleteLeadAdditionalPhoneNumber(leadId) {
  try {
    const updateQuery =
      'update leads set additional_phone_number = null where id = $1 returning * ';

    return await pg(true, updateQuery, leadId);
  } catch (error) {
    throw Error(`leads repository [deleteLeadAdditionalPhoneNumber]:${error}`);
  }
}

async function findAdditionalContactLeadById(id) {
  try {
    return await pg(
      false,
      `
      select ac.*
      from leads as l
      join additional_contacts as ac on ac.user_id = l.user_id
      where l.id = $1 and l.is_active = 'true';      
    `,
      id
    );
  } catch (error) {
    throw Error(`leads repository [findAdditionalContactLeadById]:${error}`);
  }
}

async function findUsersByLeadsId(ids) {
  try {
    return await pg(
      false,
      `
        select user_id from leads where id = ANY(ARRAY[${ids}]) and is_active = 'true';
    `
    );
  } catch (error) {
    throw Error(`leads repository [findUserByLeadId]:${error}`);
  }
}

module.exports = {
  findLeadById,
  getLeads,
  insertLead,
  updateLead,
  getLeadByUserId,
  getArchive,
  getCountOfLeads,
  getCountOfArchivedLeads,
  findLeadByUserId,
  deleteLeads,
  findLeadByFullName,
  archiveLead,
  findLeadsById,
  insertLeadAdditionalPhoneNumber,
  findUserByLeadId,
  deleteLeadAdditionalPhoneNumber,
  findAdditionalContactLeadById,
  findUsersByLeadsId,
  unArchiveLead,
  findArchivedLead
};
