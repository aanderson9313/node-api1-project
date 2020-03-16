// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.listen(4000, () => {
    console.log('Listening on port 4000...');
});

// HTTP method
// URI: scheme://host_name:port/path?paramater_list
// https://www.google.com/some/document?with_params=value

server.get('/', (req, res) => {
    res.send('Great Job!');
}); 

server.get('/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(201).json({users})
    })
    .catch(err => {
        res.status(500).send({errorMessage: 'The users information could not be retrieved.'})
    })
});

server.post('/users', (req, res) => {
    const userInfo = req.body;
    console.log(userInfo);

    db.insert(userInfo)
    .then(user => {
        res.status(201).json({success:true, user})
    })
    .catch(err => {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
    })
});

server.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    db.remove(id)
        .then(deleted => {
           if(deleted) {
               res.status(204).end();
           } else {
               res.status(404).json({message: 'The user with the specified ID does not exist'})
           }
        })
        .catch(err => {
            res.status(500).json({errorMessage: "The user could not be removed"})
        })
})

server.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    DataView.update(id, changes)
    .then(updated => {
        if(updated) {
            res.status(200).json({success: true, updated});

        } else if (updated !== changes.id) {
            res.status(400).json({message: 'The user with the specified ID does not exist.'})
        } else if (updated !== changes.name && changes.bio) {
            res.status(400).json({errorMessage: 'Please provide name and bio for the user.'})
        } else if (updated !== changes) {
            res.status(500).json({})
        }
    })
    .catch( err => {
        res.status(500).json({errorMessage: 'The user could not be removed'})
    })
})