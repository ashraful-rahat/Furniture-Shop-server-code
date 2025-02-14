const cors = require('cors');
const express = require('express');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://furniture-house:V9d3HrTcuHzXey3G@cluster0.qp3bl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");

    // Define collections
    const furnitureCollection = client.db('furniture-house').collection('AllFurniture');

    // Define routes
    app.get('/furniture', async (req, res) => {
      const furniture = await furnitureCollection.find().toArray();
      res.json(furniture);
    });;

    app.get('/furniture/:id', async (req, res) => {
      const id = req.params.id;
      const furniture = await furnitureCollection.findOne({ _id: new ObjectId(id) });
      res.json(furniture);
    });

    

    // Ping MongoDB to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Start the server
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Run the MongoDB connection
run().catch(console.dir);