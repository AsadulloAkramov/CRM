const pg = require('../utils/pg');

async function getRooms(page, limit, branchId, floor) {
  try {
    const whereQueryFields = {
      branchId: `and branch_id = ${branchId}`,
      floor: `and floor = ${floor}`
    };

    let query = 'select * from rooms where 1=1';

    if (branchId) {
      query += whereQueryFields.branchId;
    }

    if (floor) {
      query += whereQueryFields.floor;
    }

    const offsetQuery = ` and is_active = true order by id desc offset (${page} - 1) * ${limit} fetch next ${limit} rows only`;

    query += offsetQuery;

    return await pg(false, query);
  } catch (error) {
    throw Error(`Rooms repository [getRooms]:${error}`);
  }
}

async function getRoomsByBranchId(branchId, page, limit) {
  try {
    return await pg(
      false,
      `
        select * from rooms where is_active = true and branch_id = $1 order by id desc offset ($2 - 1) * $3 fetch next $3 rows only;
      `,
      branchId,
      page,
      limit
    );
  } catch (error) {
    throw Error(`Rooms repository [getRoomsByBranchId]:${error}`);
  }
}

async function getRoomsByFloor(floor, page, limit) {
  try {
    return await pg(
      false,
      `
        select * from rooms where is_active = true and floor = $1 order by id desc offset ($2 - 1) * $3 fetch next $3 rows only;
      `,
      floor,
      page,
      limit
    );
  } catch (error) {
    throw Error(`Rooms repository [getRoomsByBranchId]:${error}`);
  }
}

async function getRoomByName(name, branchId) {
  try {
    return await pg(
      true,
      `
        select * from rooms where name = $1 and branch_id = $2 and is_active = true;
      `,
      name,
      branchId
    );
  } catch (error) {
    throw Error(`Rooms repository [getRoomByName]:${error}`);
  }
}
async function insertRoom(name, branchId, capacity, floor) {
  try {
    return await pg(
      true,
      `
        insert into rooms(
          name,
          branch_id,
          capacity,
          floor
        ) values(
          $1, $2, $3, $4
        ) returning *;
      `,
      name,
      branchId,
      capacity,
      floor
    );
  } catch (error) {
    throw Error(`Rooms repository [insertRoom]:${error}`);
  }
}

async function getBranchById(branchId) {
  try {
    return await pg(
      true,
      `
        select * from branches where id = $1 and is_active = true;
      `,
      branchId
    );
  } catch (error) {
    throw Error(`Rooms repository [getBranchById]:${error}`);
  }
}

async function getRoomById(id) {
  try {
    return await pg(
      true,
      `
        select * from rooms where id = $1 and is_active = true;
      `,
      id
    );
  } catch (error) {
    throw Error(`Rooms repository [getRoomById]:${error}`);
  }
}

async function updateRoomCapacity(capacity, id) {
  try {
    return await pg(
      true,
      `
        update rooms set capacity = $1 where id = $2 returning *;
      `,
      capacity,
      id
    );
  } catch (error) {
    throw Error(`Rooms repository [updateRoomCapacity]:${error}`);
  }
}

async function updateRoomNameAndCapacityAndBranch(name, capacity, branchId, id, floor) {
  try {
    return await pg(
      true,
      `
        update rooms set name = $1, capacity = $2, branch_id = $3, floor = $5 where id = $4 returning *;
      `,
      name,
      capacity,
      branchId,
      id,
      floor
    );
  } catch (error) {
    throw Error(`Rooms repository [updateRoomNameAndCapacityAndBranch]:${error}`);
  }
}

async function deleteRoom(id) {
  try {
    return await pg(
      true,
      `
        update rooms set is_active = false where id = $1 returning *;
      `,
      id
    );
  } catch (error) {
    throw Error(`Rooms repository [deleteRoom]:${error}`);
  }
}

async function getGroupsCountByRoomId(id) {
  try {
    return await pg(
      true,
      `
        select count(id) from groups where status not in ('closed', 'deleted', 'queue') and room_id = $1;
      `,
      id
    );
  } catch (error) {
    throw Error(`Rooms repository [getGroupsCountByRoomId]:${error}`);
  }
}

async function getGroupsByRoomId(roomId) {
  try {
    return await pg(
      false,
      `
        select
          ct.time,
          ct.duration,
          ct.day
        from
          groups as g
        join
          courses as c on g.course_id = c.id
        where
          (g.status != 'queue' and g.status != 'canceled' and g.status != 'deleted')
          and g.room_id = $1;
      `,
      roomId
    );
  } catch (error) {
    throw Error(`Rooms repository [getGroupsByRoomId]:${error}`);
  }
}

async function calculateTime(startTime, duration) {
  try {
    return await pg(
      true,
      `
        select time '${startTime}' + interval '${duration}' as end;
      `
    );
  } catch (error) {
    throw Error(`Rooms repository [calculateTime]:${error}`);
  }
}

module.exports = {
  getRooms,
  getRoomsByBranchId,
  getBranchById,
  getRoomByName,
  insertRoom,
  getRoomById,
  updateRoomCapacity,
  updateRoomNameAndCapacityAndBranch,
  deleteRoom,
  getGroupsCountByRoomId,
  getGroupsByRoomId,
  calculateTime,
  getRoomsByFloor
};
