module.exports.welcome = function (otp, userName, authLink) {
  console.log(authLink);
  let welcomeTemp = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
    
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background-color: #ffffff;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
          }
    
          .container img {
            max-width: 150px;
            height: auto;
          }
    
          .container h1 {
            font-size: 24px;
            color: #333333;
            margin-bottom: 10px;
          }
    
          .container p {
            font-size: 16px;
            color: #666666;
            margin-bottom: 20px;
          }
    
          .container .otp-container {
            display: inline-block;
            border: 2px solid #dddddd;
            padding: 20px;
            margin-bottom: 20px;
            background-color: #f9f9f9;
            color: #666666;
            font-size: 24px;
            font-weight: bold;
          }
    
          .container .otp-container span {
            font-size: 16px;
            color: #666666;
            margin-top: 10px;
            display: block;
          }
    
          .container .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #333333;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="{process.env.COMPANY_LOGO}" alt="Logo" />
          <h1>OTP Verification</h1>
          <p>Dear ${userName},</p>
          <p>Your one-time password (OTP) for account verification is:</p>
          <div class="otp-container">
            ${otp}
          </div>
          Please click on the given link for <a href="${authLink}" style="color:#1bb2cc;"><u>verify</u></a><br/>
          <p>
            Welcome to Rental.com. If you have any further queries, feel free to
            reach out to us at support@rental.com
          </p>
          <p>Thank you for using our service!</p>
        </div>
      </body>
    </html>
    `

  return welcomeTemp
}



