const cron = require("node-cron");
const UsersDatabase = require("../models/UsersDatabase");

cron.schedule("* * * * *", async () => {
  try {
    // Get users who have trades that are not completed
    const usersWithTrades = await UsersDatabase.find(
      {
        "planHistory.status": { $in: ["PENDING", "ACTIVE"] }
      },
      { planHistory: 1 }
    );

    for (const user of usersWithTrades) {
      for (const trade of user.planHistory) {
        const elapsed = (new Date() - new Date(trade.startTime)) / 1000 / 60;

        // After 1 minute → PENDING → ACTIVE
        if (trade.status === "PENDING" && elapsed >= 1) {
          await UsersDatabase.updateOne(
            { _id: user._id, "planHistory._id": trade._id },
            { $set: { "planHistory.$.status": "ACTIVE" } }
          );
        }

        // If duration expired → ACTIVE → COMPLETED
        if (trade.status === "ACTIVE" && elapsed >= trade.duration) {
          const profitToAdd = trade.tradeAmount * 0.1; // example 10% profit

          await UsersDatabase.updateOne(
            { _id: user._id, "planHistory._id": trade._id },
            {
              $set: {
                "planHistory.$.status": "COMPLETED",
                "planHistory.$.exitPrice": 123.45, // placeholder
                "planHistory.$.profit": profitToAdd,
              },
            }
          );

          await UsersDatabase.updateOne(
            { _id: user._id },
            { $inc: { profit: profitToAdd, balance: profitToAdd } }
          );
        }
      }
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
