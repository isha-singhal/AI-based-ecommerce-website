const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/viewsss'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);

// session config:
const sessionConfig = {
  secret: 'asecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

//session :
const passport = require('passport');
const passportL = require('passport-local');
const User = require('./models/user');
const ExpError = require('./utils/ExpError');

//passp
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportL(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose connection :
const mongoose = require('mongoose');
const mongoPath =
  'mongodb+srv://useradmin:2UZuojG0StZ0Gjm0@cluster0.2vjog.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose
  .connect(mongoPath, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('success');
  })
  .catch((err) => {
    console.log(err);
  });

const Product = require('./models/products');

// routes:
const buyRoute = require('./routes/buyer');
const sellRoute = require('./routes/seller');

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

app.use('/sell', sellRoute);
app.use('/buy', buyRoute);
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/logout', async (req, res) => {
  // const pathh = req.originalUrl || '/';
  req.logout();
  res.redirect('/');
});

app.all('*', (req, res, next) => {
  next(new ExpError('Page not found...', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong...';
  res.status(statusCode).render('error', { err });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
