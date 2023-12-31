const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const  express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://blogger:oEaQW7x8v632r0LP@cluster0.crzw9rp.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;

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
    // await client.connect();
    const database = client.db("blogDb");
    const colction = database.collection("blog");
    const wishlistCollection = database.collection("wishlist");
    const newsltterCollection = database.collection("news");


    app.get('/recent-blogs', async (req, res) => {
        const cursor = colction.find().sort({ dataAndTime: -1 }).limit(6);
        const result = await cursor.toArray();
        res.send(result);  
    });
    


    app.get('/blogs', async(req, res)=>{
      const cursor = colction.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/add', async(req, res)=>{
      const blog = req.body;
      const result = await colction.insertOne(blog);
      res.send(result);
    })

    app.post('/wishlist', async(req, res)=>{
      const singleWislist = req.body;
      const result = await wishlistCollection.insertOne(singleWislist);
      res.send(result);
    })

    app.get('/wishlist', async(req, res)=>{
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const cursor = wishlistCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete('/wishlist/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result =  await wishlistCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await wishlistCollection.findOne(query)
      res.send(result);  
  })

  app.post('/subscribe', async(req, res)=>{
    const subscribe = req.body;
    const result = await newsltterCollection.insertOne(subscribe);
    res.send(result);
  })
 


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


 


 

app.get('/', (req, res)=>{
    res.send(`blog server is running`);
})
app.listen(port, ()=>{
    console.log(`blog running on port ${port}`)
})