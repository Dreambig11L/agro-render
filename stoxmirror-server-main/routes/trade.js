const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const UsersDatabase = require("../models/UsersDatabase");

// 📌 Create new trade
router.post("/:_id/userdeposit", async (req, res) => {
  const { _id } = req.params;
  const { currency, type, duration, tradeAmount, takeProfit, stopLoss } = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });
  }

  try {
    const tradeId = uuidv4();
    const startTime = new Date();
    const newBalance = user.balance - tradeAmount;

    const trade = {
      _id: tradeId,
      currency,
      type,
      status: "PENDING",  // ⏳ pending for 1 minute
      duration: Number(duration),
      tradeAmount: Number(tradeAmount),
      takeProfit: takeProfit || null,
      stopLoss: stopLoss || null,
      profit: null,
      entryPrice: null,
      exitPrice: null,
      date: new Date(),
      startTime,
    };

    await UsersDatabase.updateOne(
      { _id },
      {
        $push: { planHistory: trade },
        $set: { balance: newBalance },
      }
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: "Trade initiated successfully",
      trade,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
});

module.exports = router;
