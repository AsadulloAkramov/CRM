const pg = require('../utils/pg');

async function createMessageSample(title, text) {
  try {
    return await pg(
      true,
      `
      insert into message_samples(title,text) values($1,$2) returning *;
    `,
      title,
      text
    );
  } catch (error) {
    throw Error(`modules repository [createMessageSample]:${error}`);
  }
}

async function getMessageSampleByTitleAndByText(title, text) {
  try {
    return await pg(
      true,
      `
        select * from message_samples where title = $1 and text = $2;
      `,
      title,
      text
    );
  } catch (error) {
    throw Error(`modules repository [getMessageSampleByTitleAndByText]:${error}`);
  }
}

async function getMessageSamples() {
  try {
    return await pg(
      false,
      `
          select * from message_samples order by id desc;
        `
    );
  } catch (error) {
    throw Error(`modules repository [getMessageSamples]:${error}`);
  }
}

async function getMessageSampleById(id) {
  try {
    return await pg(
      true,
      `
          select * from message_samples where id = $1;
        `,
      id
    );
  } catch (error) {
    throw Error(`modules repository [getMessageSampleById]:${error}`);
  }
}

async function updateMessageSample(title, text, id) {
  try {
    return await pg(
      true,
      `
        update message_samples set title = $1, text = $2 where id = $3 returning * ;
      `,
      title,
      text,
      id
    );
  } catch (error) {
    throw Error(`modules repository [updateMessageSample]:${error}`);
  }
}

async function deleteMessageSample(id) {
  try {
    return await pg(
      true,
      `
          delete from message_samples where id = $1 returning *;
        `,
      id
    );
  } catch (error) {
    throw Error(`modules repository [deleteMessageSample]:${error}`);
  }
}

module.exports = {
  createMessageSample,
  getMessageSampleByTitleAndByText,
  getMessageSampleById,
  updateMessageSample,
  deleteMessageSample,
  getMessageSamples
};
