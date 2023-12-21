module.exports.welcome = function (otp, userName, authLink) {
  console.log(process.env.COMPANY_LOGO);
  let welcomeTemp = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OTP Verification</title>
      <style>
          body {
              font-family: "Arial", sans-serif;
              margin: 0;
              padding: 0;
              background: url("https://example.com/background-image.jpg") center/cover no-repeat;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
          }
  
          .container {
              max-width: 600px;
              padding: 30px;
              background-color: rgba(255, 255, 255, 0.9);
              box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
              text-align: center;
              border-radius: 10px;
              margin: 20px;
          }
  
          .container img {
              max-width: 150px;
              height: auto;
              margin-bottom: 20px;
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
  
          .otp-container {
              display: inline-block;
              border: 2px solid #dddddd;
              padding: 20px;
              margin-bottom: 20px;
              background-color: #f9f9f9;
              color: #333333;
              font-size: 24px;
              font-weight: bold;
          }
  
          .container .otp-container span {
              font-size: 16px;
              color: #666666;
              margin-top: 10px;
              display: block;
          }
  
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #1bb2cc;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              transition: background-color 0.3s ease;
          }
  
          .button:hover {
              background-color: #126d89;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <img src="${process.env.COMPANY_LOGO}" alt="Logo" />
          <h1>OTP Verification</h1>
          <p>Dear ${userName},</p>
           Welcome to Rental.com.
        <p>Your one-time password (OTP) for account verification is:</p>
          <div class="otp-container">${otp}</div>
          <p>
              Please click the button below to
              <a href="${authLink}" class="button"><u>Verify</u></a>
             
          </p>
          <p>
            If you have any further queries, feel free to
              reach out to us at
              <a href="mailto:support@rental.com">support@rental.com</a>
          </p>
          <p>Thank you for using our service!</p>
        
      </div>
  </body>
  
  </html>
  `

  return welcomeTemp
}



