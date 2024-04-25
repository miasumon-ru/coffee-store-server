
const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.P0RT || 5000

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k8vw6eq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)

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


    // Connect to the "insertDB" database and access its "haiku" collection

    const coffeeCollection = client.db('coffeeDB').collection('coffee')
    const coffeeUserCollection = client.db('coffeeUsersDB').collection('coffeeUsers')

    // creating post api

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body
      console.log('new coffee is : ', newCoffee)



      // Insert the defined document into the "haiku" collection
      const result = await coffeeCollection.insertOne(newCoffee);

      res.send(result)



    })

    // creating get api for the coffee

    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();

      const result = await cursor.toArray()

      res.send(result)
    })

    // creating get api with dynamic id

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id


      const query = { _id: new ObjectId(id) };

      const result = await coffeeCollection.findOne(query);

      res.send(result)


    })

    // creating put api for update

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id
      const updatedCoffee = req.body
      console.log('update this id :', id)

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {

          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo
        },
      };

      const result = await coffeeCollection.updateOne(filter, updateDoc, options);

      res.send(result)


    })

    // creating delete api

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id

      console.log('delete this id : ', id)

      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);

      res.send(result)
    })

    // UserCollection related Api

    app.post('/users', async (req, res) => {
      const user = req.body
      console.log('New user is : ', user)

      const result = await coffeeUserCollection.insertOne(user);
      res.send(result)
    })

    app.get('/users', async (req, res) => {

      const cursor = coffeeUserCollection.find();

      const result = await cursor.toArray()

      res.send(result)
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id

      console.log('delete this id : ', id)

      const query = { _id : new ObjectId(id) };
      const result = await coffeeUserCollection.deleteOne(query);

      res.send(result)
    })

    app.patch('/users' , async(req, res) => {
      const patchedUser = req.body

      console.log('patched user is ', patchedUser)

      const filter = { email : patchedUser.email };

      const updateDoc = {
        $set: {
          lastLoggedAt : patchedUser.lastLoggedAt
        },
      };

      const result = await coffeeUserCollection.updateOne(filter, updateDoc);

      res.send(result)
  


    })



    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Coffee store server is running')
})


app.listen(port, () => {
  console.log(`my coffee store server is running on port : ${port}`)
})