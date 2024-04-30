const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://wonderLoom:x9hs5cYBghZu3wbb@cluster0.0sxdnca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristSpotsCollection = client.db("wanderLoomDB").collection("touristSpots")
    const countriesTourCollection = client.db("wanderLoomDB").collection("countriesTour")
    const addTouristSpotCollection = client.db("wanderLoomDB").collection("addTouristSpot")
    const countryWiseCollection = client.db("wanderLoomDB").collection("countryWiseSpot")


    app.get('/tourist-spots', async(req, res) => {
      const cursor = touristSpotsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/tourist-spots/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await touristSpotsCollection.findOne(query)
      res.send(result)
    })


    app.get('/countries-tour', async(req, res) => {
      const cursor = countriesTourCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/countries-tour/:id', async(req, res)=> {
      const id = req.params.id;
      console.log(id)
      const query = {_id : new ObjectId(id)}
      const result = await countriesTourCollection.findOne(query)
      res.send(result)
    })



    app.get('/add-tourist-spot', async(req, res) => {
      const cursor = addTouristSpotCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })
    
    app.get('/add-tourist-spot/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await addTouristSpotCollection.findOne(query)
      res.send(result)
    })

    app.post('/add-tourist-spot', async(req, res) => {
      const body = req.body;
      const result = await addTouristSpotCollection.insertOne(body)
      res.send(result)
    })

    app.put('/add-tourist-spot/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const options = {upsert : true}
      const updatedSpot = req.body;
      console.log(updatedSpot)
      const spot = {
                    $set: {
                    userName: updatedSpot.userName, 
                    userEmail: updatedSpot.userEmail, 
                    touristSpot: updatedSpot.touristSpot, 
                    country: updatedSpot.country, 
                    avarageCost: updatedSpot.avarageCost, 
                    seasonality: updatedSpot.seasonality, 
                    travelTime: updatedSpot.travelTime,
                    image : updatedSpot.image,
                    totalVisitors : updatedSpot.totalVisitors,
                    location : updatedSpot.location,
                    description : updatedSpot.description
                }
    }
    const result = await addTouristSpotCollection.updateOne(filter, spot, options);
    res.send(result);
    
})


    app.delete('/add-tourist-spot/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await addTouristSpotCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send(`Tourism Management Server`)
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})