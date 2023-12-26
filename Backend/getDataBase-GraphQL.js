const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const cors = require('cors');

// Connect to MongoDB
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

const Conversion = mongoose.model('Conversion', conversionSchema);

// Define GraphQL Schema
const schema = buildSchema(`
  type Conversion {
    id: ID!
    userName: String
    operation: String
    input: Float
    result: Float
    createdOn: String
  }

  type Query {
    getAllConversions: [Conversion]
  }
`);

// Resolvers
const root = {
  getAllConversions: async () => {
    try {
      return await Conversion.find({});
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

// Set up Express and GraphQL
const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Set to false in production
}));

exports.getDbGQL = app;
