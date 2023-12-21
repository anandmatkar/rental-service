const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");

module.exports.addItem = async (req, res) => {
    try {
        let { id, email } = req.user;
        let { item_name, item_description, deposit_price, rental_price, availability_status, category_selected, category_id, category_name, category_description, category_image } = req.body;
        await connection.query("BEGIN");

        let s1 = dbScript(db_sql["Q5"], { var1: id });
        let findUser = await connection.query(s1);

        if (findUser.rowCount > 0) {
            if (!category_selected) {
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

                let s3 = dbScript(db_sql["Q18"], { var1: category_name.toLowerCase(), var2: category_description, var3: category_image, var4: email });
                let addCategory = await connection.query(s3);
                if (addCategory.rowCount > 0) {
                    category_id = addCategory.rows[0].id
                } else {
                    await connection.query('ROLLBACK')
                    res.json({
                        status: 400,
                        success: false,
                        message: "Something Went Wrong"
                    })
                }
            }
            let s4 = dbScript(db_sql["Q24"], { var1: category_id, var2: id, var3: item_name, var4: item_description, var5: deposit_price, var6: rental_price, var7: availability_status });
            let addItem = await connection.query(s4);

            if (addItem.rowCount > 0) {
                await connection.query("COMMIT");
                res.json({
                    status: 201,
                    success: true,
                    message: "Item Added successfully."
                });
            } else {
                await connection.query("ROLLBACK");
                res.json({
                    status: 400,
                    success: false,
                    message: "Something went wrong"
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
};

module.exports.ownUploadedItems = async (req, res) => {
    try {
        let { id, email } = req.user;
        let s1 = dbScript(db_sql["Q5"], { var1: id });
        let findUser = await connection.query(s1);

        if (findUser.rowCount > 0) {
            let s1 = dbScript(db_sql["Q29"], { var1: id });
            let findItems = await connection.query(s1);
            if (findItems.rowCount > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Items List",
                    data: findItems.rows
                });
            } else {
                res.json({
                    status: 200,
                    success: false,
                    message: "No Items Found.",
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

module.exports.allItems = async (req, res) => {
    try {
        let s1 = dbScript(db_sql["Q25"], {});
        let findItems = await connection.query(s1);
        if (findItems.rowCount > 0) {
            res.json({
                status: 200,
                success: true,
                message: "Items List",
                data: findItems.rows
            });
        } else {
            res.json({
                status: 200,
                success: false,
                message: "Empty Item lists",
                data: []
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

module.exports.itemDetails = async (req, res) => {
    try {
        let s2 = dbScript(db_sql["Q26"], { var1: itemId });
        let itemDetails = await connection.query(s2);
        if (itemDetails.rowCount > 0) {
            res.json({
                success: true,
                status: 200,
                message: "Item Details",
                data: itemDetails.rows
            });
        } else {
            res.json({
                success: false,
                status: 400,
                message: "No details Found",
                data: []
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

module.exports.editItem = async (req, res) => {
    try {
        let { id, email } = req.user;
        let { item_name, description, deposit_price, rental_price, availability_status, item_id } = req.body;
        await connection.query("BEGIN");

        let s1 = dbScript(db_sql["Q5"], { var1: id });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q27"], { var1: item_name, var2: description, var3: deposit_price, var4: rental_price, var5: availability_status, var6: item_id });
            let editItem = await connection.query(s2);
            if (editItem.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: "Item Updated successfully."
                });
            } else {
                await connection.query("ROLLBACK")
                res.json({
                    success: false,
                    status: 400,
                    message: "Something went wrong."
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

// module.exports.requestItemForRent = async (req, res) => {
//     try {
//         let receiver_id = req.user.id;
//         let { renter_id, item_id, start_date, end_date, category_name, item_name, description, deposit_price, rental_price } = req.body;

//         let [total_price, renter_name, renter_email, reveiver_name, reveiver_email, status, approval_otp] =
//             await connection.query("BEGIN");
//         let s1 = dbScript(db_sql["Q5"], { var1: receiver_id });
//         let findUser = await connection.query(s1);
//         if (findUser.rowCount > 0) {
//             let s2 = dbScript(db_sql['Q31'], { var1: receiver_id, var2: renter_id })
//             let usersDetail = await connection.query(s2)
//             console.log(usersDetail.rows, "userDetails");

//         } else {
//             res.json({
//                 success: false,
//                 status: 400,
//                 message: "User not found"
//             });
//         }
//     } catch (error) {
//         await connection.query("ROLLBACK");
//         res.json({
//             success: false,
//             status: 500,
//             message: error.message
//         });
//     }
// }