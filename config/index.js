const express = require('express');
const path = require('path');
const port = 1335;

module.exports = function (app) {

  app.use(express.static(path.join(__dirname, '../public/')));
  app.use('/vue', express.static(path.join(__dirname, '/../node_modules/vue/dist/')));
  app.use('/vue-router', express.static(path.join(__dirname, '/../node_modules/vue-router/dist/')));
  app.use('/flatpickr', express.static(path.join(__dirname, '/../node_modules/flatpickr/dist/')));

  app.set('port', (process.env.PORT || port));

};
