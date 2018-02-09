'use strict';

var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var Store = require('./store/Store');
var store = new Store();

require('./routes.js')(app)
require('./config.js')(app)

/**
 * Broadcasts to all dispatchers.
 *
 * @param  {String} message The message to sent.
 * @param  {Object} data    The data to send.
 */
function sendToDispatchers(message, data) {
  let dispatchers = store.getDispatcherSockets();

  for (var dispatcher of dispatchers) {
    console.log("Sending request to dispatcher");
    dispatcher.emit(message, data);
  }
}

io.on('connection', function (socket) {
  socket.emit('connection', {connected: true});

  // ----------------------------------------
  //  CLIENT
  // ----------------------------------------

  /**
   * Listener for ``client/login``.
   *
   * This function checks the user credentials, and sends
   * back the account to the user if it exists, otherwise
   * the user will receive a failure message.
   *
   * @param  {Object} credentials The user credentials.
   */
  socket.on('client/login', function (credentials) {
    console.log("CLIENT: Attempting to login...");
    let account = store.retrieveClient(credentials.email, credentials.password);

    if (account != null) {
      socket.emit('login/success', account);
      store.addClientSocket(account.id, socket);
      console.log("CLIENT: Login successful!");
    } else {
      socket.emit('login/failure', "Wrong e-mail or password!");
      console.log("CLIENT: Login failed!");
    }
  });
  /**
   * Listener for ``client/order/request``.
   *
   * Adds the order request to the store and sends it
   * all connected dispatchers.
   *
   * @param  {Object} order The order request.
   */
  socket.on('client/order/request', function (order) {
    console.log("CLIENT: Order request received...");
    store.addOrder(order);
    sendToDispatchers('order/request', order);
  });
  /**
   * Listener for ``client/order/confirmation``.
   *
   * Confirms or removes an order.
   *
   * @param  {Object} confirmation The confirmation object.
   */
  socket.on('client/order/confirmation', function (confirmation) {
    console.log("CLIENT: Order confirmation received");

    if (confirmation.response == true) {
      // Retrieve the order and add it as a trip
      // This will change the object's id when adding as a trip
      var order = store.getOrder(confirmation.id);
      store.addTrip(order);
      sendToDispatchers('trip/new', order);
      socket.emit('trip/new', order);
    }
    // Remove the order from the list of orders in store
    store.removeOrder(data.id);
  });

  // ----------------------------------------
  //  DISPATCHER
  // ----------------------------------------

  /**
   * Listener for ``dispatcher/login``.
   */
  socket.on('dispatcher/login', function (data) {
    console.log("A dispatcher has logged on!");
    store.addDispatcherSocket(socket);

    socket.emit("login/success", {orders: store.getOrders(), trips: store.getTrips(), cars: []});
  });
  /**
   * Listener for ``dispatcher/trip/proposal``.
   *
   * Sends a trip proposal to a client.
   *
   * @param  {Object} proposal The trip proposal
   */
  socket.on('dispatcher/trip/proposal', function (proposal) {
    console.log("DISPATCHER: New trip proposal received...");
    // FIXME: This may have to change depending on how the data structure ends up looking
    let client = store.getClientSocket(proposal.client.id);
    client.emit('trip/proposal', proposal);
    // Remove the order from all dispatcher's order list
    sendToDispatchers('order/remove', proposal.id);
  });

});

// Start the server
var server = http.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});
