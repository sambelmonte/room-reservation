const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
  secret: 'reserveRoom',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

app.engine('hbs', exphbs({
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.use('/', require('./routes/index'));

app.listen(3000);