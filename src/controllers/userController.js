const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const bcrypt = require("bcrypt");
const { sendSms } = require("../utils/sendSms");
const { generateOtp } = require("../utils/helper");
const { welcomeEmail } = require("../utils/sendMail");
const { issueJWT } = require("../utils/jwt");



module.exports.createUser = async (req, res) => {

    try {
        let {
            first_name, last_name, email, password, phone, avatar, user_type, address, city, pincode, state,
        } = req.body;

        let s1 = dbScript(db_sql["Q1"], { var1: email });
        let findUser = await connection.query(s1);
        if (findUser.rowCount === 0) {
            await connection.query("BEGIN")

            avatar = avatar ? avatar : process.env.DEFAULT_AVATAR

            let otp = generateOtp()

            const encryptedPassword = await bcrypt.hash(password, 10);

            let s2 = dbScript(db_sql["Q2"], {
                var1: first_name, var2: last_name, var3: email, var4: encryptedPassword, var5: phone, var6: avatar, var7: user_type, var8: otp
            });
            let insertUser = await connection.query(s2);


            let s3 = dbScript(db_sql["Q3"], {
                var1: address, var2: city, var3: pincode, var4: state, var5: insertUser.rows[0].id
            });
            let insertAddress = await connection.query(s3);
            if (insertUser.rowCount > 0 && insertAddress.rowCount > 0) {
                await connection.query("COMMIT")
                welcomeEmail(email, otp, first_name)
                // let sms = await sendSms(phone, otp, first_name)
                // console.log(sms.messages);
                // if (sms.messages[0].status == 0) {
                res.json({
                    status: 201,
                    success: true,
                    message: "Registration Successful.",
                });
                // } else {
                //     res.json({
                //         status: 400,
                //         success: false,
                //         message: "Something went wrong",
                //     });
                // }
            } else {
                res.json({
                    status: 400,
                    success: false,
                    message: "Something went wrong",
                });
            }

        } else {
            res.json({
                status: 409,
                success: false,
                message: "Email already exists",
            });
        }
    } catch (error) {
        await connection.query("ROLLBACK")
        res.json({
            status: 500,
            success: false,
            message: `Error Occurred ${error.message}`,
        });
    }
};

module.exports.verifyUser = async (req, res) => {
    try {
        const {
            email, otp
        } = req.body;

        let s1 = dbScript(db_sql["Q1"], { var1: email });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            if (findUser.rows[0].otp === otp) {
                await connection.query("BEGIN")

                let _dt = new Date().toISOString();

                let s2 = dbScript(db_sql["Q4"], { var1: true, var2: _dt, var3: null, var4: email });
                let verifyUser = await connection.query(s2);
                if (verifyUser.rowCount > 0) {
                    await connection.query("COMMIT")
                    res.json({
                        status: 200,
                        success: true,
                        message: "User verified successfully",
                    });
                } else {
                    res.json({
                        status: 400,
                        success: false,
                        message: "Something went wrong",
                    });
                }
            } else {
                return res.json({
                    status: 400,
                    success: false,
                    message: "Entered Incorrect OTP.",
                });
            }

        } else {
            return res.json({
                status: 400,
                success: false,
                message: "User not found with this email address.",
            });
        }
    } catch (error) {
        await connection.query("ROLLBACK")
        res.json({
            status: 500,
            success: false,
            message: "Error Occurred" + error.message,
        });
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body
        let s1 = dbScript(db_sql["Q1"], { var1: email });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            if (findUser.rows[0].is_active == true) {
                const result = await bcrypt.compare(password, findUser.rows[0].password);
                if (result) {
                    let jwtToken = await issueJWT(findUser.rows[0]);
                    res.send({
                        status: 200,
                        success: true,
                        message: "Login successfull",
                        data: {
                            token: jwtToken
                        }
                    });
                } else {
                    res.json({
                        status: 401,
                        success: false,
                        message: "Incorrect Password"
                    })
                }
            } else {
                return res.json({
                    status: 400,
                    success: false,
                    message: "You are Blocked by Admin Please contact Us.",
                });
            }
        } else {
            return res.json({
                status: 400,
                success: false,
                message: "Invalid Email or Password",
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            message: `Error Occurred ${error.message}`,
        });
    }
}

module.exports.uploadAvatar = async (req, res) => {
    try {
        let file = req.file
        let path = `${process.env.USER_AVATAR}/${file.filename}`;
        res.json({
            success: true,
            status: 201,
            message: "User profile uploaded successfully!",
            data: path
        })
    } catch (error) {
        res.json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

module.exports.showProfile = async (req, res) => {
    try {
        let userId = req.user.id
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            res.json({
                success: true,
                status: 200,
                message: "User details",
                data: findUser.rows
            })
        } else {
            res.json({
                success: false,
                status: 400,
                message: "User not found"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        let userId = req.user.id
        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let _dt = new Date().toISOString();
            let s2 = dbScript(db_sql["Q7"], { var1: _dt, var2: userId });
            let deleteUser = await connection.query(s2);
            if (deleteUser.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: "User deleted successfully"
                })
            } else {
                res.json({
                    success: false,
                    status: 400,
                    message: "Something went wrong."
                })
            }
        } else {
            res.json({
                success: false,
                status: 400,
                message: "User not found"
            })
        }

    } catch (error) {
        await connection.query("ROLLBACK")
        res.json({
            status: 500,
            success: false,
            message: `Error Occurred ${error.message}`,
        });
    }
}
