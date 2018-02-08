'use strict';

var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var Store = require('./store/Store');
var store = new Store();

require('./routes.js')(app)
require('./config.js')(app)

io.on('connection', function (socket) {
  socket.emit('connection', {connected: true});

  // ----------------------------------------
  //  CLIENT
  // ----------------------------------------

  socket.on('client/login', function (data) {
    console.log("CLIENT: Attempting to login...");
    let account = store.retrieveClient(data.email, data.password);

    if (account != null) {
      socket.emit('login/success', account);
      store.addClientSocket(account.id, socket);
      console.log("CLIENT: Login successful!");
    } else {
      socket.emit('login/failure', "Wrong e-mail or password!");
      console.log("CLIENT: Login failed!");
    }
  });

  socket.on('client/order/request', function (data) {
    console.log("CLIENT: Order request received...");

    store.addOrder(data);

    let dispatchers = store.getDispatcherSockets();

    for (var dispatcher of dispatchers) {
      console.log("Sending request to dispatcher");
      dispatcher.emit('order/request', data);
    }
  });

  socket.on('client/order/confirmation', function (data) {
    console.log("CLIENT: Order confirmation received");

    if (data.response == true) {
      var order = store.getOrder(data.id);
      store.addTrip(order);
    }

    store.removeOrder(data.id);
  });

  // ----------------------------------------
  //  DISPATCHER
  // ----------------------------------------

  socket.on('dispatcher/login', function (data) {
    console.log("A dispatcher has logged on!");
    store.addDispatcherSocket(socket);

    socket.emit("login/success", {orders: store.getOrders(), trips: store.getTrips(), cars: []});
  });

  socket.on('dispatcher/trip/proposal', function (request) {
    console.log("DISPATCHER: New trip proposal received...");
    // FIXME: This may have to change depending on how the data structure ends up looking
    let client = store.getClientSocket(request.client.id);
    console.log(request);
    client.emit('trip/proposal', request);
  });

});

var server = http.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});
