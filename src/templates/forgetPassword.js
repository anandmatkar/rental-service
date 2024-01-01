module.exports.forgetPassword = function (verificationLink, userName) {
  let forgetPasswordTemp = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Reset Password Link</title>
          <style>
            /* Your existing styles here */
          </style>
        </head>
        <body>
          <div class="container">
            <img src="{process.env.COMPANY_LOGO}" alt="Logo" />
            <h1>Password Reset Link</h1>
            <p>Dear ${userName},</p>
            <p>You have requested to reset your password. Please click on the following link to proceed:</p>
            <div class="otp-container">
              <a href="${verificationLink}" class="button">Reset Password</a>
            </div>
            <p>
              If you did not request this password reset, please ignore this email. If you have any further concerns, feel free to
              reach out to us at support@rental.com
            </p>
            <p>Thank you!</p>
          </div>
        </body>
      </html>
      `;

  return forgetPasswordTemp;
}
