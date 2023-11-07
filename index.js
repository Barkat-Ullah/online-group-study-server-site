const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { ObjectId } = require('mongodb');

//  MONGODB DATABASE USER PASSWORD
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6aqk9ji.mongodb.net/?retryWrites=true&w=majority`;

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
    const assignmentCollection = client.db('assignDB').collection('assignments')
    const quizCollection = client.db('assignDB').collection('quiz')


    app.get('/quiz', async(req, res) => {
        const result = await quizCollection.find().toArray();
         res.send(result);
    })

    app.post('/quiz', async(req, res) => {
        const quiz = req.body;
        console.log(quiz);
        const result = await quizCollection.insertOne(quiz)
        res.send(result)
    })

    app.get('/quiz/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = {
          _id: new ObjectId(id),
        };
        const result = await quizCollection.findOne(query);
        console.log(result);
        res.send(result);
      });


    app.get('/assignments', async(req, res) => {
        const result = await assignmentCollection.find().toArray();
         res.send(result);
    })

    // http://localhost:5000/assignments?level=easy

    // http://localhost:5000/assignments?page=1&limit=6

    // app.get('/assignments', async(req, res) => {

    //     let queryObj = {}

    //     const level = req.query.level

    //     const page = Number(req.query.page);
    //     const limit = Number(req.query.page);
    //     const skip = (page - 1)* limit


    //     if(level){
    //         queryObj.level = level
    //     }

    //     const result = await assignmentCollection.find(queryObj).skip(skip).limit(limit).toArray();

    //     const total = await assignmentCollection.countDocuments()
    //      res.send({
    //         total,
    //         result
    //      });
    // })


    app.get('/assignments/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = {
          _id: new ObjectId(id),
        };
        const result = await assignmentCollection.findOne(query);
        console.log(result);
        res.send(result);
      });

    app.post('/assignments', async(req, res) => {
        const assignment = req.body;
        console.log(assignment);
        const result = await assignmentCollection.insertOne(assignment)
        console.log(result);
        res.send(result)
    })

    app.delete("/assignments/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await assignmentCollection.deleteOne(query);
        res.send(result);
      });

    app.put("/assignments/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        console.log("id", id, data);
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedUSer = {
          $set: {
            title:data.title, level:data.level, marks:data.marks, image:data.image, date:data.date, description:data.description
          },
        };
        const result = await assignmentCollection.updateOne(
          filter,
          updatedUSer,
          options
        );
        res.send(result);
      });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});