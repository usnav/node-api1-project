

const express = require('express')

const User = require('./users/model')

const server = express();

server.use(express.json());

server.post('/api/users',  (req, res) => {
    const user = req.body;

    if (!user.name || !user.bio) {
        res.status(400).json({
            message: "provide name and bio for user"
        })
     } else {
            User.insert(user)
            .then(createdUser => {
                res.status(201).json(createdUser)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'error creating user', 
                    err: err.message,
                    stack:err.stack
                })
            })
    }
})


server.get('/api/users', (req, res) => {
   User.find()
    .then(users => {
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: 'error getting users', 
            err: err.message, 
            stack: err.stack
        })
    })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
     .then(user => {
        if (!user) {
            res.status(404).json({
                message: "does not exist"
            })
        }
        res.status(200).json(user)
     })
     .catch(err => {
         res.status(500).json({
             message: 'error getting users', 
             err: err.message, 
             stack: err.stack
         })
     })
 })

 
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;

   User.remove(id)
    .then(deleted => {
        if (deleted) {
            res.status(200).json(deleted)
        } else {
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            error: error.message
        })
    })
})


server.put('/api/users/:id', async (req, res) => {
    try {
        const possibleUser = await User.findById(req.params.id)
        if (!possibleUser) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else {
            if (!req.body.name || !req.body.bio) {
                res.status(400).json({
                    message: 'provide name and bio'
                })
            } else {
               const updatedUser = await User.update(req.params.id, 
                req.body)
               res.status(200).json(updatedUser)
            }
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})



server.use('*', (req, res) => {
    res.status(404).json({
        message: 'not found'
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}


