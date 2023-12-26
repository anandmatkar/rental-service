const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const { mysql_real_escape_string } = require("../utils/helper");
const { genericMail } = require("../utils/sendMail");
const { issueJWT } = require("../utils/jwt");

module.exports.addReview = async (req, res) => {
    try {
        let userId = req.user.id;
        let { item_id, rating, comments, images } = req.body
        await connection.query("BEGIN");
        let s0 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s0);
        if (findUser.rowCount > 0) {

            let s1 = dbScript(db_sql["Q41"], { var1: userId });
            let findItem = await connection.query(s1);

            if (findItem.rowCount === 0) {
                let s0 = dbScript(db_sql["Q42"], { var1: userId });
                let checkReveiver = await connection.query(s0);
                if (checkReveiver.rowCount > 0) {
                    let s2 = dbScript(db_sql["Q39"], { var1: item_id, var2: userId, var3: rating, var4: comments });
                    let addReview = await connection.query(s2);

                    if (images.length > 0) {
                        // let s3 = dbScript(db_sql["Q40"], { var1: userId });
                        // let addImages = await connection.query(s3);
                    }
                    if (addReview.rowCount > 0) {
                        await connection.query("COMMIT")
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
            let s1 = dbScript(db_sql["Q44"], { var1: rating, var2: comments, var3: review_id, var4: userId });
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

