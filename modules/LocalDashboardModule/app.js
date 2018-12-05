'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;

var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var fileName = 'index.html';

app.get('/', function(req, res){

  var path = '/appdata/' + fileName;

  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      console.log('File not found. Using default index.html.');

      res.sendFile(__dirname + '/index.html');
    } else {
      //file exists
      console.log('File ' + path + ' exists.');

      res.sendFile(path);
    }
  })
});

io.on('connection', function(socket){
  console.log('User connected');

  socket.on('disconnect', function(){
    console.log('User disconnected');
  });

  // chat message
  socket.on('broadcast message', function(msg){
      io.emit('broadcast message', msg);
      console.log('message: ' + msg);
  });
});

Client.fromEnvironment(Transport, function (err, client) {
  if (err) {
    throw err;
  } else {
    client.on('error', function (err) {
      throw err;
    });

    // connect to the Edge instance
    client.open(function (err) {
      if (err) {
        throw err;
      } else {
        console.log('     /$$$$$$      /$$$$$$  /$$    /$$ /$$$$$$$$ /$$       /$$$$$$$  /$$$$$$$$ ');
        console.log('   /$$$__  $$$   /$$__  $$| $$   | $$| $$_____/| $$      | $$__  $$| $$_____/ ');
        console.log('  /$$_/  \_  $$ | $$  \__/| $$   | $$| $$      | $$      | $$  \ $$| $$       ');
        console.log(' /$$/ /$$$$$  $$|  $$$$$$ |  $$ / $$/| $$$$$   | $$      | $$  | $$| $$$$$    ');
        console.log('| $$ /$$  $$| $$ \____  $$ \  $$ $$/ | $$__/   | $$      | $$  | $$| $$__/    ');
        console.log('| $$| $$\ $$| $$ /$$  \ $$  \  $$$/  | $$      | $$      | $$  | $$| $$       ');
        console.log('| $$|  $$$$$$$$/|  $$$$$$/   \  $/   | $$$$$$$$| $$$$$$$$| $$$$$$$/| $$$$$$$$ ');
        console.log('|  $$\________/  \______/     \_/    |________/|________/|_______/ |________/ ');
        console.log(' \\  $$$   /$$$                                                                ');
        console.log('  \\_  $$$$$$_/                                                                ');
        console.log('    \\______/                                                                  ');
        console.log('IoT Edge localDashboard module client initialized.');
        console.log('Use input input1 and output output1.');

        // Act on input messages to the module.
        client.on('inputMessage', function (inputName, msg) {
          pipeMessage(client, inputName, msg);
        });

        client.getTwin(function (err, twin) {
          if (err) {
              console.error('Error getting twin: ' + err.message);
          } else {
              twin.on('properties.desired', function(desired) {
                console.log('Desired properties received'); 
                console.log('---------------------------');
                  
                if (desired.fileName) {
                  fileName = desired.fileName;
                  console.log('fileName: ' + fileName);
                }

                console.log('---------------------------');
              });
          }
        });      
      }
    });
  }
});

// This function just pipes the messages without any change.
function pipeMessage(client, inputName, msg) {
  client.complete(msg, printResultFor('Receiving message'));

  if (inputName === 'input1') {
    var message = msg.getBytes().toString('utf8');
    if (message) {
      var outputMsg = new Message(message);

      console.log('Message to send: ' + message);

      io.emit('broadcast message', message);

      client.sendOutputEvent('output1', outputMsg, printResultFor('Sending received message'));
    } else {
      console.log('Message ignored');
    }
  } else {
    console.log('unsupported input ' + inputName);
  }
}

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    }
    if (res) {
      console.log(op + ' status: ' + res.constructor.name);
    }
  };
}

// Do not expose internal modules path to your websites. 
app.use('/scripts', express.static(__dirname + '/node_modules/highcharts/'));
app.use('/scripts1', express.static(__dirname + '/node_modules/highcharts/themes/'));

http.listen(4242, function(){
  console.log('Local dashboard is available on *:4242');
});
