const { table, getMinifiedRecords } = require("../../lib/airtable");

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, region, vote, imageUrl } = req.body;

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
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  region,
                  vote,
                  imageUrl,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecords);

            res.status(201).json({ message: "Created succesfully", records });
          } else {
            res.status(400).json({ message: "name is missing" });
          }
        }
      } else {
        res.status(400).json({ message: "id is missing" });
      }
    } catch (error) {
      console.error({ message: "Oh no! Something went wrong", error });
      res.status(500).json({ message: "Oh no! Something went wrong", error });
    }
  }
};

export default createCoffeeStore;
