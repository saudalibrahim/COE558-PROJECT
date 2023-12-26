const functions = require('@google-cloud/functions-framework');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
 
const app = express();
app.use(cors());
app.use(bodyParser.json());
 
mongoose.connect(
  'mongodb+srv://COE-558:COE-558@coe558.gpjtuuu.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
 
const conversionSchema = new mongoose.Schema({
  userName: String,
  operation: String,
  input: Number,
  result: Number,
  createdOn: { type: Date, default: Date.now }
});
 
const conversionlogs = mongoose.model('conversionlogs', conversionSchema);
 
app.get('/fetchData', async (req, res) => {
  // Set CORS headers for all responses
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    // Respond to preflight request
    res.status(204).send("");
    return;
  }
  
  try {
    const dbLog = await conversionlogs.find();
    res.status(200).send(dbLog);
  } catch (error) {
    res.status(500).send(error);
  }
});

 
exports.fetchData = app;
