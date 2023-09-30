// npm install express
const path = require('node:path');
const express = require('express');
const cons = require('../../');

// Example of declaring eta with custom options.
const eta = new (require('eta').Eta)({
  // Have to let Express handle the views directory instead.
  views: '.',
  varName: 'that',
  autoFilter: true,
  filterFunction(val) {
    if (typeof val === 'string') {
      return val.toUpperCase();
    }
  }
});

const app = express();

cons.requires.eta = eta;
app.engine('eta', cons.eta);
app.set('view engine', 'eta');
app.set('views', path.join(__dirname, './views'));

const users = [];
users.push({ name: 'tobi' }, { name: 'loki' }, { name: 'jane' });

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Consolidate.js'
  });
});

app.get('/users', function (req, res) {
  res.render('users', {
    title: 'Users',
    users
  });
});

app.listen(3000);
console.log('Express server listening on port 3000');
