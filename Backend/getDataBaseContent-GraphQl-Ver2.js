const functions = require('@google-cloud/functions-framework');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList } = require('graphql');
const mongoose = require('mongoose');
const cors = require('cors');

// Connect to MongoDB
const dbConnection = async () => {
  try {
    await mongoose.connect("mongodb+srv://COE-558:COE-558@coe558.gpjtuuu.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

dbConnection();

// Define MongoDB Schema and Model
const conversionSchema = new mongoose.Schema({
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
    required: true,
    default: Date.now,
  },
});

const ConversionLog = mongoose.model('ConversionLog', conversionSchema);

// Initialize express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your GraphQL ConversionType
const ConversionLogType = new GraphQLObjectType({
  name: 'ConversionLog',
  fields: () => ({
    userName: { type: GraphQLString },
    operation: { type: GraphQLString },
    input: { type: GraphQLFloat },
    result: { type: GraphQLFloat },
    createdOn: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllConversionLogs: {
      type: new GraphQLList(ConversionLogType),
      resolve: async () => {
        try {
          const logs = await ConversionLog.find();
          return logs;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
  },
});

// Define GraphQL Schema
const schema = new GraphQLSchema({
  query: RootQuery,
});

// Set up GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true, // Set to false in production
}));

// Define Google Cloud Function
exports.graphqlFunction = functions.http.onRequest(app);
