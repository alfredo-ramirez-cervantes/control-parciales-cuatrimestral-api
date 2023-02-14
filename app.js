
"use strict";

const graphql           = require('graphql');
const express           = require('express');
const expressGraphQL    = require('express-graphql').graphqlHTTP;
const bodyParser        = require('body-parser');
const { GraphQLSchema } = graphql;
const { query }         = require("./resolvers/querys/query");
const { mutation }   =  require("./resolvers/mutations/mutation");

const schema = new GraphQLSchema({
    query,
    mutation
});

const app = express();

// Responder inmediatamente la prueba de salud en caso de que
// el User-Agent sea kube-proxy (o el especificado en la variable PROBE_USER_AGENT)
const probeUserAgent = process.env.PROBE_USER_AGENT || 'kube-probe';
probeUserAgent &&
    app.use('/', (req, res, next) => {
        const isProbe = req.headers['user-agent'].match(new RegExp(probeUserAgent));
        isProbe ? res.send('Ok') : next();
    });

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

const graphqlApp = expressGraphQL(async({ headers, query }) => ({
    schema,
    graphiql: true,
}));

app.post('/', graphqlApp);
app.get('/', graphqlApp);

// Iniciar servidor Express
const PORT = parseInt(process.env.SERVER_PORT || 5000);
app.listen(
    PORT,
    () => console.log(`GraphQL is running on: http://localhost:${PORT}`)
);
