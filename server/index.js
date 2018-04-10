const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const session = require('express-session');
const createInitialSession = './middlewares/session';
const filter = './middlewares/filter';
require('dotenv').config();

const app = express();

app.use( bodyParser.json() );

// How to serve up your app once you're live
app.use( express.static( `${__dirname}/../build` ) );

app.use(session({
    resave: false,
    saveUinitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 10000
    }
}))

app.use((req, res, next) => createInitialSession(req, res, next))

app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        filter(req, res, next)
    } else {
        next()
    }
})

app.post( "/api/messages", mc.create );
app.get( "/api/messages", mc.read );
app.put( "/api/messages", mc.update );
app.delete( "/api/messages", mc.delete );

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );