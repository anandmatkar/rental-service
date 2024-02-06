const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const { mysql_real_escape_string } = require("../utils/helper");
const jsonwebtoken = require("jsonwebtoken");
const { featureValidation } = require("../utils/validation");

module.exports.requestToFeature = async (req, res) => {
    try {
        let { id } = req.user
        let { item_id, start_date, end_date } = req.query
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: id });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {

            let errors = await featureValidation.requestTOFeatureValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }

            let s2 = dbScript(db_sql["Q59"], { var1: item_id, var2: id });
            let findItem = await connection.query(s2);
            if (findItem.rowCount > 0) {
                let s2 = dbScript(db_sql["Q65"], { var1: item_id, var2: id });
                let checkIfAlready = await connection.query(s2);
                if (checkIfAlready.rowCount == 0) {
                    let s3 = dbScript(db_sql["Q60"], { var1: item_id, var2: findItem.rows[0].category_id, var3: id, var4: findItem.rows[0].item_name, var5: findItem.rows[0].description, var6: findItem.rows[0].deposit_price, var7: findItem.rows[0].rental_price, var8: start_date, var9: end_date, var10: "requested", var11: findItem.rows[0].image });
                    let insertItem = await connection.query(s3);
                    if (insertItem.rowCount > 0) {
                        await connection.query("COMMIT")
                        res.json({
                            success: true,
                            status: 201,
                            message: "Item Requested For Featuring",
                        });
                    } else {
                        await connection.query("ROLLBACK")
                        res.json({
                            success: false,
                            status: 400,
                            message: "Something Went Wrong",
                        });
                    }
                } else {
                    await connection.query("ROLLBACK")
                    res.json({
                        success: false,
                        status: 400,
                        message: 'Can not request Item for featuring'
                    });
                }
            } else {
                await connection.query("ROLLBACK")
                res.json({
                    success: false,
                    status: 400,
                    message: "Item not found",
                    data: []
                });
            }
        } else {
            res.json({
                success: false,
                status: 400,
                message: "User not found"
            });
        }
    } catch (error) {
        await connection.query("ROLLBACK");
        res.json({
            success: false,
            status: 500,
            message: error.message
        });
    }
}

module.exports.featureProductList = async (req, res) => {
    try {
        let s2 = dbScript(db_sql["Q58"], { var1: true });
        let featureProduct = await connection.query(s2);
        if (featureProduct.rowCount > 0) {
            res.json({
                status: 200,
                success: true,
                message: "Feature Products Lists",
                data: featureProduct.rows
            })
        } else {
            res.json({
                status: 200,
                success: false,
                message: "Empty Feature Products Lists",
                data: []
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

module.exports.checkForFeatureRequest = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (token != undefined) {
            jsonwebtoken.verify(token, process.env.KEY, function (err, decoded) {
                if (err) {
                    return res.json({
                        status: 401,
                        success: false,
                        message: "Session timed out. Please sign in again",
                    });
                } else {
                    req.user = {
                        id: decoded.id,
                        email: decoded.email,
                    }
                    const checkDeactivated = async (id) => {
                        try {
                            let s1 = dbScript(db_sql['Q6'], { var1: id });
                            let findUser = await connection.query(s1);
                            return findUser.rows[0];
                        } catch (error) {
                            console.error(error);
                            return false;
                        }
                    };
                    (async () => {
                        let deactivated = await checkDeactivated(req.user.id)
                        if (deactivated) {
                            return res.json({
                                status: 401,
                                success: false,
                                message: "Session timed out. Please sign in again",
                            });
                        } else {
                            let userId = req.user.id;
                            let { item_id } = req.query
                            let s0 = dbScript(db_sql["Q5"], { var1: userId });
                            let findUser = await connection.query(s0);
                            if (findUser.rowCount > 0) {
                                let s1 = dbScript(db_sql["Q41"], { var1: userId, var2: item_id });
                                let findItem = await connection.query(s1);
                                if (findItem.rowCount > 0) {
                                    let s2 = dbScript(db_sql["Q65"], { var1: item_id, var2: userId });
                                    let checkIfAlready = await connection.query(s2);
                                    if (checkIfAlready.rowCount > 0) {
                                        res.json({
                                            success: true,
                                            status: 200,
                                            message: "Can not request for Feature",
                                            data: 0
                                        });
                                    } else {
                                        res.json({
                                            success: true,
                                            status: 200,
                                            message: "Can request for feature",
                                            data: 1
                                        });
                                    }
                                } else {
                                    res.json({
                                        success: true,
                                        status: 200,
                                        message: "Can not request for feature",
                                        data: 0
                                    });
                                }
                            } else {
                                res.json({
                                    success: false,
                                    status: 400,
                                    message: "User not found"
                                });
                            }
                        }
                    })();
                }
            });

        } else {
            res.json({
                success: true,
                status: 200,
                message: "Can not add review",
                data: 0
            });
        }

    } catch (error) {
        res.json({
            success: false,
            status: 500,
            message: error.message
        });
    }
}