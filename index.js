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

    const productsCollection = client.db('furniture-house').collection('Products')

    // Define routes
    //all furniture route
    app.get('/furniture', async (req, res) => {
      const furniture = await furnitureCollection.find().toArray();
      res.json(furniture);
    });;


  //id wise on furniture details
    app.get('/furniture/:id', async (req, res) => {
      const id = req.params.id;
      const furniture = await furnitureCollection.findOne({ _id: new ObjectId(id) });
      res.json(furniture);
    });


  
// Add a new product to the Products collection
app.post('/products', async (req, res) => {

  
  // Get the product data from the request body
  const product = req.body; 
  
  // Ensure the product doesn't have an _id field in the request body
  if (product._id) {
    delete product._id; // MongoDB will auto-generate the _id if it's not provided
  }

  try {
    const result = await productsCollection.insertOne(product);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product to database" });
  }
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