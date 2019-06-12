const Clarifai = require("clarifai"); //This is related with the API

//This is related with the IA App, face detection. Is the API key to access
const app = new Clarifai.App({
  apiKey: "0c081cda46a448468c6c184c146747c5"
});

const handleApiCall = (req, res) => {
  app.models
    .predict("e466caa0619f444ab97497640cefc4dc", req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))
};

const handleImage = (req, res, knex) => {
  const { id } = req.body;
  knex("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall
};
