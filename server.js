const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")

const app = express();

app.use(bodyParser.json());
app.use(cors())

//This is temporary, is to simulate we've a database, in order to play with Postman
const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date()
    }
  ]
};

//As soon we access localhost, it will retrieve to us the 'database.users'
app.get("/", (req, res) => {
  res.send(database.users);
});

//To submit email & password and check if exists in the database
app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("Error Login in");
  }
});

//To register a new user in db, by getting name, email & password
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: "125",
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});

//it will get from the url 'localhost:3000/profile/124' 
// and it will check if 124 belongs to an user or not, for example. 
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("User not Found¡");
  }
});

//If we do a PUT request for the id:124, for example, it will increase the entries++
app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("User not Found¡");
  }
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
