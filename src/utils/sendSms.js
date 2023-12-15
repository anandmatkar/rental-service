const { Vonage } = require('@vonage/server-sdk');

module.exports.sendSms = async (phone, otp, userName) => {
    const vonage = new Vonage({
        apiKey: "bc00942b",
        apiSecret: "AHo5MSDLJPrL1MrV"
    })

    const from = "Vonage APIs"
    const to = phone
    const text = `Hi ${userName}, Welcome to Rental.com! Your OTP for verification is: ${otp}. Please enter this code to complete your registration. If you have any questions, contact our support. Thank you!`


    return await vonage.sms.send({ to, from, text })
        .then(resp => resp)
        .catch(err => err);


};
