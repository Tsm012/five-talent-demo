const MongoClient = require('mongodb').MongoClient;

export default class HomesRepository {
    constructor(connectionString) {
        this.connectionString = connectionString;
    }

    async GetHomes() {

        var client = new MongoClient(this.connectionString, { useNewUrlParser: true });

        await client.connect();

        let collection = client.db("five-talent-realestate").collection("homes");

        let homes = await collection.find({}).toArray();

        homes = JSON.parse(JSON.stringify(homes));

        await client.close();

        return homes;

    };

    async GetHome(MLSNumber) {

        var client = new MongoClient(this.connectionString, { useNewUrlParser: true });

        await client.connect();

        let collection = client.db("five-talent-realestate").collection("homes");

        var listing = await collection.findOne({ MLSNumber: MLSNumber });

        await client.close();

        return listing;

    };

    async CreateHome(home) {

        var client = new MongoClient(this.connectionString, { useNewUrlParser: true });

        await client.connect();

        let collection = client.db("five-talent-realestate").collection("homes");

        await collection.insertOne(home);

        await client.close();

    };

    async UpdateHome(home) {

        var client = new MongoClient(this.connectionString, { useNewUrlParser: true });

        await client.connect();

        let collection = client.db("five-talent-realestate").collection("homes");

        await collection.update(
            { "_id": home._id },
            {
                $set: {
                    MLSNumber: home.MLSNumber,
                    Street1: home.Street1,
                    Street2: home.Street2,
                    City: home.City,
                    State: home.State,
                    ZipCode: home.ZipCode,
                    Neighborhood: home.Neighborhood,
                    SalesPrice: home.SalesPrice,
                    DateListed: home.DateListed,
                    Bedrooms: home.Bedrooms,
                    Photos: home.Photos,
                    Bathrooms: home.Bathrooms,
                    GarageSize: home.GarageSize,
                    SquareFeet: home.SquareFeet,
                    LotSize: home.LotSize,
                    Description: home.Description
                }
            },
            { multi: true }
        );

        await client.close();
    };

    async DeleteHome(home) {

        var client = new MongoClient(this.connectionString, { useNewUrlParser: true });

        await client.connect();

        const collection = client.db("five-talent-realestate").collection("homes");

        await collection.deleteOne({ MLSNumber: home.MLSNumber });

        await client.close();

    };
}