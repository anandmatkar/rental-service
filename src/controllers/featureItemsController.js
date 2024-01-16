const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const { mysql_real_escape_string } = require("../utils/helper");

module.exports.requestToFeature = async (req, res) => {
    try {
        let { id } = req.user
        let { item_id, start_date, end_date } = req.query
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: id });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q59"], { var1: item_id, var2: id });
            let findItem = await connection.query(s2);
            console.log(findItem.rows, "findItem");
            if (findItem.rowCount > 0) {
                let s3 = dbScript(db_sql["Q60"], { var1: item_id, var2: findItem.rows[0].category_id, var3: id, var4: findItem.rows[0].item_name, var5: findItem.rows[0].description, var6: findItem.rows[0].deposit_price, var7: findItem.rows[0].rental_price, var8: start_date, var9: end_date, var10: "requested" });
                console.log(s3, "s333333333");
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
        let s2 = dbScript(db_sql["Q58"], {});
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