const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const { issueJWT } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const { genericMail } = require("../utils/sendMail");
const { generateOtp } = require("../utils/helper");

/*=========================================================Auth Section==========================================*/

module.exports.login = async (req, res) => {
    try {
        let { email, password } = req.body
        let s1 = dbScript(db_sql["Q12"], { var1: email });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            let result = await bcrypt.compare(password, findAdmin.rows[0].password)
            if (result) {
                let user = {
                    id: findAdmin.rows[0].id,
                    email: findAdmin.rows[0].email
                }
                let token = await issueJWT(user)
                res.json({
                    status: 200,
                    success: true,
                    message: "Login Successful.",
                    data: token
                })
            } else {
                res.json({
                    status: 401,
                    success: false,
                    message: "Invalid Credentials"
                })
            }
        } else {
            res.json({
                status: 401,
                success: false,
                message: "Invalid Credentials"
            })
        }
    } catch (error) {

    }
}

module.exports.showProfile = async (req, res) => {
    try {
        let userId = req.user.id;
        let s1 = dbScript(db_sql["Q13"], { var1: userId });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            res.json({
                status: 200,
                success: true,
                message: "Admin Profile",
                data: findAdmin.rows[0]
            })
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
            message: error.message
        })
    }
}

module.exports.changePassword = async (req, res) => {
    try {
        let userId = req.user.id;
        let { oldPassword, currentPassword } = req.body
        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q13"], { var1: userId });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            let comparePassword = await bcrypt.compare(oldPassword, findAdmin.rows[0].password)
            if (comparePassword) {
                let _dt = new Date().toISOString()
                let encryptedPassword = await bcrypt.hash(currentPassword, 10)
                let s2 = dbScript(db_sql["Q14"], { var1: encryptedPassword, var2: _dt, var3: userId });
                let changePassword = await connection.query(s2);
                if (changePassword.rowCount > 0) {
                    await connection.query("COMMIT")
                    res.json({
                        status: 200,
                        success: true,
                        message: "Password Changed successfully."
                    })
                } else {
                    await connection.query("ROLLBACk")
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
                    message: "Incorrect old password"
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
        await connection.query("ROLLBACK")
        res.json({
            status: 500,
            success: false,
            message: error.message
        })
    }
}

module.exports.forgetPassword = async (req, res) => {
    try {
        let {
            email
        } = req.body;

        let s1 = dbScript(db_sql["Q12"], { var1: email });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            await connection.query("BEGIN")

            let otp = generateOtp()
            let s2 = dbScript(db_sql["Q15"], { var1: otp, var2: email });
            let setOtp = await connection.query(s2);
            if (setOtp.rowCount > 0) {
                // send mail with the OTP
                genericMail(email, otp, findAdmin.rows[0].name, "forget")
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
            email, otp, password
        } = req.body;

        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q12"], { var1: email });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            if (findAdmin.rows[0].otp == otp) {
                let encryptedPassword = bcrypt.hashSync(password, 10);
                let s2 = dbScript(db_sql["Q16"], { var1: encryptedPassword, var2: null, var3: "email", var4: email });
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
                    message: "Incorrect OTP"
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

/*=========================================================User Section==========================================*/

module.exports.userList = async (req, res) => {
    try {
        let userId = req.user.id;
        let s1 = dbScript(db_sql["Q13"], { var1: userId });
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

module.exports.userDetails = async (req, res) => {
    try {
        let { id } = req.user
        let { userId } = req.query
        let s1 = dbScript(db_sql["Q13"], { var1: id });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            let s2 = dbScript(db_sql["Q5"], { var1: userId });
            let userDetails = await connection.query(s2);
            if (userDetails.rowCount > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "User details",
                    data: userDetails.rows
                })
            } else {
                res.json({
                    status: 200,
                    success: false,
                    message: "Empty User details",
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

module.exports.deactivateUser = async (req, res) => {
    try {
        let { id } = req.user
        let { userId } = req.query
        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q13"], { var1: id });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            let _dt = new Date().toISOString()
            let s2 = dbScript(db_sql["Q23"], { var1: false, var2: _dt, var3: userId });
            let deactivateUser = await connection.query(s2);
            if (deactivateUser.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    status: 200,
                    success: true,
                    message: "User Deactivated successfully"
                })
            } else {
                await connection.query("ROLLBACk")
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
                message: "Admin not found"
            })
        }
    } catch (error) {
        await connection.query("ROLLBACk")
        res.json({
            status: 500,
            success: false,
            message: error.message
        })
    }
}

/*=========================================================Category Section==========================================*/

module.exports.addCategory = async (req, res) => {
    try {
        let { id, email } = req.user
        let { category_name, description, image } = req.body
        if (!category_name && !description || category_name == undefined && description == undefined) {
            return res.json({
                status: 400,
                success: false,
                message: "Please Provide All Credenitals"
            })
        }
        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q13"], { var1: id });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {

            let s2 = dbScript(db_sql["Q19"], { var1: category_name.toLowerCase() });
            let existingCategory = await connection.query(s2);
            if (existingCategory.rowCount > 0) {
                await connection.query("ROLLBACK")
                return res.json({
                    status: 400,
                    success: false,
                    message: "Category already exists"
                })
            }
            let s3 = dbScript(db_sql["Q18"], { var1: category_name.toLowerCase(), var2: description, var3: image, var4: email });
            let insertCategory = await connection.query(s3);
            if (insertCategory.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    status: 201,
                    success: true,
                    message: "Category Added successfully"
                })
            } else {
                await connection.query("ROLLBACK")
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
                message: "Admin not found"
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

module.exports.categoryLists = async (req, res) => {
    try {
        let { id, email } = req.user
        let s1 = dbScript(db_sql["Q13"], { var1: id });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            let s2 = dbScript(db_sql["Q20"], {});
            let categoryList = await connection.query(s2);
            if (categoryList.rowCount > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Category List",
                    data: categoryList.rows
                })
            } else {
                res.json({
                    status: 200,
                    success: false,
                    message: "Empty Category List",
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

module.exports.categoryDetails = async (req, res) => {
    try {
        let { id } = req.user
        let { catId } = req.query
        let s1 = dbScript(db_sql["Q13"], { var1: id });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            let s2 = dbScript(db_sql["Q21"], { var1: catId });
            let catDetails = await connection.query(s2);
            if (catDetails.rowCount > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Category Details",
                    data: catDetails.rows
                })
            } else {
                res.json({
                    status: 200,
                    success: false,
                    message: "Empty Category Details",
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
            message: error.message
        })
    }
}

module.exports.deleteCategory = async (req, res) => {
    try {
        let { id } = req.user
        let { catId } = req.query
        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q13"], { var1: id });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            let _dt = new Date().toISOString()
            let s2 = dbScript(db_sql["Q22"], { var1: _dt, var2: catId });
            let deleteCat = await connection.query(s2);
            if (deleteCat.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    status: 200,
                    success: true,
                    message: "Category Deleted successfully"
                })
            } else {
                await connection.query("ROLLBACK")
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
                message: "Admin not found"
            })
        }
    } catch (error) {
        await connection.query("ROLLBACk")
        res.json({
            status: 500,
            success: false,
            message: error.message
        })
    }
}

module.exports.approveOrRejectFeatureRequest = async (req, res) => {
    try {
        let { id } = req.user
        let { feat_id, status } = req.query
        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q13"], { var1: id });
        let findAdmin = await connection.query(s1);
        if (findAdmin.rowCount > 0) {
            let s2 = dbScript(db_sql["Q62"], { var1: status, var2: status == 'approved' ? true : false, var3: feat_id });
            let updateStatus = await connection.query(s2);
            if (updateStatus.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    status: 200,
                    success: true,
                    message: `Feature Request ${status} Successfully.`
                })
            } else {
                await connection.query("ROLLBACK")
                res.json({
                    status: 400,
                    success: false,
                    message: "Something went wrong."
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
        await connection.query("ROLLBACk")
        res.json({
            status: 500,
            success: false,
            message: error.message
        })
    }
}

module.exports.updateFeatureItemCron = async (req, res) => {
    try {
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q63"], { var1: true });
        let featureItemLists = await connection.query(s1);
        if (featureItemLists.rowCount > 0) {
            for (let i of featureItemLists.rows) {
                let currentDate = new Date();

                let options = { day: '2-digit', month: '2-digit', year: 'numeric' };

                let formattedDate = currentDate.toLocaleDateString('en-US', options);

                let [month, day, year] = formattedDate.split('/');
                let adjustedCurrentDate = `${day}-${month}-${year}`;
                console.log(adjustedCurrentDate);

                if (adjustedCurrentDate >= i.end_date) {
                    let s1 = dbScript(db_sql["Q62"], { var1: i.status, var2: false, var3: i.id });
                    let updateFeatureItem = await connection.query(s1);
                    console.log(updateFeatureItem.rows, "ddddddddd");

                    if (updateFeatureItem.rowCount > 0) {
                        await connection.query("COMMIT")
                    } else {
                        await connection.query("ROLLBACK");
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        await connection.query("ROLLBACK");
    }
};



