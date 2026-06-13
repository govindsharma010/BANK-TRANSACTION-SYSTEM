require('dotenv').config({path : "./src/.env"});
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({ // to interact with smtp server we have to create a transporter which will be used by our server to send emails to the users
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body 
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name){
    const subject = "welcome to backend Ledger"
    const text = `Hi ${name},\n\nWelcome to Backend Ledger! We're excited to have you on board.\n\nBest regards,\nThe Backend Ledger Team`
    const html = `<p>Hi ${name},</p><p>Welcome to Backend Ledger! We're excited to have you on board.</p><p>Best regards,<br>The Backend Ledger Team</p>`
    await sendEmail(userEmail, subject, text, html)
}

// async function sendTransactionSuccessEmail(userEmail, name, amount,transactionId, toAccount){
//    const subject = "Transaction Status"
//     const text = `Hi ${name},\n\nWelcome to Backend Ledger! Your Transaction Proceeded Successfully\n\nBest regards,\nThe Backend Ledger Team`
//     const html = `<p>Hi ${name},</p><p>Welcome to Backend Ledger! </p><p>Best regards,<br>The Backend Ledger Team</p>`
//     await sendEmail(userEmail, subject, text, html)
// }
async function sendTransactionSuccessEmail(
    userEmail,
    name,
    amount,
    transactionId,
    receiverAccount
){
    const subject = "Transaction Successful";

    const text = `
Hi ${name},

Your transaction has been completed successfully.

Transaction ID: ${transactionId}
Amount: ₹${amount}
Transferred To: ${receiverAccount}

Thank you for using Backend Ledger.

Best regards,
Backend Ledger Team
`;

    const html = `
        <h2>Transaction Successful</h2>
        <p>Hi ${name},</p>

        <p>Your transaction has been completed successfully.</p>

        <ul>
            <li><strong>Transaction ID:</strong> ${transactionId}</li>
            <li><strong>Amount:</strong> ₹${amount}</li>
            <li><strong>Transferred To:</strong> ${receiverAccount}</li>
        </ul>

        <p>Thank you for using Backend Ledger.</p>

        <p>
            Best regards,<br>
            Backend Ledger Team
        </p>
    `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(
    userEmail,
    name,
    amount,
    reason
){
    const subject = "Transaction Failed";

    const text = `
Hi ${name},

Unfortunately, your transaction could not be completed.

Amount: ₹${amount}
Reason: ${reason}

Please try again later or contact support.

Best regards,
Backend Ledger Team
`;

    const html = `
        <h2>Transaction Failed</h2>

        <p>Hi ${name},</p>

        <p>
            Unfortunately, your transaction could not be completed.
        </p>

        <ul>
            <li><strong>Amount:</strong> ₹${amount}</li>
            <li><strong>Reason:</strong> ${reason}</li>
        </ul>

        <p>Please try again later or contact support.</p>

        <p>
            Best regards,<br>
            Backend Ledger Team
        </p>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionSuccessEmail,
    sendTransactionFailureEmail

} 