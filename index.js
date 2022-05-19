const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;


// use middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ac76f.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const toDoCollection = client.db("toDoApp").collection("todos");

        app.get('/todos', async (req, res) => {
            const query = {};
            const cursor = toDoCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await toDoCollection.findOne(query)
            res.send(result);
        })

        //  Add a new todo
        app.post('/todos', async (req, res) => {
            const newTodo = req.body;
            const result = await toDoCollection.insertOne(newTodo);
            res.send(result);
        })

        // delete todo
        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await toDoCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my server');
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})




//const uri = "mongodb+srv://ajhar404:<password>@cluster0.ac76f.mongodb.net/?retryWrites=true&w=majority";