const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://mishrasarthak5:mx0L8uFcZDKblWc9@cluster0.jknkkm9.mongodb.net/todoapp?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let todosCollection;

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");

    // Set the collection to the 'todos' collection in your database
    todosCollection = client.db("todoapp").collection("todos");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await todosCollection.find().toArray();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
  const { task } = req.body;
  const newTodo = { task, completed: false };

  try {
    const result = await todosCollection.insertOne(newTodo);
    res.json(result.ops[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
