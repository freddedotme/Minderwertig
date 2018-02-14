const actions = {
  /**
   * Attempts to login with the specified credentials
   *
   * @param   {Object} credentials The email and password of the user
   */
  login: function (credentials) {
    router.push('/client/wait');
    socket.emit('client/login', credentials);
  },
  /**
   * Logs out the current account and redirects back to the login screen
   *
   */
  logout: function () {
    this.account = null;
    router.push('/client');
  },
  /**
   * Sends a booking request to the server.
   *
   * @param   {Object} order The booking details
   */
  sendOrder: function (order) {
    // The order needs to have an account before sending it to the server
    // The server could add the client property itself, by matching socket
    // to client from the Store, but that requires a lot more logic.
    order.client = this.account;

    router.push('/client/order/wait');
    socket.emit('client/order/request', order);
  },
  /**
   * Send a confirmation of the current order, stored in the Vue instance's
   * data property 'currentOrder'.
   */
  sendConfirmation: function (response) {
    router.push(''); // TODO
    let message = {id: this.temporary.currentOrder.id, response: response};
    socket.emit('client/order/confirmation', message);
    // TODO: Add currentOrder to our trips array or whatnot, y'all
  },

  displayTripDetails: function (trip) {
    this.temporary.currentTrip = trip;
    router.push('/client/trip');
  },

  removeTrip: function (id) {
    delete this.account.trips[id];
  },

  toggleMenu: function () {
    this.isMenuActive = !this.isMenuActive;
  }
};
