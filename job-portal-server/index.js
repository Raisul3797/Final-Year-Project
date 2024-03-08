const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000;
require('dotenv').config();
console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)

// middleware
app.use(express.json())
app.use(cors())

// Username: raisul153797
// Password :sXe09V7Ae5OihiPM
// IP:116.204.148.16/32



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://raisul153797:sXe09V7Ae5OihiPM@job-portal-demo.i3j7uam.mongodb.net/?retryWrites=true&w=majority&appName=job-portal-demo";

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

    // Create Database
    const db = client.db("JobHuntBD");
    const jobsCollection = db.collection("demoJobs");

    // Post a job
    app.post("/post-job", async(req, res) => {
      const body = req.body;
      body.createAt = new Date();

      const result = await jobsCollection.insertOne(body);
      if(result.insertedId){
        return res.status(200).send(result);
        }else{
          return res.status(404).send({
            message: "Can't insert! Try again later.",
            status: false
          })
        }
    })

    // Get alljobs
    app.get("/all-jobs", async(req, res) => {
      const jobs = await jobsCollection.find({}).toArray()
      res.send(jobs);
    })

    // Get jobs by email
    app.get("/myJobs/:email", async(req, res) => {
      // console.log(req.params.email)
      const jobs = await jobsCollection.find({postedBy : req.params.email}).toArray();
      res.send(jobs)
    })

    // delete a job
    app.delete("/job/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await jobsCollection.deleteOne(filter);
      res.send(result);
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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})