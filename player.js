const mongoose = require("mongoose");

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

const soccerPlayers = [
    {
        name: "Lionel Messi",
        team: "Inter Miami",
        position: "Forward",
        nationality: "Argentina",
        goalsScored: 821,
        assists: 300,
        achievements: ["8x Ballon d'Or winner", "4x UEFA Champions League winner, " ],
        img: "image/messi.jpg",
    },
    {
        name: "Cristiano Ronaldo",
        team: "Al Nassr",
        position: "Forward",
        nationality: "Portugal",
        goalsScored: 858,
        assists: 200,
        achievements: ["5x Ballon d'Or winner", "5x UEFA Champions League winner"],
        img: "image/ronaldo.jpg",
    },
    {
        name: "Neymar Jr.",
        team: "Paris Saint-Germain",
        position: "Forward",
        nationality: "Brazil",
        goalsScored: 296,
        assists: 150,
        achievements: ["1x Copa Libertadores winner", "1x UEFA Champions League winner"],
        img: "image/neymar.jpg",
    },
    {
        name: "Kylian Mbappé",
        team: "Paris Saint-Germain",
        position: "Forward",
        nationality: "France",
        goalsScored: 296,
        assists: 80,
        achievements: ["1x FIFA World Cup winner", "2x Ligue 1 winner"],
        img: "image/mbappe.jpg",
    },
    {
        name: "Virgil van Dijk",
        team: "Liverpool",
        position: "Defender",
        nationality: "Netherlands",
        cleanSheets: 120,
        tackles: 300,
        achievements: ["1x UEFA Champions League winner", "1x Premier League winner"],
        img: "image/dijk.jpg",
    },
    {
        name: "Kevin De Bruyne",
        team: "Manchester City",
        position: "Midfielder",
        nationality: "Belgium",
        goalsScored: 60,
        assists: 180,
        achievements: ["2x PFA Players' Player of the Year", "4x Premier League winner" , "1x Champion Leage Winner"],
        img: "image/kevin.jpg",
    },
  ];
  
  async function insertPlayers() {
    try {
      for (const playerData of soccerPlayers) {
        const player = new Player(playerData);
        await player.save();
      }
      console.log("Players inserted successfully!");
    } catch (error) {
      console.error("Error inserting players:", error);
    } finally {
      mongoose.connection.close();
    }
  }
  
  insertPlayers();