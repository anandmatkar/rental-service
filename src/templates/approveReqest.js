module.exports.approvalNotification = function (userName, itemDetails, otp) {
  let approvalNotification = `<!DOCTYPE html>
    <html lang="en">
     <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Approval Notification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
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
    
          .container .item-details {
            border: 2px solid #dddddd;
            padding: 20px;
            margin-bottom: 20px;
            background-color: #f9f9f9;
            color: #666666;
            font-size: 16px;
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
          <h1>Item Purchase Approval</h1>
          <p>Dear ${userName},</p>
          <p>Congratulations! Your request to purchase the following item has been approved:</p>
          <div class="item-details">
            <p><strong>Item Name:</strong> ${itemDetails.item_name}</p>
            <p><strong>Description:</strong> ${itemDetails.item_description}</p>
            <p><strong>Deposit Price:</strong> ${itemDetails.deposit_price}</p>
            <p><strong>Rental Price:</strong> ${itemDetails.rental_price}</p>
            <p><strong>Total Price:</strong> ${itemDetails.total_price}</p>
            <br />
            <h3>Renter Details</h3>
            <p><strong>Name:</strong> ${itemDetails.renter_name}</p>
            <p><strong>Email:</strong> ${itemDetails.renter_email}</p>
          </div>
          <div class="otp-container">
            <span><strong>One-Time Password (OTP):</strong></span>
            <span>${otp}</span>
          </div>
          <p>
            Please use the above OTP while you go to receive the item.
          </p>
          <p>
            If you have any further questions or concerns, Please contact us : therentoplace@gmail.com`;

  return approvalNotification;
}
