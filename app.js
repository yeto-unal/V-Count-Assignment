//Importing necessary libraries
const {MongoClient} = require('mongodb');
const express = require('express');
require('dotenv/config');
const app = express();

//Since assignment tells us to be confidential, we need to specify the uri like this
const uri = process.env.DATABASE_CONNECTION;

async function main() {
	const client = new MongoClient(uri);
    var findResult;

    //Connecting MongoDB database as mentioned on assignment sheet
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(process.env.DB_TABLE_NAME);

        findResult = await collection.find({}).toArray();
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    //Creating API for GET requests and filtering specific directory
    app.get('/countries', (req, res) => {
        //Checks if user sent a parameter
        if(req.query.region == null)
            //If user does not send parameter, list all countries
            res.send(findResult);
        else
            //If user sent region parameter, filters all the countries and lists the countries in specified region
            res.send(findResult.filter(country => country.region == req.query.region));    
    });

    //Start listening on port 3000
    app.listen(3000);
}

main().catch(console.error);