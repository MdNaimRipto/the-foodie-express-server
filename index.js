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
        const reviewsCollection = client.db("theFoodieExpress").collection("reviews")
        app.get("/services", async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query).sort({ _id: -1 })
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
        app.get("/allServices", async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query).sort({ _id: -1 })
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get("/serviceDetails/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const serviceDetails = await servicesCollection.findOne(query)
            res.send(serviceDetails)
        })
        app.post("/addService", async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service)
            res.send(result)
        })
        // Reviews Operations
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })
        app.get("/reviews", async (req, res) => {
            let query = {};
            if (req.query.serviceId) {
                query = { serviceId: req.query.serviceId }
            }
            const cursor = reviewsCollection.find(query).sort({ _id: -1 })
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
        app.get("/myReviews", async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
                console.log(query)
            }
            const cursor = reviewsCollection.find(query)
            const myReviews = await cursor.toArray()
            res.send(myReviews)
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