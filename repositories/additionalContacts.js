const pg = require('../utils/pg');

async function getAdditionalContacts() {
  try {
    return await pg(
      false,
      `select
      id,
      user_id,
      fullname,
      phone_number,
      contact_author
    from
    additional_contacts
    order by
      id desc;`
    );
  } catch (error) {
    throw Error(`AdditionalContacts repository [getAdditionalContacts]:${error}`);
  }
}

async function insertAdditionalContact(fullName, userId, phoneNumber, contactAuthor) {
  try {
    return await pg(
      true,
      'insert into additional_contacts(fullname,user_id,phone_number,contact_author) values($1,$2,$3,$4) returning *;',
      fullName,
      userId,
      phoneNumber,
      contactAuthor
    );
  } catch (error) {
    throw Error(`AdditionalContacts repository [insertAdditionalContact]:${error}`);
  }
}

async function getAdditionalContactById(AdditionalContactId) {
  try {
    return await pg(true, 'select * from additional_contacts where id = $1;', AdditionalContactId);
  } catch (error) {
    throw Error(`AdditionalContacts repository [getAdditionalContactById]:${error}`);
  }
}

async function getAdditionalContactByPhoneNumber(PhoneNumber) {
  try {
    return await pg(
      true,
      'select * from additional_contacts where phone_number = $1;',
      PhoneNumber
    );
  } catch (error) {
    throw Error(`AdditionalContacts repository [getAdditionalContactById]:${error}`);
  }
}

async function getAdditionalContactByUserId(userId) {
  try {
    return await pg(
      false,
      `
      select 
        ac.id, 
        ac.user_id, 
        ac.fullname, 
        ac.phone_number, 
        ac.contact_author  
      from additional_contacts as ac 
      where user_id = $1;
      `,
      userId
    );
  } catch (error) {
    throw Error(`AdditionalContacts repository [getAdditionalContactByUserId]:${error}`);
  }
}

async function updateAdditionalContact(id, fullName, userId, phoneNumber, contactAuthor) {
  try {
    const variables = [id];
    let count = 2;
    const options = {
      fullName: ',fullname=$',
      userId: ',user_id=$',
      phoneNumber: ',phone_number=$',
      contactAuthor: ',contact_author=$',
      where: ' where id=$1 returning *'
    };
    let queryGenerator = `
          update
            additional_contacts
          set
            id=$1
    `;
    if (contactAuthor) {
      queryGenerator += options.contactAuthor + count;
      count += 1;
      variables.push(contactAuthor);
    }
    if (fullName) {
      queryGenerator += options.fullName + count;
      count += 1;
      variables.push(fullName);
    }
    if (userId) {
      queryGenerator += options.userId + count;
      count += 1;
      variables.push(userId);
    }
    if (phoneNumber) {
      queryGenerator += options.phoneNumber + count;
      count += 1;
      variables.push(phoneNumber);
    }
    queryGenerator += options.where;
    return await pg(true, queryGenerator, ...variables);
  } catch (error) {
    throw Error(`AdditionalContacts repository [updateAdditionalContact]:${error}`);
  }
}

async function deleteAdditionalContact(id) {
  try {
    return await pg(true, 'delete from additional_contacts where id = $1 returning *;', id);
  } catch (error) {
    throw Error(`AdditionalContacts repository [deleteAdditionalContact]:${error}`);
  }
}

async function deleteAdditionalContactByUserId(userId, contactAuthorId, phoneNumber, fullName) {
  try {
    return await pg(
      true,
      'delete from additional_contacts where user_id = $1 and contact_author = $2 and phone_number = $3 and fullname = $4  returning *;',
      userId,
      contactAuthorId,
      phoneNumber,
      fullName
    );
  } catch (error) {
    throw Error(`AdditionalContacts repository [deleteAdditionalContact]:${error}`);
  }
}

module.exports = {
  getAdditionalContacts,
  insertAdditionalContact,
  getAdditionalContactById,
  updateAdditionalContact,
  deleteAdditionalContact,
  getAdditionalContactByUserId,
  deleteAdditionalContactByUserId,
  getAdditionalContactByPhoneNumber
};
