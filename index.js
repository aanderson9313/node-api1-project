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

// GET request to /users returns array of users
server.get('/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(201).json({users})
    })
    .catch(err => {
        res.status(500).send({errorMessage: 'The users information could not be retrieved.'})
    })
});

// when Post req is made, return the created object
server.post('/users', (req, res) => {
    const userInfo = req.body;
    console.log(userInfo);

    if ( typeof userInfo.name === 'undefined' || typeof userInfo.bio === 'undefined') {

        res.status(400).json({errorMessage: "Please provide name and bio for the user."});
    } else {
        db.insert(userInfo)
            .then(user => {
            res.status(201).json({success:true, user})
        })
            .catch(err => {
            res.status(500).json({errorMessage: 'There was an error while saving the user to the database', err});
        });
    }
});

server.get('/users/:id', (req, res) => {
    db.findById(req.params.id)
        .then(user => {
            if(user) {
                res.status(200).json({user});
            }else {
                res.status(404).json({message: 'The user with the specified ID does not exist.'});
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: 'The user information could not be retrieved.', err});
        });
});

server.delete('/users/:id', (req, res) => {
    
    db.remove(req.params.id)
        .then(user => {
           if(user) {
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

    
    if (typeof userInfo.name === 'undefined' || typeof userInfo.bio === 'undefined') {
        res.status(400).json({errorMessage: 'Please provide a name and bio for the user.'});
    
    } else {
        db.update( id, userInfo)
        .then(user => {
            if(user) {
                res.status(200).json({ success: true, user});
            } else {
                res.status(404).json({message: 'the user with the specified ID does not exist.'});
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'the user information could not be modified.', err});
        });
    }
})