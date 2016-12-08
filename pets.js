'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');
// console.log(__dirname);

var node = path.basename(process.argv[0]);
// console.log(node);
var file = path.basename(process.argv[1]);
// console.log(file);
var cmd = process.argv[2];
// console.log(cmd);
var index = process.argv[3];
// console.log(index);

if (cmd === 'read') {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        var petsP = JSON.parse(data);
        // console.log(petsP);
        if (err) {
            throw err;
        } else if (index === undefined) {
            var pets = petsP
            console.log(pets);
        } else if (index < 0 || index > petsP.length - 1 || isNaN(index)) {
            console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
            process.exit(1);
        } else {
            var pet = petsP; //take parsed data and set it to variable
            console.log(pet[index]);
        };
    })

} else if (cmd === 'create') {
    fs.readFile(petsPath, 'utf8', function(readErr, data) {
      var petsP = JSON.parse(data);
      var age = parseInt(process.argv[3]);
      // console.log(age);
      var kind = process.argv[4];
      // console.log(kind);
      var name = process.argv[5];
      // console.log(name);

        if (readErr) {
            throw readErr;
        }

        if (!age || !kind || !name) {
            console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
            process.exit(1);
        }

        var newPet = {age: age, kind: kind, name: name};
        console.log(newPet);

        petsP.push(newPet);

        var petsJSON = JSON.stringify(petsP);

        fs.writeFile(petsPath, petsJSON, function(writeErr) {
          if (writeErr) {
            throw writeErr;
          }
        });
    });
}
 else {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exit(1);
}
