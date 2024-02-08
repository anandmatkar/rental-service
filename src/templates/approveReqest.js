// module.exports.approvalNotification = function (userName, itemDetails, otp) {
//   let approvalNotification = `<!DOCTYPE html>
//     <html lang="en">
//      <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>Approval Notification</title>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             background-color: #f5f5f5;
//           }

//           .container {
//             max-width: 600px;
//             margin: 0 auto;
//             padding: 30px;
//             background-color: #ffffff;
//             box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
//           }

//           .container img {
//             max-width: 150px;
//             height: auto;
//           }

//           .container h1 {
//             font-size: 24px;
//             color: #333333;
//             margin-bottom: 10px;
//           }

//           .container p {
//             font-size: 16px;
//             color: #666666;
//             margin-bottom: 20px;
//           }

//           .container .item-details {
//             border: 2px solid #dddddd;
//             padding: 20px;
//             margin-bottom: 20px;
//             background-color: #f9f9f9;
//             color: #666666;
//             font-size: 16px;
//           }

//           .container .otp-container {
//             display: inline-block;
//             border: 2px solid #dddddd;
//             padding: 20px;
//             margin-bottom: 20px;
//             background-color: #f9f9f9;
//             color: #666666;
//             font-size: 24px;
//             font-weight: bold;
//           }

//           .container .otp-container span {
//             font-size: 16px;
//             color: #666666;
//             margin-top: 10px;
//             display: block;
//           }

//           .container .button {
//             display: inline-block;
//             padding: 10px 20px;
//             background-color: #333333;
//             color: #ffffff;
//             text-decoration: none;
//             border-radius: 5px;
//           }
//         </style>
//      </head>
//      <body>
//         <div class="container">
//           <img src="${process.env.COMPANY_LOGO}" alt="Logo" />
//           <h1>Item Purchase Approval</h1>
//           <p>Dear ${userName},</p>
//           <p>Congratulations! Your request to purchase the following item has been approved:</p>
//           <div class="item-details">
//             <p><strong>Item Name:</strong> ${itemDetails.item_name}</p>
//             <p><strong>Description:</strong> ${itemDetails.item_description}</p>
//             <p><strong>Deposit Price:</strong> ${itemDetails.deposit_price}</p>
//             <p><strong>Rental Price:</strong> ${itemDetails.rental_price}</p>
//             <p><strong>Total Price:</strong> ${itemDetails.total_price}</p>
//             <br />
//             <h3>Renter Details</h3>
//             <p><strong>Name:</strong> ${itemDetails.renter_name}</p>
//             <p><strong>Email:</strong> ${itemDetails.renter_email}</p>
//           </div>
//           <div class="otp-container">
//             <span><strong>One-Time Password (OTP):</strong></span>
//             <span>${otp}</span>
//           </div>
//           <p>
//             Please use the above OTP while you go to receive the item.
//           </p>
//           <p>
//             If you have any further questions or concerns, Please contact us : therentoplace@gmail.com
//           </p>
//         </div>
//      </body>
//     </html>`;

//   return approvalNotification;
// }


module.exports.approvalNotification = function (userName, itemDetails, otp) {
  let approvalNotification = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Five</title>
    <style>
        .progress{
            width: 400px;
        }
        @media (max-width:768px)
        {
            .banner-container .banner .woman{
                display: none;
            }
            .progress{
                width: 285px;
                position: relative;
                bottom: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="banner-container" style="display: flex; align-items: center; justify-content: center;">
        <div class="banner" style="background: linear-gradient(-55deg, #FF7675 29%, #D63031 29.1%, #D63031 68%, #FF7675 68.1%); border-radius: 5px; margin: 10px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; box-shadow: 0 5px 10px #0005; overflow: hidden;">
            <div class="shoe" style="flex:1 1 250px; padding: 15px; text-align: center; ">
                <img src="./images/shoe.png" alt="" style="width: 70%;">
            </div>
            <div class="content" style="flex:1 1 250px; text-align: center; padding: 10px; text-transform: uppercase;">
                <span style="color: #eee; font-size: 25px;">Your</span>
                <h3 style="color: #fff; font-size: 30px; margin: 10px;">wait is over</h3>
                <p style="color: #fff; font-size: 20px; padding:10px 0; margin: 9px;">ready to gain your  seat in just.</p>
                <!-- <a href="#" class="btn" style="display: block; height: 40px; width: 150px; line-height: 40px; background:#fff; color: #D63031; margin: 5px auto; text-decoration: none;">view offer</a> -->
                <div class="progress" style="--progress: 0%; height: 20px;
                  border: 1px solid #fff;  padding: 8px 4px; margin-top: 20px;
                   box-shadow: 0 0 10px #aaa;">
                <div  class="bar"   style="width: var(--progress);  height: 100%;
                background: linear-gradient( rgb(198, 17, 17), pink,  rgb(198, 17, 17));  background-repeat: repeat;
                box-shadow: 0 0 10px 0px white;   animation:  shine 4s ease-in infinite,  end 1s ease-out 1 7s;
                  transition: width 3s ease 3s;--progress: 75%;"></div></div>
             <div style="margin-top: 20px;">
                <div style="color: #fff;">  Your number in line : <span
                    style="color: black; font-weight: 600; font-size: 18px;"> 100 </span></div>
                <div style="color: #fff; margin-top: 4px;">Estimated wait time : <span
                    style="color: black; font-weight: 600; font-size: 18px;">10 Minutes </span></div>
            </div>
            </div>
            <div class="woman" style="position: relative; bottom: -33px; padding: 10px; flex: 1 1 250px;">
                <img src="./images/women.png" alt="" style="width: 100%;">
            </div>
        </div>
    </div>
</body>
</html>
  `;

  return approvalNotification;
}
