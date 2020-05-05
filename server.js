const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const app = express();
const knex = require("knex");
const register = require("./Controllers/register");
const signin = require("./Controllers/signin");
const profile = require("./Controllers/profile");
const image = require("./Controllers/image");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

db.select("*").from("users");

app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("It is working!");
});

//Sign in Endpoint
app.post("/signin", signin.handleSignIn(db, bcrypt));

//Register Endpoint
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
}),
  //Profile Endpoint
  app.get("/profile/:id", (req, res) => {
    profile.handleProfileGet(req, res, db, bcrypt);
  }),
  //Image Endpoint
  app.put("/image", (req, res) => {
    image.handleImage(req, res, db);
  });
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
