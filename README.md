![](hero.jpg)
# Minderwertig
[![Heroku App Status](http://heroku-shields.herokuapp.com/minderwertig)](https://minderwertig.herokuapp.com)

A taxi booking system created as a student project for the course *System Design with a User Perspective* at Uppsala University. The name Minderwertig is supposed to be opposite of Uber (big taxi company), some people have mentioned that it do have a negative meaning as well, and of course we didn't think of this when this was created.

Minderwertig is a web application (Javascript/Vue).

### Getting started

#### Prerequisites

* Node and the node package manager

#### Installing

Clone this repository:

```bash
$ git clone https://github.com/pkrll/Minderwertig
```

``cd`` in to the folder, and run ``npm install`` in the root directory to install the project dependencies.

```bash
$ cd Minderwertig
$ npm install
```

### Usage

**Minderwertig** consist of a server, and three applications: A client app, a driver app and a dispatcher.

#### Running the server

In the root folder, run the command ``node app`` (or ``nodemon app``) to start up the server.

#### Running the client

The client application is reached from ``localhost:PORT/client`` where ``PORT`` is the port number set in the [``config/index.js``](#configurations) file.


#### Running the driver

The driver application is reached from ``localhost:PORT/driver`` where ``PORT`` is the port number set in the [``config/index.js``](#configurations) file.


#### Running the dispatcher

The dispatcher application is reached from ``localhost:PORT/dispatcher`` where ``PORT`` is the port number set in the [``config/index.js``](#configurations) file.

### Configurations

Configurations can be found in ``config/index.js``:

* ``Port`` (default: 1335)

### Documentation

* [Git guidelines](https://github.com/pkrll/Minderwertig/blob/master/Documentation/Guidelines/git.md)
* [Styleguide](https://github.com/pkrll/Minderwertig/blob/master/Documentation/Guidelines/styleguide.md)
* [Data Structures](https://github.com/pkrll/Minderwertig/blob/master/Documentation/Guidelines/data-structures.md)
