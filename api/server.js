const express = require('express')
const helmet = require('helmet')
const authRouter = require('../auth/auth-router')
const usersRouter = require('../users/users-router')



const server = express()
server.use(helmet())
server.use(express.json())
// server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
    res.status(200).json({ message: 'api is up' })
})


function protected(req, res, next) {

}


module.exports = server