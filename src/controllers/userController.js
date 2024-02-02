const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const bcrypt = require("bcrypt");
const { sendSms } = require("../utils/sendSms");
const { generateOtp, mysql_real_escape_string, capitalizeEachWord } = require("../utils/helper");
const { genericMail } = require("../utils/sendMail");
const { issueJWT, verifyTokenForVerification } = require("../utils/jwt");
const jwt = require("../utils/jwt");
const { body, validationResult } = require('express-validator');
const userValidation = require("../utils/validation");


module.exports.createUser = async (req, res) => {
    try {

        const validationRules = [
            body('first_name').isLength({ min: 1 }).withMessage('First name is required'),
            body('last_name').isLength({ min: 1 }).withMessage('Last name is required'),
            body('email').isEmail().withMessage('Invalid email address'),
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
            body('phone').isMobilePhone().withMessage('Invalid phone number'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array()[0].msg;
            return res.json({ status: 422, message: firstError, success: false });
        }

        let {
            first_name, last_name, email, password, phone, avatar, address, city, pincode, state,
        } = req.body;
        const userAgent = req.get('User-Agent');

        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q1"], { var1: email.toLowerCase() });
        let findUser = await connection.query(s1);
        if (findUser.rowCount === 0) {

            avatar = avatar ? avatar : process.env.DEFAULT_AVATAR

            let otp = generateOtp()

            const encryptedPassword = await bcrypt.hash(password, 10);

            let s2 = dbScript(db_sql["Q2"], {
                var1: mysql_real_escape_string(capitalizeEachWord(first_name)), var2: mysql_real_escape_string(capitalizeEachWord(last_name)), var3: mysql_real_escape_string(email.toLowerCase()), var4: encryptedPassword, var5: phone, var6: avatar, var7: otp
            });
            let insertUser = await connection.query(s2);


            let s3 = dbScript(db_sql["Q3"], {
                var1: mysql_real_escape_string(capitalizeEachWord(address)), var2: mysql_real_escape_string(capitalizeEachWord(city)), var3: mysql_real_escape_string(pincode), var4: mysql_real_escape_string(capitalizeEachWord(state)), var5: insertUser.rows[0].id
            });
            let insertAddress = await connection.query(s3);
            if (insertUser.rowCount > 0 && insertAddress.rowCount > 0) {
                let user = {
                    id: insertUser.rows[0].id,
                    email: insertUser.rows[0].email
                }
                let token = await issueJWT(user)
                let authLink = `${process.env.AUTH_LINK}/${token}`
                await connection.query("COMMIT")

                genericMail(email, otp, capitalizeEachWord(first_name), authLink, "welcome", "", userAgent)
                // let sms = await sendSms(phone, otp, first_name)
                // if (sms.messages[0].status == 0) {
                res.json({
                    status: 201,
                    success: true,
                    message: "Registration Successful.",
                    data: insertUser.rows[0]
                });
                // } else {
                //     res.json({
                //         status: 400,
                //         success: false,
                //         message: "Something went wrong",
                //     });
                // }
            } else {
                // await connection.query("ROLLBACK")
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
//verifying user
module.exports.verifyUserWithLink = async (req, res) => {
    try {
        let user = await verifyTokenForVerification(req)
        await connection.query('BEGIN')
        if (user) {
            let s1 = dbScript(db_sql['Q28'], { var1: user.id })
            let checkuser = await connection.query(s1)
            if (checkuser.rows.length > 0) {
                let _dt = new Date().toISOString();
                let s2 = dbScript(db_sql['Q4'], { var1: true, var2: _dt, var3: null, var4: user.email })
                let updateuser = await connection.query(s2)
                if (updateuser.rowCount == 1) {
                    await connection.query('COMMIT')
                    res.json({
                        status: 200,
                        success: true,
                        message: "User verified Successfully"
                    })
                } else {
                    await connection.query('ROLLBACK')
                    res.json({
                        status: 400,
                        success: false,
                        message: "Something went wrong"
                    })
                }

            } else {
                res.json({
                    status: 400,
                    success: false,
                    message: "This User Is Not Exits"
                })
            }
        } else {
            res.json({
                status: 400,
                success: false,
                message: "Token not found",
            });
        }
    } catch (error) {
        await connection.query('ROLLBACK')
        res.json({
            success: false,
            status: 400,
            message: error.message,
            data: ""
        })
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body

        let s1 = dbScript(db_sql["Q1"], { var1: email.toLowerCase() });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            if (findUser.rows[0].is_active == true) {
                if (findUser.rows[0].is_verified) {
                    const result = await bcrypt.compare(password, findUser.rows[0].password);
                    if (result) {
                        let jwtToken = await issueJWT(findUser.rows[0]);
                        res.send({
                            status: 200,
                            success: true,
                            message: "Login successfull",
                            data: {
                                token: jwtToken,
                                userData: {
                                    id: findUser.rows[0].id,
                                    first_name: findUser.rows[0].first_name,
                                    last_name: findUser.rows[0].last_name,
                                    avatar: findUser.rows[0].avatar
                                }
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
                    res.json({
                        status: 400,
                        success: false,
                        message: "Please Verify first for login"
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
        let s1 = dbScript(db_sql["Q28"], { var1: userId });
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

module.exports.editUser = async (req, res) => {
    try {
        let userId = req.user.id
        let {
            first_name, last_name, avatar, address, city, pincode, state, email
        } = req.body
        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q8"], { var1: mysql_real_escape_string(capitalizeEachWord(first_name)), var2: mysql_real_escape_string(capitalizeEachWord(last_name)), var3: avatar, var4: email.toLowerCase(), var5: userId });
            let editUser = await connection.query(s2);
            let s3 = dbScript(db_sql["Q9"], { var1: mysql_real_escape_string(capitalizeEachWord(address)), var2: mysql_real_escape_string(capitalizeEachWord(city)), var3: pincode, var4: mysql_real_escape_string(capitalizeEachWord(state)), var5: userId });
            let editUserAddress = await connection.query(s3);
            if (editUser.rowCount > 0 && editUserAddress.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: "User edited successfully"
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

module.exports.changePassword = async (req, res) => {
    try {
        let userId = req.user.id
        let {
            oldPassword, currentPassword
        } = req.body
        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            const result = await bcrypt.compare(oldPassword, findUser.rows[0].password);
            if (result) {
                await connection.query("BEGIN")
                const encryptedPassword = await bcrypt.hash(currentPassword, 10);
                let s2 = dbScript(db_sql["Q10"], { var1: encryptedPassword, var2: null, var3: 'id', var4: userId });
                let changePassword = await connection.query(s2);
                if (changePassword.rowCount > 0) {
                    await connection.query("COMMIT")
                    res.json({
                        success: true,
                        status: 200,
                        message: "Password Changed Successfully."
                    })
                } else {
                    res.json({
                        success: false,
                        status: 400,
                        message: "Something went wrong"
                    })
                }
            } else {
                res.json({
                    success: false,
                    status: 400,
                    message: "Incorrect Old Password"
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

module.exports.forgetPassword = async (req, res) => {
    try {
        let {
            email
        } = req.body;
        let userAgent = req.get('User-Agent');
        console.log(userAgent, "userAgent");
        let s1 = dbScript(db_sql["Q1"], { var1: email });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            await connection.query("BEGIN")

            let otp = generateOtp()
            let s2 = dbScript(db_sql["Q11"], { var1: otp, var2: email });
            let setOtp = await connection.query(s2);
            if (setOtp.rowCount > 0) {
                const token = await issueJWT({ id: findUser.rows[0].id, email: findUser.rows[0].email })
                const link = `${process.env.FORGET_PASSWORD_LINK}/${token}`
                genericMail(email, otp, capitalizeEachWord(findUser.rows[0].first_name), link, "forget", "", userAgent)
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: `Otp has sent successfully on your registered Email address: ${email} `
                })
            } else {
                res.json({
                    success: false,
                    status: 400,
                    message: "Something Went Wrong"
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

module.exports.resetPassword = async (req, res) => {
    try {
        let {
            password
        } = req.body;

        let user = await verifyTokenForVerification(req)
        if (user) {
            const validationRules = [
                body('password').isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
            ];
            await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }
            await connection.query("BEGIN")
            let s1 = dbScript(db_sql["Q28"], { var1: user.id });
            let findUser = await connection.query(s1);
            if (findUser.rowCount > 0) {
                let encryptedPassword = bcrypt.hashSync(password, 10);
                let s2 = dbScript(db_sql["Q10"], { var1: encryptedPassword, var2: null, var3: "id", var4: user.id });
                let resetPassowrd = await connection.query(s2);
                if (resetPassowrd.rowCount > 0) {
                    await connection.query("COMMIT")
                    res.json({
                        success: true,
                        status: 200,
                        message: "Password Changed successfully."
                    })
                } else {
                    await connection.query("ROLLBACK")
                    res.json({
                        success: false,
                        status: 400,
                        message: "Something Went Wrong"
                    })
                }
            } else {
                res.json({
                    success: false,
                    status: 400,
                    message: "User not found"
                })
            }
        } else {
            res.json({
                status: 400,
                success: false,
                message: "Link Expired, Please try again later",
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
}

module.exports.resetPasswordWithOtp = async (req, res) => {
    try {
        let {
            email, otp, password
        } = req.body

        const validationRules = [
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array()[0].msg;
            return res.json({ status: 422, message: firstError, success: false });
        }
        let s1 = dbScript(db_sql["Q1"], { var1: email });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            if (otp == findUser.rows[0].otp) {
                let encryptedPassword = bcrypt.hashSync(password, 10);
                let s2 = dbScript(db_sql["Q10"], { var1: encryptedPassword, var2: null, var3: "email", var4: email });
                let resetPassowrd = await connection.query(s2);
                if (resetPassowrd.rowCount > 0) {
                    await connection.query("COMMIT")
                    res.json({
                        success: true,
                        status: 200,
                        message: "Password Changed successfully."
                    })
                } else {
                    await connection.query("ROLLBACK")
                    res.json({
                        success: false,
                        status: 400,
                        message: "Something Went Wrong"
                    })
                }
            } else {
                return res.send({ status: 423, success: false, message: 'Invalid OTP' })
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

module.exports.userData = async (req, res) => {
    try {
        let userId = req.user.id
        let s1 = dbScript(db_sql["Q55"], { var1: userId });
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

module.exports.userList = async (req, res) => {
    try {
        let userId = req.user.id;
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            let s1 = dbScript(db_sql["Q17"], {});
            let userList = await connection.query(s1);
            if (userList.rowCount > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "User List",
                    data: userList.rows
                })
            } else {
                res.json({
                    status: 200,
                    success: false,
                    message: "Empty User List",
                    data: []
                })
            }
        } else {
            res.json({
                status: 400,
                success: false,
                message: "Admin not found"
            })
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            message: `Error Occurred ${error.message}`,
        });
    }
}
