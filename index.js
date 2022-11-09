const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ltefwui.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        const servicesCollection = client.db("theFoodieExpress").collection("services")
        app.get("/services", async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
        app.get("/allServices", async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get("/serviceDetails/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const serviceDetails = await servicesCollection.findOne(query)
            res.send(serviceDetails)
        })
    }
    finally {

    }
}
run().catch(err => console.error(err))

app.get("/", (req, res) => {
    res.send("The Foodie Express Server is running successfully")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})