const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'cmMadrid',
    database : 'smart-brain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors())


//As soon we access localhost, it will retrieve to us the 'database.users'
app.get("/", (req, res) => {
  res.json('This is my world')
});

//To submit email & password and check if exists in the database
app.post("/signin", (req, res) => {
  knex.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
      if (isValid) {
        return knex.select('*').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
          res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('Wrong Credentials')
      }
    })
    .catch(err => res.status(400).json('Wrong Credentials'))
});

//To register a new user in db, by getting name, email & password
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
    knex.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
      }).then(user => {
        res.json(user[0]); 
      })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
      .catch(err => res.status(400).json('Unable to Register'))
});


//it will get from the url 'localhost:3000/profile/124' 
// and it will check if 124 belongs to an user or not, for example. 
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  knex.select('*').from('users').where({
    id: id
  }).then(user => {
    if (user.length) {
      res.json(user[0])
    } else {
      res.status(400).json('Not Found')
    }
  }).catch(err => res.status(400).json('Error Getting User'))
});


//If we do a PUT request for the id:124, for example, it will increase the entries++
app.put("/image", (req, res) => {
  const { id } = req.body;
  knex('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    }).catch(err => res.status(400).json('unable to get entries'))
});







app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/*

-> res = this is working

/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user


*/
