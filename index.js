const express = require('express');
const cors = require('cors');
const {
        MongoClient,
        ServerApiVersion
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
                app.get('/bookshop', async (req, res) => {
                        const query = {};
                        const cursor = booksCollection.find(query);
                        const books = await cursor.toArray();
                        res.send(books);
                })

                app.post('/additems', async (req, res) => {
                        const newData = req.body;
                        console.log('add newdata', newData);
                        const result = await booksCollection.insertOne(newData)
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