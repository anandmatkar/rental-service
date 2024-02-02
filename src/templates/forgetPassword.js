module.exports.forgetPassword = function (verificationLink, userName, otp, userAgent) {
  const isPostmanOrWindows = userAgent.includes('PostmanRuntime') || userAgent.includes('Mozilla') || userAgent.includes('Windows');

  let forgetPasswordTemp;

  if (isPostmanOrWindows) {
    forgetPasswordTemp = `<!DOCTYPE html>
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
            <img src="${process.env.COMPANY_LOGO}" alt="Logo" />
            <h1>Password Reset Link</h1>
            <p>Dear ${userName},</p>
            <p>You have requested to reset your password. Please click on the following link to proceed:</p>
            <div class="otp-container">
              <a href="${verificationLink}" class="button">Reset Password</a>
            </div>
            <p>
              If you did not request this password reset, please ignore this email. If you have any further concerns, feel free to
              reach out to us at therentoplace@gmail.com
            </p>
            <p>Thank you!</p>
          </div>
        </body>
      </html>
      `;
  } else {
    forgetPasswordTemp = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Reset Password OTP</title>
          <style>
            /* Your existing styles here */
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${process.env.COMPANY_LOGO}" alt="Logo" />
            <h1>Password Reset OTP</h1>
            <p>Dear ${userName},</p>
            <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
            <div class="otp-container">
              <p class="otp">${otp}</p>
            </div>
            <p>
              If you did not request this password reset, please ignore this email. If you have any further concerns, feel free to
              reach out to us at therentoplace@gmail.com
            </p>
            <p>Thank you!</p>
          </div>
        </body>
      </html>
      `;
  }

  return forgetPasswordTemp;
}
