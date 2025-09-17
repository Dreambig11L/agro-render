const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const axios = require("axios");
var nodemailer = require("nodemailer");
const speakeasy = require('speakeasy');

const secret = speakeasy.generateSecret({ length: 4 });


const hashPassword = (password) => {
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const compareHashedPassword = (hashedPassword, password) => {
  const isSame = bcrypt.compareSync(password, hashedPassword);
  return isSame;
};




// const sendDepositEmail = async ({ from, amount, method,timestamp}) => {
//   let transporter = nodemailer.createTransport({
//     host: "mail.privateemail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER, // generated ethereal user
//       pass: process.env.EMAIL_PASSWORD, // generated ethereal password
//     },
//   });

//   let info = await transporter.sendMail({
//     from: `${process.env.EMAIL_USER}`, // sender address
//     to: "support@Agrowealthcapitals.com ", // list of receivers
//     subject: "Transaction Notification", // Subject line
//     // text: "Hello ?", // plain text body
//     html: `



const sendWithdrawalRequestEmail = async ({  from, amount, method,address }) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Agrowealthcapitals.com ", // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello Chief</p>

    <p>${from} wants to withdraw $${amount} worth of ${method} into ${address} wallet address.
    </p>

    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const userRegisteration = async ({  fullName,email}) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Agrowealthcapitals.com ", // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello Chief</p>

    <p>${fullName} with email ${email} just signed up.Please visit your dashboard for confirmation.
    </p>

    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};


const sendWithdrawalEmail = async ({  to,address, amount, method,timestamp,from }) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello ${from}</p>

    <p>You just sent a withdrawal request.
    </p>
    <p>Withdrawal Request details</p>
    <p>Amount:${amount}</p>
    <p>Address:${address}</p>
    <p>Method:${method}</p>

    
    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};


const sendDepositEmail = async ({  from, amount, method,timestamp }) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Agrowealthcapitals.com ", // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello Chief</p>

    <p>${from} said he/she just sent $${amount} worth of ${method}. Please confirm the transaction. 
    Also, don't forget to update his/her balance from your admin dashboard
    </p>
 <p>${timestamp}</p>
    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const sendDepositSubEmail = async ({  from, amount, method,timestamp,plan }) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Agrowealthcapitals.com ", // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello Chief</p>

    <p>${from} said he/she just subscribed to $${amount} worth of ${plan}. Please confirm the transaction. 
    </p>
 <p>${timestamp}</p>
    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};



const sendBankDepositRequestEmail = async ({  from, amount, method,timestamp }) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Agrowealthcapitals.com ", // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello Chief</p>

    <p>${from}  just sent bank transfer request for $${amount}. Please provide account details.
    </p>
 <p>${timestamp}</p>
    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const sendDepositApproval = async ({  from, amount, method,timestamp,to}) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello ${from}</p>

    <p>Your deposit of ${amount} of ${method} has been approved.</p>
    <p>Kindly visit your dashboard for more information</p>
    </p>
 <p>${timestamp}</p>
    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const sendPlanEmail = async ({  from, subamount, subname,timestamp }) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Agrowealthcapitals.com ", // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello Chief</p>

    <p>${from} said he/she just subscribed $${subamount}  of ${subname} plan. 
    </p>
 <p>${timestamp}</p>
    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};



