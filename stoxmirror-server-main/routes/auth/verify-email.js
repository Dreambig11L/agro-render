var http = require("http");
var express = require("express");
var router = express.Router();

router.put("/:email/verify", async function (request, response) {
  const { email } = request.params;

  const user = await UsersDatabase.findOne({ email });

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
      verified: true,
    });

    res.writeHead(301, { Location: "https://harcourthamsa.com" });
    res.end();
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
