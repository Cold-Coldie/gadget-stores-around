import { getMinifiedRecords, table } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const findCoffeeStoreRecord = await table
        .select({
          filterByFormula: `{id} = "${id}"`,
        })
        .firstPage();

      if (findCoffeeStoreRecord.length !== 0) {
        const records = getMinifiedRecords(findCoffeeStoreRecord);

        return res
          .status(200)
          .json({ message: "Data with ID already exists", records });
      } else {
        return res.status(200).json({ message: "ID could not be found" });
      }
    } else {
      res.status(400).json({ message: "id is missing" });
    }
  } catch (error) {
    res.status(500).json({ message: "Oh no! Something went wrong", error });
  }
};

export default getCoffeeStoreById;
