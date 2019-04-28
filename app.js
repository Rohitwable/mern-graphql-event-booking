const express = require('express')
const bodyParser = require('body-parser')
const graphQlHttp = require('express-graphql')
const mongoose = require('mongoose')
const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')

const app = express()
mongoose.connect('mongodb://localhost:27017/mern-graphql-event-booking')
    .then(() => app.listen(3005))
    .catch(err => console.log(err))
app.use(bodyParser.json())



app.use('/graphql', graphQlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}))
