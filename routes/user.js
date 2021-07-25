const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists");

  user = new User(_.pick(req.body, ["password", "name", "email"]));
  let s = _.pick(user, ["id", "name", "email"]);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;

  user = await user.save();
  res.send(s);
});

router.get("/", (req, res) => {
  res.send("Hello");
});

module.exports = router;
