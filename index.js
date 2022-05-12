const express = require('express');
const cors = require('cors');
const {
        MongoClient,
        ServerApiVersion,
        ObjectId
} = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//Mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqxfl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
});



async function run() {
        try {
                await client.connect();
                const booksCollection = client.db('shaunakshop').collection('books');

                //Get all data from database
                app.get('/bookshop', async (req, res) => {
                        const query = {};
                        const cursor = booksCollection.find(query);
                        const books = await cursor.toArray();
                        res.send(books);
                })

                //Get one data by id
                app.get('/booksdetail/:booksid', async (req, res) => {
                        const booksid = req.params.booksid;
                        const query = {
                                _id: ObjectId(booksid)
                        };
                        const books = await booksCollection.findOne(query);
                        res.send(books)
                })

                //Create an item into database
                app.post('/additems', async (req, res) => {
                        const newData = req.body;
                        console.log('add newdata', newData);
                        const result = await booksCollection.insertOne(newData)
                        res.send(result)
                })


                //Update or Restock
                app.put('/booksdetail/:booksid', async (req, res) => {
                        const booksid = req.params.booksid;
                        const updateProduct = req.body;
                        const filter = {
                                _id: ObjectId(booksid)
                        }
                        const options = {
                                upsert: true
                        }
                        const updateDoc = {
                                $set: {
                                        quantity: updateProduct.result
                                }
                        }
                        const result = await booksCollection.updateOne(filter, updateDoc, options)
                        res.send(result)
                })

                //Delete Product From DB
                app.delete('/booksdetail/:booksid', async (req, res) => {
                        const booksid = req.params.booksid;
                        const query = {
                                _id: ObjectId(booksid)
                        }
                        const result = await booksCollection.deleteOne(query)
                        res.send(result)
                })

        } finally {

        }
}

run().catch(console.dir);


app.get('/', (req, res) => {
        res.send('running server');
});

app.listen(port, () => {
        console.log('working');
});