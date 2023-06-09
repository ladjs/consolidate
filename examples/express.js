// npm install express
const path = require('node:path');
const express = require('../../express');
const cons = require('../');

const app = express();

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

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
