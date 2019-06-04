var fork = require('child_process').fork;

var child = fork('./startup/fork.js');
child.send("Child Process");
