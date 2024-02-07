const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const { mysql_real_escape_string } = require("../utils/helper");
const { messageValidation, itemValidation } = require("../utils/validation");


module.exports.seekerItemList = async (req, res) => {
    try {
        let userId = req.user.id
        let { status } = req.query
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {

            let errors = await itemValidation.requestItemListValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }

            let s2 = dbScript(db_sql["Q76"], { var1: userId, var2: status });
            let requestedItems = await connection.query(s2);
            if (requestedItems.rowCount > 0) {
                res.json({
                    success: true,
                    status: 200,
                    message: "Items List",
                    data: requestedItems.rows
                })
            } else {
                res.json({
                    success: false,
                    status: 200,
                    message: "Empty Items List",
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