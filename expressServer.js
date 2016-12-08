'use strict';
var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.disable('x-powered-by');

// app.use(function(req, res){
//   res.send('Hello world');
// })

//get
app.get('/pets', function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) { //error checking comes 1st!
            console.log(err.stack);
            return res.sendStatus(500);
        }
        var pets = JSON.parse(data);
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

app.use(function(req, res, next) {
    res.status(404).send("404 Not Found")
});

//listen on port
app.listen(port, function() {
    console.log("listening on port ", port);
});

module.exports = app;