const sendForgotPasswordEmail = async (email) => {
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: `${email}`, // list of receivers
    subject: "Password Reset", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <p>Dear esteemed user,</p>

    <p>Forgot your password?</p>
    <p>We received a request to reset the password for your account</p>

    <p>To reset your password, click on the link below
    <a href="https://Bevfx.com/reset-password">
    reset password
    </p>


    <p>If you did not make this request, please ignore this email</p>

    <p>Best wishes,</p>
    <p>Bevfx Team</p>
    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const sendVerificationEmail = async ({ from, url }) => {
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Agrowealthcapitals.com ", // list of receivers
    subject: "Account Verification Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <p>Hello Chief</p>

    <p>${from} just verified his Bevfx Team Identity
    </p>

    <p>Click <a href="${url}">here</a> to view the document</p>


    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

// const sendWelcomeEmail = async ({ to, token }) => {
//   async function verifyEmail() {
  

//     const response = axios.put(
//       `https://toptradexp.com/toptradexp.com/verified.html`
//     );

//     console.log("=============VERIFY EMAIL=======================");
//     console.log(response);
//     console.log("====================================");
//   }

//   let transporter = nodemailer.createTransport({
//     host: "mail.privateemail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER, // generated ethereal user
//       pass: process.env.EMAIL_PASSWORD, // generated ethereal password
//     },
//   });

//   let info = await transporter.sendMail({
//     from: `${process.env.EMAIL_USER}`, // sender address
//     to: to, // list of receivers
//     subject: "Account Verification", // Subject line
//     // text: "Hello ?", // plain text body
//     html: `
//     <html>
//     <h2>Welcome to Agrowealthcapitals</h2>

//     <p>Let us know if this is really your email address, 
//     to help us keep your account secure.
//     </p>


//     <p>Confirm your email and let's get started!</p>

//     <p>Your OTP is: ${speakeasy.totp({ secret: secret.base32, encoding: 'base32' })}</p>
//     <p>Best wishes,</p>
//     <p>Agrowealthcapitals Team</p>

//     </html>
    
//     `, // html body
//   });
// //'<a href="https://Bevfx.com/Bevfx.com/verified.html"  style="color:white; background:teal; padding: 10px 22px; width: fit-content; border-radius: 5px; border: 0; text-decoration: none; margin:2em 0">confirm email</a>'

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
// };


const sendWelcomeEmail = async ({ to, token }) => {
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"AgroWealthCapitals" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "🌱 Welcome to AgroWealthCapitals!",
    html: `
    <html>
      <body style="margin:0; padding:0; background-color:#f4f9f4; font-family:Arial, sans-serif; color:#333;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr style="background-color:#2e7d32;">
            <td align="center" style="padding:20px;">
              <img src="cid:logo" alt="Agrowealthcapitals Logo" width="80" style="display:block; margin-bottom:10px;">
              <h1 style="color:#ffffff; font-size:22px; margin:0;">Welcome to AgroWealthCapitals</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;">
              <p style="font-size:16px; line-height:1.5; color:#444;">
                Hi there 👋,
              </p>
              <p style="font-size:16px; line-height:1.5; color:#444;">
                We’re excited to have you join <b>AgroWealthCapitals</b> 🌿.  
                Our platform is built to help you grow your investments while supporting agriculture-driven innovation.
              </p>

              <p style="font-size:16px; line-height:1.5; color:#444;">
                Explore your dashboard, discover opportunities, and take the first step toward building your financial future.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin-top:25px;">
                <a href="https://toptradexp.com/dashboard.html" 
                   style="background-color:#2e7d32; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px; display:inline-block; font-weight:bold;">
                   🚀 Go to Dashboard
                </a>
              </div>

              <p style="font-size:14px; color:#555; margin-top:30px;">
                If you have any questions, our support team is here to help 🌾.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr style="background-color:#f1f8e9;">
            <td style="text-align:center; padding:20px; font-size:13px; color:#666;">
              <p style="margin:0;">© ${new Date().getFullYear()} AgroWealthCapitals 🌱 | All Rights Reserved</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `,
    attachments: [
      {
        filename: "logo.png", // replace with your actual logo
        path: "./logo.png",   // logo in root folder
        cid: "logo",          // reference for inline <img>
      },
    ],
  });

  console.log("Message sent: %s", info.messageId);
};




const resendWelcomeEmail = async ({ to, token }) => {
  async function reverifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com/toptradexp.com/verified.html`
    );

    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "Account Verification", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <h2>Welcome to Agrowealthcapitals</h2>

    <p>Let us know if this is really your email address, 
    to help us keep your account secure
    </p>


    <p>Confirm your email and let's get started!</p>

    <p>Your OTP is: ${speakeasy.totp({ secret: secret.base32, encoding: 'base32' })}</p>
    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });
//'<a href="https://Bevfx.com/Bevfx.com/verified.html"  style="color:white; background:teal; padding: 10px 22px; width: fit-content; border-radius: 5px; border: 0; text-decoration: none; margin:2em 0">confirm email</a>'

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const sendPasswordOtp = async ({ to }) => {
  async function reverifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com/toptradexp.com/verified.html`
    );

    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "Password Reset", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <h2>Welcome to Agrowealthcapitals</h2>

    <p>Your OTP is: ${speakeasy.totp({ secret: secret.base32, encoding: 'base32' })}</p>
    <p>This OTP is valid for a short period of time. Do not share it with anyone.</p>
    <p>If you did not request this OTP, please ignore this email.</p>



    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });
//'<a href="https://Bevfx.com/Bevfx.com/verified.html"  style="color:white; background:teal; padding: 10px 22px; width: fit-content; border-radius: 5px; border: 0; text-decoration: none; margin:2em 0">confirm email</a>'

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};



