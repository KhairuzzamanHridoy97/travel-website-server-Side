const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bttmq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = 5000;
const app = express();

//middlkware
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello Assignment 11");
});

client.connect((err) => {
  const servicesCollection = client.db("khTourDb").collection("services");
  const bookingsCollection = client.db("khTourDb").collection("bookings");

  // Add Services

  app.post("/addServices", async (req, res) => {
    const result = await servicesCollection.insertOne(req.body);
    res.send(result);
  });

  // Get All Service
  app.get("/allServices", async (req, res) => {
    const result = await servicesCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });

  // Get Single Service
  app.get("/singleProduct/:id", async (req, res) => {
    const result = await servicesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(result[0]);
  });

 /// Delete Sevice
 app.delete("/delteServices/:id", async (req, res) => {
  const result = await servicesCollection.deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
});



  // Cofirm Order
  app.post("/confirmOrder", async (req, res) => {
    const result = await bookingsCollection.insertOne(req.body);
    res.send(result);
  });

  // User Confirm Order

  app.get("/myOrders/:email", async (req, res) => {
    const result = await bookingsCollection
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

  
  /// Delete Order
  app.delete("/delteOrder/:id", async (req, res) => {
    const result = await bookingsCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });


  // All Order
  app.get("/allOrders", async (req, res) => {
    const result = await bookingsCollection.find({}).toArray();
    res.send(result);
  }); 


  // Update Statuses
  app.put("/updateStatus/:id", (req, res) => {
    const id = req.params.id;
    const updatedStatus = req.body.status;
    const filter = { _id: ObjectId(id) };
    console.log(updatedStatus);
    bookingsCollection
      .updateOne(filter, {
        $set: { status: updatedStatus },
      })
      .then((result) => {
        res.send(result);
      });
  });
});

app.listen(process.env.PORT || port); 
