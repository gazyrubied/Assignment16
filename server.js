const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const upload = multer({ dest: __dirname + "/public/images" });

mongoose
  .connect("mongodb+srv://gazrubied2200:MVyBoTc0h4PRPoGo@cluster0.0xwqweg.mongodb.net/?retryWrites=true&w=majority", {
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Couldn't connect to MongoDB", error));

const soccerSchema = new mongoose.Schema({
  name: String,
  team: String,
  position: String,
  nationality: String,
  goalsScored: Number,
  assists: Number,
  achievements: [String],
  img: String,
});

const Player = mongoose.model("Player", soccerSchema);

app.get("/api/players", (req, res) => {
  getPlayers(res);
});

const getPlayers = async (res) => {
  const players = await Player.find();
  res.send(players);
};

app.post("/api/players", upload.single("img"), (req, res) => {
  const result = validatePlayer(req.body);

  if (result.error) {
    res.status(400).send(result.error);
    return;
  }

  const player = new Player({
    name: req.body.name,
    team: req.body.team,
    position: req.body.position,
    nationality: req.body.nationality,
    goalsScored: req.body.goalsScored,
    assists: req.body.assists,
    achievements: req.body.achievements.split(","),
  });

  if (req.file) {
    player.img = "images/" + req.file.filename;
  }

  createPlayer(res, player);
});

const createPlayer = async (res, player) => {
  const result = await player.save();
  res.send(player);
};

app.put("/api/players/:id", upload.single("img"), async (req, res) => {
  const result = validatePlayer(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  updatePlayer(req, res);
});

const updatePlayer = async (req, res) => {
  let fieldsToUpdate = {
    name: req.body.name,
    team: req.body.team,
    position: req.body.position,
    nationality: req.body.nationality,
    goalsScored: req.body.goalsScored,
    assists: req.body.assists,
    achievements: req.body.achievements.split(","),
  };

  if (req.file) {
    fieldsToUpdate.img = "images/" + req.file.filename;
  }

  const result = await Player.updateOne({ _id: req.params.id }, fieldsToUpdate);
  const updatedPlayer = await Player.findById(req.params.id);
  res.send(updatedPlayer);
};

app.delete("/api/players/:id", upload.single("img"), (req, res) => {
  removePlayer(res, req.params.id);
});

const removePlayer = async (res, id) => {
  const player = await Player.findByIdAndDelete(id);
  res.send(player);
};

const validatePlayer = (player) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    team: Joi.string().min(3).required(),
    position: Joi.string().min(3).required(),
    nationality: Joi.string().min(3).required(),
    goalsScored: Joi.number().integer().min(0).required(),
    assists: Joi.number().integer().min(0).required(),
    achievements: Joi.string().allow(''),
  });

  return schema.validate(player);
};

app.listen(3000, () => {
  console.log("I'm listening");
});
