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
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>One</title>
      <style>
          .text-container h1{
              margin: 0;
              font-size: 80px;
              color: rgba(225,225,225, .01);
    background-image: url("https://images.unsplash.com/photo-1499195333224-3ce974eecb47?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2cf549433129d4227d1879347b9e78ce&auto=format&fit=crop&w=1248&q=80");
    background-repeat: repeat;
    -webkit-background-clip:text;
    animation: animate 15s ease-in-out infinite;
              text-align: center;
              text-transform: uppercase;
              font-weight: 900;
              position: relative;
              bottom: 15px;
              -webkit-text-stroke: 1px black;
              text-stroke: 1px black;
  }
  @media only screen and (max-width: 768px) {
          .bodyWidth{
              width: 97% !important;
          }
     }
    @keyframes animate {
      0%, 100% {
        background-position: left top;
      }
      25%{
        background-position: right bottom;
       }
      50% {
        background-position: left bottom;
      }
      75% {
        background-position: right top;
      }
    }
      </style>
  </head>
  <body style="margin: 0; background-color: #ECEFE6; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
      <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ECEFE6; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;">
          <tbody>
              <tr>
                  <td>
      <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"     role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
          <tbody>
              <tr>
              <td>
  <tbody>
  <tr>
      <td class="column column-1" width="100%"
  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
  <table class="row-content stack bodyWidth" align="center" border="0"
  cellpadding="0" cellspacing="0" role="presentation"
  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;background-image: linear-gradient(to left top, #000000, #373536, #6D6A6A, #A9A3A4, #E9E1E1);border-radius: 45px; width: 800px; margin: 0 auto;  box-shadow: 0 0 10px 0px rgb(0, 0, 0);">
  <tbody>
      <tr>
  <td class="column column-1" style="padding: 20px;">
  <div class="contentBox">
      <div class="text-container">
          <h1>Welcome</h1>
          </div>
  <h1 style="color: #fff;">You don't have to wait much</h1>
      <div class="progress" style="--progress: 0%; width:364px; height: 14px;
            margin: 1em auto;   border: 1px solid #fff; border-radius: 40px;  padding: 10px 6px; position: relative; left: -40px;
    box-shadow: 0 0 10px #aaa;">
  <div class="bar"    style="width: var(--progress);  height: 100%;
    background: linear-gradient(#F9FCFF, #FFFFFF, #F9FCFF); background-repeat: repeat;
    box-shadow: 0 0 10px 0px rgb(255, 255, 255); border-radius: 50px;  animation:  shine 4s ease-in infinite,  end 1s ease-out 1 7s;
  transition: width 3s ease 3s;--progress: 75%;"></div>
  </div>
  <div style="color: #fff; font-size: 18px;"> Your number in line : <span
  style="color: rgb(246, 207, 233);  font: 1.25em sans-serif; font-weight: 900;"> ${userName} </span></div>
      <div style="color: #fff; margin-top: 4px; font-size: 18px;">Estimated wait time : <span
  style="color:  rgb(246, 207, 233); font: 1.25em sans-serif; font-weight: 900;">${otp} Minutes </span></div>
  </div>
  </td>
  <td class="column column-1" style="padding: 20px;">
  <img src="https://gourban.in/cdn/shop/files/dream-01.png?v=1705563970&width=1000"
  style=" width: 110%;   height:100%;  border-radius:50px;" />
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </body>
  </html>
  `;

  return approvalNotification;
}
