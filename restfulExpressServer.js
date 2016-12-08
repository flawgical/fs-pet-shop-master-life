'use strict';
var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var morgan = require('morgan');
app.use(morgan('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); //middleware to parse body

app.disable('x-powered-by');

app.use(express.static('public'));

//get
app.get('/pets', function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) { //error checking comes 1st!
            console.log(err.stack);
            return res.sendStatus(500);
        }
        var pets = JSON.parse(data); //this variable must stay here!! changing .json data
        // console.log(data);
        // console.log(pets);
        res.send(pets);
    });
});

//get by index
app.get('/pets/:id', function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
            console.log(err.stack);
            return res.sendStatus(500);
        }

        var id = Number.parseInt(req.params.id); //parse string and return integer
        // console.log(id);

        var pets = JSON.parse(data); //do not move variable

        if (id < 0 || id >= pets.length || Number.isNaN(id)) {
            return res.sendStatus(404);
        }

        if (id === undefined) {
            res.send(pets);
        }

        res.send(pets[id]);
    });
});

//post
app.post('/pets', function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
            console.log(err.stack);
            return res.sendStatus(400);
        }

        var pet = req.body;
        // console.log(req.body);
        // console.log(pet);

        if (!pet) {
            return res.sendStatus(400);
        }

        if (pet.age === undefined || pet.kind === undefined || pet.name === undefined) {
            return res.status(400).send("Please enter pet age kind name");
        }

        var pets = JSON.parse(petsJSON);
        // console.log(petsJSON);

        pets.push(pet);

        var petsJSON = JSON.stringify(pets); //contents of the file we are reading if it doesn't error

        fs.writeFile(petsPath, petsJSON, function(writeErr) {
            if (writeErr) {
                throw writeErr;
            }
            res.send(pet);
        });
    })
});

//put -- find item by index, over write with new info
app.put('/pets/:id', function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
            console.log(err.stack);
            return res.sendStatus(500);
        }

        var id = Number.parseInt(req.params.id); //parse string and return integer
        // console.log(id);

        var pets = JSON.parse(petsJSON); //do not move variable

        var updatePet = pets[id];
        console.log(pets[id]);

        if (id < 0 || id >= pets.length || Number.isNaN(id)) {
            return res.sendStatus(400);
        }

        var newPet = req.body;
        console.log(newPet);

        if (!newPet) {
            return res.sendStatus(400);
        }

        if (newPet.age === undefined || newPet.kind === undefined || newPet.name === undefined) {
            return res.sendStatus(400).send("Please enter pet age kind name");
        }

        pets.splice(id, 1, newPet);

        var petsJSON = JSON.stringify(pets); //contents of the file we are reading if it doesn't error

        fs.writeFile(petsPath, petsJSON, function(writeErr) {
            if (writeErr) {
                throw writeErr;
            }
            res.send(newPet);
        });
    });
});

//delete
app.delete("/pets/:id", function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
            console.log(err.stack);
            return res.sendStatus(500);
        }

        var id = Number.parseInt(req.params.id); //parse string and return integer
        // console.log(id);

        var pets = JSON.parse(petsJSON);

        var updatePet = pets[id];
        console.log(pets[id]);

        if (id < 0 || id >= pets.length || Number.isNaN(id)) {
            return res.sendStatus(404);
        }

        pets.splice(id, 1);

        var petsJSON = JSON.stringify(pets);
        
        fs.writeFile(petsPath, petsJSON, function(writeErr) {
            if (writeErr) {
                throw writeErr;
            }
            res.send(pets);
        });
    })
});

app.use(function(req, res, next) {
    res.status(404).send("404 Not Found")
});

//listen on port
app.listen(port, function() {
    console.log("listening on port ", port);
});

module.exports = app;
