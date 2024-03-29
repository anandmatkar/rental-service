const nodemailer = require("nodemailer");
const { welcome } = require("../templates/welcome");
const { forgetPassword } = require("../templates/forgetPassword");
const { approvalNotification } = require("../templates/approveReqest");

// type = ["welcome","forget"]

module.exports.genericMail = async (email, otp, userName, authLink, type, details, userAgent) => {
    const smtpEndpoint = "smtp.gmail.com";
    const port = 587;
    const senderAddress = process.env.SMTP_USERNAME;
    var toAddresses = email;

    let template;
    let subject;
    let body_text;
    if (type === "welcome") {
        template = welcome(otp, userName, authLink, userAgent)
        subject = "Welcome to Rental.com"
        body_text = `Please verify your account with below given OTP`;
    } else if (type === "forget") {
        template = forgetPassword(authLink, userName, otp, userAgent)
        subject = "Forget Password Mail"
        body_text = `Please Reset your account with below given OTP`;
    } else if (type === "approved") {
        template = approvalNotification(userName, details, otp)
        subject = "Approval Confirmation Mail"
        body_text = `Item Request Has been approved`;
    }



    let transporter = nodemailer.createTransport({
        host: smtpEndpoint,
        port: port,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    let mailOptions = {
        from: senderAddress,
        to: toAddresses,
        subject: subject,
        text: body_text,
        html: template,
        headers: {}
    };

    let info = await transporter.sendMail(mailOptions)
    console.log("Message sent! Message ID: ", info.messageId);

}