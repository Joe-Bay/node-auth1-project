const express = require('express')
const helmet = require('helmet')
const authRouter = require('../auth/auth-router')
const server = express()
const usersRouter = require('../users/users-router')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const connection = require('../data/connect')
server.use(express.json())

server.use(helmet())

const sessionConfig = {
    name: 'llama',
    secret: process.env.SESSION_SECRET || 'dont tell anyone the secret secret',
    resave: false,
    saveUnitiliazed: true,
    userId: null,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.USE_SECURE_COOKIES || false,
        httpOnly: true,
    },
    store: new KnexSessionStore({
        knex: connection,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60 // removes the expired cookies
    })
}


server.use(session(sessionConfig))
server.use('/api/users', protected, usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
    res.status(200).json({ message: 'api is up' })
})


function protected(req, res, next) {
    console.log(req.session)
if(req.session.username){
    next()
} else {
    res.status(401).json({message: 'you shall not pass'})
}
}


module.exports = server