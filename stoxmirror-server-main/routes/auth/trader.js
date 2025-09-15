const express = require('express');
const router = express.Router();
const UsersDatabase = require("../../models/User");

const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid");

// Define the Trader schema
const TraderSchema = new mongoose.Schema({
  name: String,
  frequency: String,
  risk: String,
  id: String,
  signal: String,
  winrate: String,
  drawdown: String,
  photo: String,
  strategy: String,
  type: String,
  profit: String,
  confidence: String,
  membership: String,
  returns: String, // fixed typo: was `return`
  country: String,
  maxEarn: String,
  range: String,
  followers: String,
  history: Array,
  trades: String,
});

// Create the Trader model
const Trader = mongoose.model('Trader', TraderSchema);

// Register new trader
router.post("/register", async (req, res) => {
  const {
    name,
    frequency,
    risk,
    id,
    signal,
    winrate,
    drawdown,
    photo,
    strategy,
    type,
    profit,
    confidence,
    membership,
    returns,
    country,
    maxEarn,
    range,
    followers,
    history,
    trades,
  } = req.body;

  try {
    const userExists = await Trader.findOne({ id });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Id is already in use",
      });
    }

    const newTrader = {
      name,
      frequency,
      risk,
      id,
      signal,
      winrate,
      drawdown,
      photo,
      strategy,
      type,
      profit,
      confidence,
      membership,
      returns,
      country,
      maxEarn,
      range,
      followers,
      history: history || [],
      trades,
    };

    const createdUser = await Trader.create(newTrader);
    const token = uuidv4(); // Not used, but left in case you plan to add email verification or sessions

    return res.status(200).json({ code: "Ok", data: createdUser });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Login route (by trader ID)
router.post("/login", async (req, res) => {
  const { id } = req.body;

  try {
    const user = await Trader.findOne({ id });

    if (user) {
      return res.status(200).json({ code: "Ok", data: user });
    } else {
      return res.status(404).json({ code: "no user found" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ code: "Internal Server Error" });
  }
});

// Get all traders
router.get("/fetch-trader", async (req, res) => {
  try {
    const traders = await Trader.find();
    res.status(200).json(traders);
  } catch (error) {
    console.error("Error fetching traders:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get single trader by MongoDB _id
router.get("/fetch-trader/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const trader = await Trader.findById(id);

    if (!trader) {
      return res.status(404).json({ message: "Trader not found" });
    }

    res.status(200).json({ code: "Ok", data: trader });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update trader profile by _id
router.put("/:_id/profile/update", async (req, res) => {
  const { _id } = req.params;

  try {
    const user = await Trader.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "Trader not found" });
    }

    await Trader.findByIdAndUpdate(_id, req.body);

    return res.status(200).json({
      message: "Update was successful",
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


//update signals history
router.put("/:_id/signals", async (req, res) => {
  const { _id } = req.params;

  try {
    const user = await Trader.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "Trader not found" });
    }

    // Push new history data from request body to the user's history array
    user.history.push(req.body);

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "Update was successful",
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
