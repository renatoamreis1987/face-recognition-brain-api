const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: 'process.env.DATABASE_URL',
    ssl: true,
  }
});

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const app = express();

app.use(bodyParser.json());
app.use(cors())



app.get("/", (req, res) => {
  res.json('This is my world')
});

//IMPORTANT: Bellow with signin and also inside of signin.js is written in a different
//way, to have the code in a cleaner way. Just to Compare and understand! 
app.post("/signin", signin.handleSignin(knex, bcrypt));

app.post("/register", (req, res) => { register.handleRegister(req, res, knex, bcrypt) });
 
app.get("/profile/:id", (req, res) => { profile.handleProfile(req, res, knex)});

app.put("/image", (req, res) => { image.handleImage(req, res, knex) });

// This is to handle the API
app.post("/imageurl", (req, res) => { image.handleApiCall(req, res) });


app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

