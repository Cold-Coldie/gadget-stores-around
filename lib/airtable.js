const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const table = base("coffee-stores");

const getMinifiedRecord = (record) => {
  return { recordId: record.getId(), ...record.fields };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => {
    return getMinifiedRecord(record);
  });
};

export { table, getMinifiedRecords };
