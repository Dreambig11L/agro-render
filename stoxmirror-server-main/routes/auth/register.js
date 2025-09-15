var express = require("express");
var speakeasy=require("speakeasy")
var { hashPassword,sendPasswordOtp,userRegisteration, sendWelcomeEmail,resendWelcomeEmail,resetEmail, sendUserDetails, userRegisteration } = require("../../utils");
const UsersDatabase = require("../../models/User");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Function to generate a referral code
function generateReferralCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}


router.post("/register", async (req, res) => {
  const { email,password,fullName,username,usdtId,bitcoinId } = req.body;
 // Generate OTP
 const otp = speakeasy.totp({
  secret: process.env.SECRET_KEY, // Secure OTP generation
  encoding: "base32",
});

// Set OTP expiration time (5 minutes from now)
const otpExpiration = Date.now() + (5 * 60 * 1000); // 5 minutes in milliseconds
  try {
    // Check if any user has that email
    const user = await UsersDatabase.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email address is already taken",
      });
    }


    // Find the referrer based on the provided referral code
    let referrer = null;
    
    // if (referralCode) {
    //   referrer = await UsersDatabase.findOne({ referralCode });
    //   if (!referrer) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Invalid referral code",
    //     });
    //   }
    // }

    // Create a new user with referral information
    const newUser = {
     fullName,
     username,
     email,
     usdtId,
     bitcoinId,
      password: hashPassword(password),
      // country,
      trader:"",
      // phone:phone,
      amountDeposited: " You are not eligible to view livestream of ongoing trade.Kindly contact your trader or support.",
      profit: 0,
      balance: 0,
      copytrading:0,
      plan:[],
      kyc:"unverified",
      condition:" ",
      referalBonus: 0,
      transactions: [],
      withdrawals: [],
      planHistory: [],
     
      accounts: {
        eth: {
          address: "",
        },
        ltc: {
          address: "",
        },
        btc: {
          address: "",
        },
        usdt: {
          address: "",
        },
      },
      verified: false,
      isDisabled: false,
      referredUsers:[],
      referralCode: generateReferralCode(6), // Generate a referral code for the new user
      referredBy:null, // Store the ID of the referrer if applicable
    };

    // if (referrer) {
    //   newUser.referredBy=referrer.fullName;
    //   referrer.referredUsers.push(newUser.fullName);
    //   await referrer.save();
    // }

    // Generate a referral code for the new user only if referralCode is provided
    // if (referralCode) {
    //   newUser.referralCode = generateReferralCode(6);
    // }

    // If there's a referrer, update their referredUsers list
   
    // Create the new user in the database
    const createdUser = await UsersDatabase.create(newUser);
    const token = uuidv4();
    sendWelcomeEmail({ to: email, token });
userRegisteration({fullName,email});
return res.status(200).json({
  code: "Ok",
  data: createdUser,
  otp: otp, // OTP in the response
  otpExpiration: otpExpiration, // Include expiration time
});
    
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});



// router.post("/register", async (req, res) => {
//   const { fullName, lastName, email, password, country, referralCode } = req.body;

//   try {
//     // Check if any user has that email
//     const user = await UsersDatabase.findOne({ email });

//     if (user) {
//       return res.status(400).json({
//         success: false,
//         message: "Email address is already taken",
//       });
//     }

//     // Find the referrer based on the provided referral code
//     let referrer = null;
//     if (referralCode) {
//       referrer = await UsersDatabase.findOne({ referralCode });
//       if (!referrer) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid referral code",
//         });
//       }
//     }

//     // Create a new user with referral information
//     const newUser = {
//       fullName,
//       lastName,
//       email,
//       password: hashPassword(password),
//       country,
//       amountDeposited: 0,
//       profit: 0,
//       balance: 0,
//       referalBonus: 0,
//       transactions: [],
//       withdrawals: [],
//       accounts: {
//         eth: {
//           address: "",
//         },
//         ltc: {
//           address: "",
//         },
//         btc: {
//           address: "",
//         },
//         usdt: {
//           address: "",
//         },
//       },
//       verified: false,
//       isDisabled: false,
//     };

//     // Generate a referral code for the new user only if referralCode is provided
//     if (referralCode) {
//       newUser.referralCode = generateReferralCode(6);
//     }

//     // If there's a referrer, update their referredUsers list
//     if (referrer) {
//       newUser.referredBy = referrer._id;
//       referrer.referredUsers.push(newUser._id);
//       await referrer.save();
//     }

//     // Create the new user in the database
//     const createdUser = await UsersDatabase.create(newUser);
//     const token = uuidv4();
//     sendWelcomeEmail({ to: email, token });

