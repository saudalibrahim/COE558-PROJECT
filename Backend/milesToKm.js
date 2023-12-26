// MilestoKM
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://COE-558:COE-558@coe558.gpjtuuu.mongodb.net/?retryWrites=true&w=majority"
    );
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

dbConnection();

const conversionSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  operation: {
    type: String,
    required: true,
  },
  input: {
    type: Number,
    required: true,
  },
  result: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    immutable: true,
    required: true,
    default: () => Date.now(),
  },
});

const conversionLog = mongoose.model("conversionLog", conversionSchema);

exports.fahrenheitToC = async (req, res) => {
  // Set CORS headers for all responses
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST");

  if (req.method === "OPTIONS") {
    // Respond to preflight request
    res.status(204).send("");
    return;
  }

  if (req.method === "POST") {
    if (!req.body || !req.body.input) {
      res.status(400).send("input value is required");
      return;
    }
    const userName = req.body.userName;
    const input = req.body.input;
    const operation = "fahrenheitToC";
    const result = ((Number(input)-32) * 5 / 9).toFixed(2);
    const date = Date.now();
    res.send({ result: result });
    const newLog = new conversionLog({
      userName,
      input,
      operation,
      result,
      date,
    });

    try {
      let mdb = await newLog.save();
      res.json(mdb);
    } catch (error) {
      res.json(error);
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
