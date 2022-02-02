require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

const secret = process.env.SECRET;

mongoose.connect('mongodb://localhost:27017/userDB');



const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ['password']
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.render('home.ejs')
});

app.get('/login', (req, res) => {
  res.render('login.ejs')
});

app.get('/register', (req, res) => {
  res.render('register.ejs')
});

app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets.ejs')
    }
  });
})

app.post('/login', (req, res) => {
  const result = User.find({
    email: req.body.username,
    password: req.body.password
  });
  User.findOne({
    email: req.body.username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser.password === req.body.password) {
        res.render('secrets.ejs')
      } else {
        console.log("Password did not match");
      }
    }
  })

})









app.listen(3000, () => {
  console.log("Server is listening on Port 3000");
})
// cant seem to get the error handling working for async functions, or for
//callbacks either.  needs further research into how to return errors
//in mongoose
async function checkUser() {
  try {
    result = await User.findOne({
      email: req.body.username
    });
    if (result) {
      console.log("found match");
      if (result.password === req.body.password) {
        res.render('secrets.ejs');
      } else {
        console.log("Password Does not Match");
        res.redirect('/login');
      }
    } else {
      console.log("UserName does not match");
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
}