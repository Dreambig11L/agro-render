const UsersDatabase = require("../../models/User");
var express = require("express");
// const { v4: uuidv4 } = require("uuid");


var router = express.Router();
const { sendDepositEmail,sendPlanEmail} = require("../../utils");
const { sendUserDepositEmail,sendUserPlanEmail,sendBankDepositRequestEmail,sendWithdrawalEmail,sendWithdrawalRequestEmail,sendKycAlert} = require("../../utils");
const nodeCrypto = require("crypto");

// If global.crypto is missing or incomplete, polyfill it
if (!global.crypto) {
  global.crypto = {};
}

if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = (typedArray) => {
    if (typedArray instanceof Uint32Array) {
      const buffer = nodeCrypto.randomBytes(typedArray.length * 4);
      for (let i = 0; i < typedArray.length; i++) {
        typedArray[i] = buffer.readUInt32LE(i * 4);
      }
      return typedArray;
    } else if (typedArray instanceof Uint8Array) {
      const buffer = nodeCrypto.randomBytes(typedArray.length);
      typedArray.set(buffer);
      return typedArray;
    }
    throw new Error("Unsupported TypedArray type");
  };
}

const cron = require('node-cron');


const { v4: uuidv4 } = require("uuid");
const app=express()




router.post("/:_id/deposit", async (req, res) => {
  const { _id } = req.params;
  const { method, amount, from ,timestamp,to} = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    await user.updateOne({
      transactions: [
        ...user.transactions,
        {
          _id: uuidv4(),
          method,
          type: "Deposit",
          amount,
          from,
          status:"pending",
          timestamp,
        },
      ],
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Deposit was successful",
    });

    sendDepositEmail({
      amount: amount,
      method: method,
      from: from,
      timestamp:timestamp
    });


    sendUserDepositEmail({
      amount: amount,
      method: method,
      from: from,
      to:to,
      timestamp:timestamp
    });

  } catch (error) {
    console.log(error);
  }
});

router.post("/:_id/deposit/bank", async (req, res) => {
  const { _id } = req.params;
  const { method, amount, from ,timestamp,to} = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    await user.updateOne({
      transactions: [
        ...user.transactions,
        {
          _id: uuidv4(),
          method,
          type: "Deposit",
          amount,
          from,
          status:"pending",
          timestamp,
        },
      ],
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Deposit was successful",
    });

    sendBankDepositRequestEmail({
      amount: amount,
      method: method,
      from: from,
      timestamp:timestamp
    });


    // sendUserDepositEmail({
    //   amount: amount,
    //   method: method,
    //   from: from,
    //   to:to,
    //   timestamp:timestamp
    // });

  } catch (error) {
    console.log(error);
  }
});

router.post("/:_id/plan", async (req, res) => {
  const { _id } = req.params;
  const { subname, subamount, from ,timestamp,to} = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }
  try {
    // Calculate the new balance by subtracting subamount from the existing balance
    const newBalance = user.balance - subamount;

    await user.updateOne({
      planHistory: [
        ...user.planHistory,
        {
          _id: uuidv4(),
          subname,
          subamount,
          from,
          timestamp,
        },
      ],
      balance: newBalance, // Update the user's balance
    });



    res.status(200).json({
      success: true,
      status: 200,
      message: "Deposit was successful",
    });

    sendPlanEmail({
      subamount: subamount,
      subname: subname,
      from: from,
      timestamp:timestamp
    });


    sendUserPlanEmail({
      subamount: subamount,
      subname: subname,
      from: from,
      to:to,
      timestamp:timestamp
    });

  } catch (error) {
    console.log(error);
  }
});


