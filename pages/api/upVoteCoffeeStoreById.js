import { getMinifiedRecords, table } from "../../lib/airtable";

const upVoteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;

      if (id) {
        const findCoffeeStoreRecord = await table
          .select({
            filterByFormula: `{id} = "${id}"`,
          })
          .firstPage();

        if (findCoffeeStoreRecord.length !== 0) {
          const records = getMinifiedRecords(findCoffeeStoreRecord);

          const record = records[0];

          const calculateVote = parseInt(record.vote) + 1;

          const updateVote = await table.update([
            {
              id: record.recordId,
              fields: {
                vote: calculateVote,
              },
            },
          ]);

          const minifiedUpdateReport = getMinifiedRecords(updateVote);

          return res.status(200).json({
            message: "You updated this record successfully",
            records: minifiedUpdateReport,
          });
        } else {
          return res.status(200).json({ message: "id does not exist", id });
        }
      } else {
        res.status(400).json({ message: "id is missing" });
      }
    } catch (error) {
      res.status(500).json({ message: "Oh no! Something went wrong", error });
    }
  }
};

export default upVoteCoffeeStoreById;
