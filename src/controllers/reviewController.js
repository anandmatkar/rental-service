const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const { mysql_real_escape_string } = require("../utils/helper");
const { verifyTokenFn } = require("../utils/jwt");
const jsonwebtoken = require("jsonwebtoken");
const { reviewValidation } = require("../utils/validation");

module.exports.addReview = async (req, res) => {
    try {
        let userId = req.user.id;
        let { item_id, rating, comments, images } = req.body
        await connection.query("BEGIN");
        let s0 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s0);
        if (findUser.rowCount > 0) {

            let errors = await reviewValidation.addReviewValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }

            let s1 = dbScript(db_sql["Q41"], { var1: userId, var2: item_id });
            let findItem = await connection.query(s1);

            if (findItem.rowCount === 0) {
                let s0 = dbScript(db_sql["Q42"], { var1: userId, var2: item_id });
                let checkReveiver = await connection.query(s0);
                if (checkReveiver.rowCount > 0) {
                    let s2 = dbScript(db_sql["Q39"], { var1: item_id, var2: userId, var3: rating, var4: mysql_real_escape_string(comments) });
                    let addReview = await connection.query(s2);

                    if (addReview.rowCount > 0) {

                        await connection.query("COMMIT")
                        if (images.length > 0) {
                            images.forEach(async (obj) => {
                                let s3 = dbScript(db_sql["Q40"], { var1: addReview.rows[0].id, var2: item_id, var3: userId, var4: obj.path, var5: obj.fileType });
                                let addImages = await connection.query(s3);
                            })

                        }
                        res.json({
                            success: true,
                            status: 201,
                            message: "Review Added successfully"
                        });
                    } else {
                        await connection.query("ROLLBACK")
                        res.json({
                            success: false,
                            status: 400,
                            message: "Something went wrong"
                        });
                    }
                } else {
                    await connection.query("ROLLBACK")
                    res.json({
                        success: false,
                        status: 400,
                        message: "You have not rent this product so you are not eligible for adding reviews."
                    });
                }
            } else {
                await connection.query("ROLLBACK")
                res.json({
                    success: false,
                    status: 400,
                    message: "Renter Can't add reviews"
                });
            }
        } else {
            await connection.query("ROLLBACK")
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

module.exports.uploadReviewImages = async (req, res) => {
    try {
        let files = req.files;
        let fileDetails = [];
        for (const file of files) {
            let path = `${process.env.REVIEW_ATTACHEMENTS}/${file.filename}`;

            const fileType = file.filename.split('_')[1].split('.')[0];

            fileDetails.push({ path, fileType });
        }
        res.json({
            status: 201,
            success: true,
            message: "Files Uploaded successfully!",
            data: fileDetails
        });
    } catch (error) {
        res.json({
            status: 400,
            success: false,
            message: error.message,
        });
    }
};

module.exports.reviewPerProduct = async (req, res) => {
    try {
        const { item_id } = req.query
        let s0 = dbScript(db_sql["Q43"], { var1: item_id });
        let reviews = await connection.query(s0);
        if (reviews.rowCount > 0) {

            // Extract ratings from the received data
            const ratings = reviews.rows.map(review => review.rating);

            // Calculate the average rating
            let averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
            averageRating = Number(averageRating.toFixed(1));

            averageRating = Math.round(averageRating * 2) / 2;
            res.json({
                success: true,
                status: 200,
                message: "Review List",
                data: {
                    averageRating: averageRating,
                    reviewData: reviews.rows
                }
            });
        } else {
            res.json({
                success: true,
                status: 200,
                message: "No reviews Found",
                data: {
                    averageRating: null,
                    reviewData: []
                }
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

module.exports.editReview = async (req, res) => {
    try {
        let userId = req.user.id;
        let { review_id, rating, comments } = req.body
        await connection.query("BEGIN");
        let s0 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s0);
        if (findUser.rowCount > 0) {
            let s1 = dbScript(db_sql["Q44"], { var1: rating, var2: mysql_real_escape_string(comments), var3: review_id, var4: userId });
            let editReview = await connection.query(s1);
            if (editReview.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: "Review Edited Successfully"
                });
            } else {
                await connection.query("ROLLBACK");
                res.json({
                    success: false,
                    status: 400,
                    message: "Something Went Wrong."
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

module.exports.deleteReview = async (req, res) => {
    try {
        let userId = req.user.id;
        let { review_id } = req.query
        await connection.query("BEGIN");
        let s0 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s0);
        if (findUser.rowCount > 0) {
            let _dt = new Date().toISOString();
            let s1 = dbScript(db_sql["Q45"], { var1: _dt, var2: review_id, var3: userId });
            let deleteReview = await connection.query(s1);
            if (deleteReview.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: "Review deleted Successfully"
                });
            } else {
                await connection.query("ROLLBACK");
                res.json({
                    success: false,
                    status: 400,
                    message: "Something Went Wrong."
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
//review list by user 
module.exports.reviewListPerUser = async (req, res) => {
    try {
        let userId = req.user.id;
        await connection.query("BEGIN");
        let s0 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s0);
        if (findUser.rowCount > 0) {
            let s1 = dbScript(db_sql["Q46"], { var1: userId });
            let reviews = await connection.query(s1);
            if (reviews.rowCount > 0) {
                res.json({
                    success: true,
                    status: 200,
                    message: "Reviews List",
                    data: reviews.rows
                });
            } else {
                res.json({
                    success: false,
                    status: 200,
                    message: "Empty Reviews List",
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
        res.json({
            success: false,
            status: 500,
            message: error.message
        });
    }
}

module.exports.checkForReviewAdd = async (req, res, next) => {
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
                                let s0 = dbScript(db_sql["Q42"], { var1: userId, var2: item_id });
                                let checkPurchased = await connection.query(s0);

                                let s1 = dbScript(db_sql["Q56"], { var1: item_id, var2: userId });
                                let checkAlreadyAdded = await connection.query(s1);
                                if (checkPurchased.rowCount > 0 && checkAlreadyAdded.rowCount == 0) {
                                    res.json({
                                        success: true,
                                        status: 200,
                                        message: "Can add review",
                                        data: 1
                                    });
                                } else {
                                    res.json({
                                        success: true,
                                        status: 200,
                                        message: "Can not add review",
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