//     return res.status(200).json({ code: "Ok", data: createdUser });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });


// router.post("/register", async (req, res) => {
//   const { fullName, lastName, email, password, country } = req.body;

//   //   check if any user has that username
//   const user = await UsersDatabase.findOne({ email });

//   // if user exists
//   if (user) {
//     res.status(400).json({
//       success: false,
//       message: "email address is already taken",
//     });
//     return;
//   }

//   await UsersDatabase.create({
//     fullName,
//     lastName,
//     email,
//     password: hashPassword(password),
//     country,
//     amountDeposited: 0,
//     profit: 0,
//     balance: 0,
//     referalBonus: 0,
//     transactions: [],
//     withdrawals: [],
//     accounts: {
//       eth: {
//         address: "",
//       },
//       ltc: {
//         address: "",
//       },
//       btc: {
//         address: "",
//       },
//       usdt: {
//         address: "",
//       },
//     },
//     verified: false,
//     isDisabled: false,
//   })
//     .then((data) => {
//       return res.json({ code: "Ok", data: user });
//     })
//     .then(() => {
//       var token = uuidv4();
//       sendWelcomeEmail({ to: req.body.email, token });
//     })
//     .catch((error) => {
//       res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     });
// });



router.post("/register/resend", async (req, res) => {
  const { email } = req.body;
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
    
    res.status(200).json({
      success: true,
      status: 200,
      message: "OTP resent successfully",
    });
    
 sendPasswordOtp({to:req.body.email})
   
    // sendUserDetails({
    //   to:req.body.email
    //   });
      

  } catch (error) {
    console.log(error);
  }
});


router.post("/register/reset", async (req, res) => {
  const { email } = req.body;
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
    
    res.status(200).json({
      success: true,
      status: 200,
      message: "OTP resent successfully",
    });

    resetEmail({
      to:req.body.email
    });


   

  } catch (error) {
    console.log(error);
  }
});

router.post("/register/otp", async (req, res) => {
  const { email } = req.body;
  const { password }=req.body;
  const {fullName }=req.body;
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
    
    res.status(200).json({
      success: true,
      status: 200,
      message: "OTP correct ",
    });

    sendUserDetails({
      to:req.body.email,
      password:req.body.password,
      fullName:req.body.fullName
    });


   

  } catch (error) {
    console.log(error);
  }
});




// const express = require("express");
// const { hashPassword, sendWelcomeEmail, resendWelcomeEmail } = require("../../utils");
// const UsersDatabase = require("../../models/User");
// const router = express.Router();
// const { v4: uuidv4 } = require("uuid");

// // Function to generate a referral code
// function generateReferralCode(length) {
//   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let code = "";

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     code += characters.charAt(randomIndex);
//   }

//   return code;
// }



// // Your registration route

// // Your registration route
// router.post("/register", async (req, res) => {
//   const { fullName, lastName, email, password, country, referralCode } = req.body;

//   try {
//     // Check if any user has that email
//     const user = await UsersDatabase.findOne({ email });

//     if (user) {
//       return res.status(400).json({
//         success: false,
//         message: "Email address is already taken",
//       });
//     }

//     // Find the referrer based on the provided referral code
//     let referrer = null;
//     if (referralCode) {
//       referrer = await UsersDatabase.findOne({ referralCode });
//       // You can remove the code that checks for a valid referral code here

//       // Optionally, you can handle the case where the referral code is invalid
//       // by setting referrer to null and proceeding with registration
//     }

//     // Create a new user with referral information
//     const newUser = {
//       fullName,
//       lastName,
//       email,
//       password: hashPassword(password),
//       country,
//       amountDeposited: 0,
//       profit: 0,
//       balance: 0,
//       referalBonus: 0,
//       transactions: [],
//       withdrawals: [],
//       accounts: {
//         eth: {
//           address: "",
//         },
//         ltc: {
//           address: "",
//         },
//         btc: {
//           address: "",
//         },
//         usdt: {
//           address: "",
//         },
//       },
//       verified: false,
//       isDisabled: false,
//       referralCode: generateReferralCode(6), // Generate a referral code for the new user
//       referredBy: referrer ? referrer._id : null, // Store the ID of the referrer if applicable
//       referredUsers: [], // Initialize the referredUsers property as an empty array
//     };

//     // Create the new user in the database
//     const createdUser = await User.create(newUser);
//     const token = uuidv4();
//     sendWelcomeEmail({ to: email, token });

//     // If there's a referrer, update their referredUsers list
//     if (referrer) {
//       referrer.referredUsers.push(createdUser._id);
//       await referrer.save();
//     }

//     return res.status(200).json({ code: "Ok", data: createdUser });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });
module.exports = router;