router.post("/:_id/auto", async (req, res) => {
  const { _id } = req.params;
  const { copysubname, copysubamount, from ,timestamp,to} = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }
  try {
    // Calculate the new balance by subtracting subamount from the existing balance
    const newBalance = user.balance - copysubamount;

    await user.updateOne({
      plan: [
        ...user.plan,
        {
          _id: uuidv4(),
          subname:copysubname,
          subamount:copysubamount,
          from,
          timestamp,
        },
      ],
      balance: newBalance, // Update the user's balance
    });



    res.status(200).json({
      success: true,
      status: 200,
      message: "Deposit was successful",
    });

    sendPlanEmail({
      subamount: copysubamount,
      subname: copysubname,
      from: from,
      timestamp:timestamp
    });


    sendUserPlanEmail({
      subamount: copysubamount,
      subname: copysubname,
      from: from,
      to:to,
      timestamp:timestamp
    });

  } catch (error) {
    console.log(error);
  }
});




// Endpoint to handle copytradehistory logic
router.post("/:_id/Tdeposit", async (req, res) => {
  const { _id } = req.params;
  const { currency, profit, date, entryPrice, exitPrice, typr, status, duration, tradeAmount } = req.body;

  const user = await UsersDatabase.findOne({ _id});


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
    const userProfit = Number(user.profit || 0);
    const profitToAdd = Number(profit);
const newBalance = user.balance - tradeAmount;
    // Create initial trade record
    await user.updateOne({
      planHistory: [
        ...user.planHistory,
        {
          _id: tradeId,
          currency,
          entryPrice,
          typr,
          status: 'PENDING',
          exitPrice,
          profit: profitToAdd,
          date,
          duration,
          startTime
        },
      ],
      balance:newBalance,
    });

    // Schedule status update to 'active' after 1 minute
    setTimeout(async () => {
      await UsersDatabase.updateOne(
        { _id, "planHistory._id": tradeId },
        { $set: { "planHistory.$.status": "ACTIVE" } }
      );
    }, 60000);

    // Schedule completion after duration
    cron.schedule('* * * * *', async () => {
      try {
        const currentUser = await UsersDatabase.findOne({ _id });
        const trade = currentUser.planHistory.find(t => t._id === tradeId);
        
        if (!trade || trade.status !== 'ACTIVE') return;

        const currentTime = new Date();
        const elapsedTime = (currentTime - new Date(trade.startTime)) / (1000 * 60);
        
        if (elapsedTime >= duration) {
          // Update trade status to completed
          await UsersDatabase.updateOne(
            { _id, "planHistory._id": tradeId },
            { 
              $set: {
                "planHistory.$.status": "COMPLETED"
              }
            }
          );

          // Add the profit directly using $inc operator
          await UsersDatabase.updateOne(
            { _id },
            { $set: { profit: userProfit + profitToAdd } }
          );

          // Update related deposit status
          await UsersDatabase.updateOne(
            { 
              _id, 
              "transactions.currency": currency,
              "transactions.status": "pending"
            },
            { 
              $set: { "transactions.$.status": "completed" }
            }
          );
        }
      } catch (error) {
        console.error('Cron job error:', error);
      }
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Trade initiated successfully",
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

router.post("/:_id/Tdeposit", async (req, res) => {
  const { _id } = req.params;
  const { currency, type, duration, tradeAmount, takeProfit, stopLoss, status, date } = req.body;

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
    const userProfit = Number(user.profit || 0);

    // Deduct trade amount from balance
    const newBalance = user.balance - tradeAmount;

    // Create initial trade record
    await user.updateOne({
      planHistory: [
        ...user.planHistory,
        {
          _id: tradeId,
          currency,
          type,                  // ✅ corrected from "typr"
          status: status || "PENDING",
          duration,
          tradeAmount,
          takeProfit: takeProfit || null,
          stopLoss: stopLoss || null,
          profit: null,          // ✅ will be set later
          entryPrice: null,      // ✅ placeholder
          exitPrice: null,       // ✅ placeholder
          date,
          startTime,
        },
      ],
      balance: newBalance,
    });

    // Schedule status update to "ACTIVE" after 1 minute
    setTimeout(async () => {
      await UsersDatabase.updateOne(
        { _id, "planHistory._id": tradeId },
        { $set: { "planHistory.$.status": "ACTIVE" } }
      );
    }, 60000);

    // Cron job to check if duration expired
    cron.schedule("* * * * *", async () => {
      try {
        const currentUser = await UsersDatabase.findOne({ _id });
        const trade = currentUser.planHistory.find((t) => t._id === tradeId);

        if (!trade || trade.status !== "ACTIVE") return;

        const currentTime = new Date();
        const elapsedTime = (currentTime - new Date(trade.startTime)) / (1000 * 60);

        if (elapsedTime >= duration) {
          const profitToAdd = trade.tradeAmount * 0.1; // example profit calc (10%)

          // Update trade to completed
          await UsersDatabase.updateOne(
            { _id, "planHistory._id": tradeId },
            {
              $set: {
                "planHistory.$.status": "COMPLETED",
                "planHistory.$.exitPrice": 123.45, // placeholder
                "planHistory.$.profit": profitToAdd,
              },
            }
          );

          // Add profit to user
          await UsersDatabase.updateOne(
            { _id },
            { $set: { profit: userProfit + profitToAdd, balance: user.balance + profitToAdd } }
          );
        }
      } catch (error) {
        console.error("Cron job error:", error);
      }
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Trade initiated successfully",
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

// DELETE trade by tradeId for a specific user
router.delete("/:userId/:tradeId/trades", async (req, res) => {
  const { userId, tradeId } = req.params;

  try {
    const user = await UsersDatabase.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const tradeExists = user.planHistory.some(t => t._id == tradeId);
    if (!tradeExists) {
      return res.status(404).json({ success: false, message: "Trade not found" });
    }

    await UsersDatabase.updateOne(
      { _id: userId },
      { $pull: { planHistory: { _id: tradeId } } }
    );

    res.json({ success: true, message: "Trade deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// router.post("/:_id/userdeposit", async (req, res) => {
//   const { _id } = req.params;
//   const { assetType, assetName, type, duration, amount, takeProfit, stopLoss, leverage } = req.body;

//   const user = await UsersDatabase.findOne({ _id });

//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       status: 404,
//       message: "User not found",
//     });
//   }

//   try {
//     const tradeId = uuidv4();
//     const startTime = new Date();
//     const tradeAmount = Number(amount);

//     // Deduct trade amount from balance
//     const newBalance = user.balance - tradeAmount;

//     // Create initial trade record
//     // Create initial trade
// await UsersDatabase.updateOne(
//   { _id },
//   {
//     $push: {
//       planHistory: {
//         _id: tradeId,
//         assetName,
//         assetType,
//         type,
//         status: "PENDING",
//         duration,
//         tradeAmount,
//         leverage,
//         takeProfit: takeProfit || null,
//         stopLoss: stopLoss || null,
//         profit: null,
//         entryPrice: Math.random() * 100,
//         exitPrice: null,
//         date: startTime,
//         result: "",
//         startTime,
//         command: "false", // NEW FIELD
//       },
//     },
//     $set: { balance: newBalance },
//   }
// );

// // CRON JOB
// // CRON JOB
// cron.schedule("* * * * *", async () => {
//   try {
//     const currentUser = await UsersDatabase.findOne({ _id });
//     const trade = currentUser.planHistory.find((t) => t._id === tradeId);
//     if (!trade) return;

//     // Already completed? → Stop here
//     if (trade.status === "COMPLETED") return;

//     // If command is still "false" → skip (trade hasn't started yet)
//     if (trade.command === "false") return;

//     // Reset startTime once when command turns true
//     if (trade.command === "true" && !trade.startTimeUpdated) {
//       await UsersDatabase.updateOne(
//         { _id, "planHistory._id": tradeId },
//         {
//           $set: {
//             "planHistory.$.startTime": new Date(),
//             "planHistory.$.status": "ACTIVE",
//             "planHistory.$.startTimeUpdated": true,
//           },
//         }
//       );
//       return;
//     }

//     const currentTime = new Date();
//     const elapsedTime =
//       (currentTime - new Date(trade.startTime)) / (1000 * 60);

//     if (elapsedTime >= Number(trade.duration)) {
//       let isWin = false;
//       let finalProfit = 0;

//       if (trade.command === "true") {
//         isWin = true;
//         finalProfit = Number(trade.profit) || 0;
//       } else if (trade.command === "declined") {
//         isWin = false;
//         finalProfit = 0;
//       }

//       // Mark trade as completed
//       await UsersDatabase.updateOne(
//         { _id, "planHistory._id": tradeId },
//         {
//           $set: {
//             "planHistory.$.status": "COMPLETED",
//             "planHistory.$.exitPrice": 123.45,
//             "planHistory.$.profit": finalProfit,
//             "planHistory.$.result": isWin ? "WON" : "LOST",
//           },
//         }
//       );

//       // Only add profit if won
//       if (isWin && finalProfit > 0) {
//         await UsersDatabase.updateOne(
//           { _id },
//           { $inc: { profit: finalProfit } }
//         );
//         console.log(`✅ Profit ${finalProfit} added to user ${_id}`);
//       }
//     }
//   } catch (err) {
//     console.error("Cron job error:", err);
//   }
// });

//     res.status(200).json({
//       success: true,
//       status: 200,
//       message: "Trade initiated successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       status: 500,
//       message: "Internal server error",
//     });
//   }
// });




router.post("/:_id/userdeposit", async (req, res) => {
  const { _id } = req.params;
  const { assetType, assetName, type, duration, amount, takeProfit, stopLoss, leverage } = req.body;

  try {
    const tradeId = uuidv4(); // 👈 generate unique trade ID

    // 1️⃣ Fetch user first (to check balance)
    const user = await UsersDatabase.findById(_id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // 2️⃣ Create new trade object
    const newTrade = {
      _id: tradeId,
      assetName,
      assetType,
      takeProfit,
      stopLoss,
      leverage,
      duration,
      tradeAmount: amount,
      command: "false",   // 👈 not activated yet
      startTime: null,    // 👈 only set when activated
      status: "PENDING",  // 👈 waiting for activation
    };

    // 3️⃣ Subtract from balance & push trade atomically
    await UsersDatabase.updateOne(
      { _id },
      {
        $inc: { balance: -amount },  // subtract amount
        $push: { planHistory: newTrade },
      }
    );

    // 4️⃣ Response
    res.json({
      success: true,
      message: "Trade created (pending activation), balance updated",
      tradeId,
      newBalance: user.balance - amount,
    });

    // Optionally alert admin
    // sendAdminAlert({ assetName, type, duration, amount, takeProfit, stopLoss, leverage });

  } catch (error) {
    console.error("❌ Error creating trade:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update trade
router.put("/trades/:tradeId", async (req, res) => {
  const { tradeId } = req.params;
  const updates = req.body;

  try {
    await UsersDatabase.updateOne(
      { "planHistory._id": tradeId },
      {
        $set: {
          "planHistory.$.assetName": updates.assetName,
          "planHistory.$.tradeAmount": updates.tradeAmount,
          "planHistory.$.leverage": updates.leverage,
          "planHistory.$.duration": updates.duration,
           "planHistory.$.profit": updates.profit,
        },
      }
    );

    res.json({ success: true, message: "Trade updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a single trade by tradeId
router.get("/trades/:tradeId", async (req, res) => {
  const { tradeId } = req.params;

  try {
    // Find the user containing that tradeId
    const user = await UsersDatabase.findOne(
      { "planHistory._id": tradeId },
      { "planHistory.$": 1 } // project only the matching trade
    );

    if (!user || !user.planHistory || user.planHistory.length === 0) {
      return res.status(404).json({ success: false, message: "Trade not found" });
    }

    res.json({ success: true, trade: user.planHistory[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// PUT /api/trades/:tradeId/command
router.put("/trades/:tradeId/command", async (req, res) => {
  try {
    const { tradeId } = req.params;
    const { command } = req.body;

    if (!["false", "true", "declined"].includes(command)) {
      return res.status(400).json({ error: "Invalid command value" });
    }

    // Find the user and trade first
    const user = await UsersDatabase.findOne({ "planHistory._id": tradeId });
    if (!user) {
      return res.status(404).json({ error: "Trade not found" });
    }

    const trade = user.planHistory.find((t) => t._id.toString() === tradeId);
    if (!trade) {
      return res.status(404).json({ error: "Trade not found in user" });
    }

    // Update the trade with new command
    await UsersDatabase.updateOne(
      { "planHistory._id": tradeId },
      {
        $set: {
          "planHistory.$.command": command,
          "planHistory.$.status": command === "true" ? "RUNNING" : "DECLINED",
          "planHistory.$.startTime":
            command === "true" ? new Date() : trade.startTime,
        },
      }
    );

    // If activated, start timer
    if (command === "true") {
      setTimeout(async () => {
        try {
          const updatedUser = await UsersDatabase.findOne({
            "planHistory._id": tradeId,
          });
          const runningTrade = updatedUser.planHistory.find(
            (t) => t._id.toString() === tradeId
          );

          if (!runningTrade || runningTrade.status === "COMPLETED") return;

          let isWin = false;
          let finalProfit = 0;

          if (runningTrade.command === "true") {
            isWin = true;
            finalProfit = Number(runningTrade.profit) || 0;
          } else if (runningTrade.command === "declined") {
            isWin = false;
            finalProfit = 0;
          }

          await UsersDatabase.updateOne(
            { "planHistory._id": tradeId },
            {
              $set: {
                "planHistory.$.status": "COMPLETED",
                "planHistory.$.exitPrice": 123.45, // replace with real exit price
                "planHistory.$.profit": finalProfit,
                "planHistory.$.result": isWin ? "WON" : "LOST",
              },
            }
          );

          if (isWin && finalProfit > 0) {
            await UsersDatabase.updateOne(
              { _id: updatedUser._id },
              { $inc: { profit: finalProfit } }
            );
            console.log(`✅ Profit ${finalProfit} added to user ${updatedUser._id}`);
          }
        } catch (err) {
          console.error("Trade timer error:", err);
        }
      }, Number(trade.duration) * 60 * 1000); // duration in minutes
    }

    res.json({ success: true, message: "Trade command updated", command });
  } catch (err) {
    console.error("Error updating command:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// =====================
// 📌 Create a new trade
// =====================
// router.post("/:_id/userdeposit", async (req, res) => {
//   const { _id } = req.params;
//   const { assetType, assetName, type, duration, amount, takeProfit, stopLoss } = req.body;

//   try {
//     const user = await UsersDatabase.findOne({ _id });
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     const tradeAmount = Number(amount);
//     if (tradeAmount > user.balance) {
//       return res.status(400).json({ success: false, message: "Insufficient balance" });
//     }

//     const tradeId = uuidv4();
//     const startTime = new Date();

//     const trade = {
//       _id: tradeId,
//       assetName,
//       assetType,
//       type,
//       status: "PENDING",
//       duration: duration, // minutes
//       tradeAmount,
//       takeProfit: takeProfit || null,
//       stopLoss: stopLoss || null,
//       profit: null,
//       entryPrice: Math.random() * 100, // 🟢 Example: fake entry price
//       exitPrice: null,
//       date: startTime,
//       startTime: startTime.toISOString(),
//     };

//     // Deduct balance immediately
//     user.balance -= tradeAmount;
//     user.planHistory.push(trade);
//     await user.save();

//     res.json({ success: true, message: "Trade initiated successfully", trade });
//   } catch (error) {
//     console.error("❌ Error in /userdeposit:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });
// function parseDuration(duration) {
//   if (typeof duration === "number") return duration * 60 * 1000; // minutes → ms
//   if (typeof duration === "string") {
//     const match = duration.match(/^(\d+)([smhd])$/); // supports s, m, h, d
//     if (!match) return null;
//     const value = parseInt(match[1]);
//     const unit = match[2];

//     switch (unit) {
//       case "s": return value * 1000;
//       case "m": return value * 60 * 1000;
//       case "h": return value * 60 * 60 * 1000;
//       case "d": return value * 24 * 60 * 60 * 1000;
//       default: return null;
//     }
//   }
//   return null;
// }


// // ================================
// // 📌 Cron job: finalize old trades
// // ================================
// cron.schedule("* * * * *", async () => {
//   console.log("⏰ Checking trades...");

//   try {
//     const users = await UsersDatabase.find({ "planHistory.status": "PENDING" });

//     for (const user of users) {
//       let updated = false;

//       for (const trade of user.planHistory) {
//         if (trade.status !== "PENDING") continue;

//        if (!trade.startTime || isNaN(new Date(trade.startTime).getTime())) {
//   console.log(`⚠️ Skipping trade ${trade._id}: invalid startTime`, trade.startTime);
//   continue;
// }

// const durationMs = parseDuration(trade.duration);

// if (!durationMs) {
//   console.log(`⚠️ Invalid duration for trade ${trade._id}:`, trade.duration);
//   return;
// }
// const start = new Date(trade.startTime);
// const end = new Date(start.getTime() + durationMs);
// const now = new Date();

//         const tradeEndTime = new Date(trade.startTime);
//         tradeEndTime.setMinutes(tradeEndTime.getMinutes() + trade.duration);
// console.log("DEBUG TRADE:", {
//   id: trade._id,
//   startTime: trade.startTime,
//   parsed: new Date(trade.startTime),
//   duration: trade.duration,
// });

//         if (now >= end) {
//   console.log(`👉 Completing trade ${trade._id} (ended ${Math.floor((now - end) / 1000)}s ago)`);

//   const profitOrLoss = Math.floor(Math.random() * 21) - 10;

//   trade.status = "COMPLETED";
//   trade.exitPrice = trade.entryPrice + profitOrLoss;
//   trade.profit = profitOrLoss;

//   user.balance += trade.tradeAmount + profitOrLoss;
//   updated = true;

//   console.log(`✅ Trade ${trade._id} saved with status COMPLETED (P/L: ${profitOrLoss})`);
// } else {
//   console.log(`⏳ Trade ${trade._id} still pending. Ends in ${Math.floor((end - now) / 1000)}s`);
// }

//       }

//       if (updated) await user.save();
//     }
//   } catch (error) {
//     console.error("❌ Cron job error:", error);
//   }
// });
router.put("/:_id/transactions/:transactionId/confirm", async (req, res) => {
  
  const { _id } = req.params;
  const { transactionId } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    const depositsArray = user.transactions;
    const depositsTx = depositsArray.filter(
      (tx) => tx._id === transactionId
    );

    depositsTx[0].status = "Approved";
    // console.log(withdrawalTx);

    // const cummulativeWithdrawalTx = Object.assign({}, ...user.withdrawals, withdrawalTx[0])
    // console.log("cummulativeWithdrawalTx", cummulativeWithdrawalTx);

    await user.updateOne({
      transactions: [
        ...user.transactions
        //cummulativeWithdrawalTx
      ],
    });

    res.status(200).json({
      message: "Transaction approved",
    });

    return;
  } catch (error) {
    res.status(302).json({
      message: "Opps! an error occured",
    });
  }
});

router.put("/:_id/transactions/:transactionId/decline", async (req, res) => {
  
  const { _id } = req.params;
  const { transactionId } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    const depositsArray = user.transactions;
    const depositsTx = depositsArray.filter(
      (tx) => tx._id === transactionId
    );

    depositsTx[0].status = "Declined";
    // console.log(withdrawalTx);

    // const cummulativeWithdrawalTx = Object.assign({}, ...user.withdrawals, withdrawalTx[0])
    // console.log("cummulativeWithdrawalTx", cummulativeWithdrawalTx);

    await user.updateOne({
      transactions: [
        ...user.transactions
        //cummulativeWithdrawalTx
      ],
    });

    res.status(200).json({
      message: "Transaction declined",
    });

    return;
  } catch (error) {
    res.status(302).json({
      message: "Opps! an error occured",
    });
  }
});



router.get("/:_id/deposit/history", async (req, res) => {
  const { _id } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    res.status(200).json({
      success: true,
      status: 200,
      data: [...user.transactions],
    });

  
  } catch (error) {
    console.log(error);
  }
});


router.get("/:_id/deposit/plan/history", async (req, res) => {
  const { _id } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    res.status(200).json({
      success: true,
      status: 200,
      data: [...user.planHistory],
    });

  
  } catch (error) {
    console.log(error);
  }
});


router.post("/kyc/alert", async (req, res) => {
  const {firstName} = req.body;

  

  try {
    res.status(200).json({
      success: true,
      status: 200,
     message:"admin alerted",
    });

    sendKycAlert({
      firstName
    })
  
  } catch (error) {
    console.log(error);
  }
});


router.post("/:_id/withdrawal", async (req, res) => {
  const { _id } = req.params;
  const { method, address, amount, from ,account,to,timestamp} = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    await user.updateOne({
      withdrawals: [
        ...user.withdrawals,
        {
          _id: uuidv4(),
          method,
          address,
          amount,
          from,
          account,
          status: "pending",
          timestamp
        },
      ],
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Withdrawal request was successful",
    });

    sendWithdrawalEmail({
      amount: amount,
      method: method,
     to:to,
      address:address,
      from: from,
    });

    sendWithdrawalRequestEmail({
      amount: amount,
      method: method,
      address:address,
      from: from,
    });
  } catch (error) {
    console.log(error);
  }
});

// router.put('/approve/:_id', async (req,res)=>{
//   const { _id} = req.params;
//   const user = await UsersDatabase();
//   const looper=user.map(function (userm){
  
//     const withdd=userm.withdrawal.findOne({_id})
  
//   withdd.status="approved"
//    })
//    looper();

//    res.send({ message: 'Status updated successfully', data });

// })

// // endpoint for updating status
// router.put('/update-status/:userId/:_id', async (req, res) => {

//   const { _id} = req.params; // get ID from request parameter
//   const { userId}=req.params;
//   // const user = await UsersDatabase.findOne({userId}); // get array of objects containing ID from request body


//   const withd=user.withdrawals.findOne({_id})
// user[withd].status="approved"
 

// // find the object with the given ID and update its status property
//   // const objIndex = data.findIndex(obj => obj._id === _id);
//   // data[objIndex].status = 'approved';

//   // send updated data as response

//   if (!userId) {
//     res.status(404).json({
//       success: false,
//       status: 404,
//       message: "User not found",
//     });

//     return;
//   }

//   res.send({ message: 'Status updated successfully', data });
// });

router.put("/:_id/withdrawals/:transactionId/confirm", async (req, res) => {
  
  const { _id } = req.params;
  const { transactionId } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    const withdrawalsArray = user.withdrawals;
    const withdrawalTx = withdrawalsArray.filter(
      (tx) => tx._id === transactionId
    );

    withdrawalTx[0].status = "Approved";
    // console.log(withdrawalTx);

    // const cummulativeWithdrawalTx = Object.assign({}, ...user.withdrawals, withdrawalTx[0])
    // console.log("cummulativeWithdrawalTx", cummulativeWithdrawalTx);

    await user.updateOne({
      withdrawals: [
        ...user.withdrawals
        //cummulativeWithdrawalTx
      ],
    });

    res.status(200).json({
      message: "Transaction approved",
    });

    return;
  } catch (error) {
    res.status(302).json({
      message: "Opps! an error occured",
    });
  }
});




router.put("/:_id/withdrawals/:transactionId/decline", async (req, res) => {
  
  const { _id } = req.params;
  const { transactionId } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    const withdrawalsArray = user.withdrawals;
    const withdrawalTx = withdrawalsArray.filter(
      (tx) => tx._id === transactionId
    );

    withdrawalTx[0].status = "Declined";
    // console.log(withdrawalTx);

    // const cummulativeWithdrawalTx = Object.assign({}, ...user.withdrawals, withdrawalTx[0])
    // console.log("cummulativeWithdrawalTx", cummulativeWithdrawalTx);

    await user.updateOne({
      withdrawals: [
        ...user.withdrawals
        //cummulativeWithdrawalTx
      ],
    });

    res.status(200).json({
      message: "Transaction Declined",
    });

    return;
  } catch (error) {
    res.status(302).json({
      message: "Opps! an error occured",
    });
  }
});


router.get("/:_id/withdrawals/history", async (req, res) => {
  console.log("Withdrawal request from: ", req.ip);

  const { _id } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    res.status(200).json({
      success: true,
      status: 200,
      data: [...user.withdrawals],
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
