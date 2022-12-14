const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcui1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('cars');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        })

        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products);
            res.json(result)
        });
        app.delete('/product/delete/:id', async (req,res)=>{
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await productsCollection.deleteOne(query);
           res.json(result)

        })

        app.post('/orders', async (req,res) =>{     
            const orders= req.body;
            const result = await ordersCollection.insertOne(orders)
            res.json(result)
      
          })
        app.post('/review', async (req,res) =>{     
            const reviews= req.body;           
            console.log("hitting review",reviews);
            const result = await reviewsCollection.insertOne(reviews)
            res.json(result)     
          })
          app.get('/home/review', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews);
        })
        app.delete('/order/delete/:id', async (req,res)=>{
            const id = req.params.id          
            const query = {_id:ObjectId(id)}
            console.log(query)
            const result = await ordersCollection.deleteOne(query);         
            res.json(result)
        })
        app.put('/status/:id', async (req,res)=>{
              const id = req.params.id
              const data = req.body;
              console.log(data)
              console.log(id)
  
              const query = {_id:ObjectId(id)}
             const updateDoc = {
                  $set: {
                     status:data.isStatus
            },
              };
              const result = await ordersCollection.updateOne(query, updateDoc);
                      res.json(result)
          
                  }
                  )
        app.get('/order/myorder',async (req, res) => {
            const email = req.query.email;
           const query = { email: email}

            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })


        app.get('/order/manageall', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        })

      app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log(user)
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users)
            console.log(result)
            res.json(result)

        })
   }
    finally {
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})