const resetEmail = async ({ to, token }) => {
  async function reverifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com.com/toptradexp.com/verified.html`
    );


    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "Change Password", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <h2>Welcome to Agrowealthcapitals</h2>

    <p>You have requested to change your password.Please use the following OTP to reset your password.
    </p>


    
    <p>Your OTP is: ${speakeasy.totp({ secret: secret.base32, encoding: 'base32' })}</p>


    <p>If you did not request this password reset,please contact our support immediately.</p>

    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });
//'<a href="https://Bevfx.com/Bevfx.com/verified.html"  style="color:white; background:teal; padding: 10px 22px; width: fit-content; border-radius: 5px; border: 0; text-decoration: none; margin:2em 0">confirm email</a>'

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};







const sendUserDepositSubEmail = async ({ from, amount, to, method, timestamp, plan, roi, tradeId }) => {
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"AgroWealthCapitals" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "🌱 Deposit Order Confirmation",
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: #2e7d32; padding: 20px; text-align: center;">
            <img src="cid:logo" alt="AgroWealthCapitals Logo" style="height: 60px; margin-bottom: 10px;" />
            <h2 style="color: #ffffff; margin: 0;">Deposit Notification</h2>
          </div>
          
          <!-- Body -->
          <div style="padding: 20px;">
            <p>Dear <strong>${from}</strong>,</p>
            <p>We have received your deposit order. Please find the details below for your reference:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Deposit Amount</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">$${amount}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Method</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${method}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Plan</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${plan || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>ROI</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${roi ? roi + "%" : "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Transaction ID</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${tradeId || "Pending"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Timestamp</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${new Date(timestamp).toLocaleString()}</td>
              </tr>
            </table>
            
            <p>💡 Please ensure that you send your deposit to your assigned wallet address. Once confirmed, your plan will be activated.</p>
            <p>If you have any questions, feel free to contact our <a href="mailto:support@agrowealthcapitals.com" style="color: #2e7d32; text-decoration: none;">support team</a>.</p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f1f8e9; padding: 15px; text-align: center; font-size: 14px; color: #666;">
            <p>🌱 AgroWealthCapitals — Growing Wealth, Nurturing Futures</p>
          </div>
        </div>
      </body>
    </html>
    `,
    attachments: [
      {
        filename: "logo.png",
        path: "./logo.png", // <-- Your logo in root folder
        cid: "logo" // same cid value as in img src
      }
    ]
  });

  console.log("Deposit Email sent: %s", info.messageId);
};


const sendUserPlanEmail = async ({  from, subamount, to,subname,timestamp }) => {
  async function verifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com/toptradexp.com/verified.html`
    );

    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to:to, // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello ${from},</p>

    <p>You  successfully subscribed to $${subamount} worth of ${subname} plan at ${timestamp}</p>
    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};



const sendUserDetails = async ({ to,password,fullName,token }) =>{
  async function reverifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com.com/toptradexp.com/verified.html`
    );


    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "User Details", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <h2>Hello ${fullName},</h2>

    <p>Thank you for registering on our site
    </p>

    <p>Your login information:</p>
   <p> Email: ${to}</p>
   <p> Password: ${password}</p>


    
    

    <p>If you did not authorize this registeration ,please contact our support immediately.</p>

    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}



const sendKycAlert = async ({ fullName }) =>{
  async function reverifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com.com/toptradexp.com/verified.html`
    );


    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Agrowealthcapitals.com ", // list of receivers
    subject: "User Details", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <h2>Hello Chief,</h2>

    <p>A user just submitted his/her KYC details.</p>
    <p>Kindly check your dashboard to view details</p>

    <p>Best wishes,</p>
    <p>Agrowealthcapitals Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}





module.exports = {
  hashPassword,
  userRegisteration,
  sendUserDepositEmail,
  compareHashedPassword,
  sendDepositEmail,
  sendPlanEmail,
  sendUserPlanEmail,
  sendUserDepositSubEmail,
  sendDepositApproval,
  sendPasswordOtp,
  sendForgotPasswordEmail,
  sendVerificationEmail,
  sendBankDepositRequestEmail,
  sendWithdrawalEmail,
  sendWithdrawalRequestEmail,
  sendWelcomeEmail,
  resendWelcomeEmail,
  resetEmail,
  sendKycAlert,
  sendDepositSubEmail,
  sendUserDetails
};
