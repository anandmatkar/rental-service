const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const { generateOtp, dateGap, mysql_real_escape_string, notificationsOperations } = require("../utils/helper");
const { genericMail } = require("../utils/sendMail");


module.exports.addItem = async (req, res) => {
    try {
        let { id, email } = req.user;
        let { item_name, item_description, deposit_price, rental_price, item_images, category_id, category_name, unit } = req.body;
        await connection.query("BEGIN");

        let s1 = dbScript(db_sql["Q5"], { var1: id });
        let findUser = await connection.query(s1);

        if (findUser.rowCount > 0) {
            let s4 = dbScript(db_sql["Q24"], { var1: category_id, var2: id, var3: mysql_real_escape_string(item_name), var4: mysql_real_escape_string(item_description), var5: Number(deposit_price), var6: Number(rental_price), var7: true, var8: category_name ? category_name : addCategory.rows[0].category_name, var9: item_images[0].path, var10: unit });
            let addItem = await connection.query(s4);

            if (item_images.length > 0) {
                for (let obj of item_images) {
                    let s1 = dbScript(db_sql["Q50"], { var1: id, var2: addItem.rows[0].id, var3: obj.path });
                    let insertImages = await connection.query(s1);
                }
            }

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

module.exports.uploadItemImages = async (req, res) => {
    try {
        let files = req.files;
        let fileDetails = [];
        // Iterate through the uploaded files and gather their details
        for (const file of files) {
            let path = `${process.env.ITEM_ATTACHEMENTS}/${file.filename}`;
            fileDetails.push({ path });
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
}

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
            findItems.rows.forEach(item => {
                const roundedAverageRating = Math.round(parseFloat(item.average_rating) * 2) / 2;
                item.average_rating = roundedAverageRating.toString();
            });
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
        let { itemId } = req.query
        let s1 = dbScript(db_sql["Q26"], { var1: itemId });
        let itemDetails = await connection.query(s1);

        let s2 = dbScript(db_sql["Q57"], { var1: itemId });
        let reviewCount = await connection.query(s2);
        if (itemDetails.rowCount > 0) {
            itemDetails.rows[0].total_reviews = reviewCount.rows[0].total_reviews
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
        let { item_name, item_description, deposit_price, rental_price, item_id, unit, category_name, category_id } = req.body;
        await connection.query("BEGIN");

        let s1 = dbScript(db_sql["Q5"], { var1: id });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q27"], { var1: mysql_real_escape_string(item_name), var2: mysql_real_escape_string(item_description), var3: deposit_price, var4: rental_price, var5: category_name, var6: category_id, var7: unit, var8: item_id });
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

module.exports.requestItemForRent = async (req, res) => {
    try {
        let receiver_id = req.user.id;
        let { renter_id, item_id, start_date, end_date, category_name, item_name, description, deposit_price, rental_price, unit, pick_up_time, drop_off_time, image } = req.body;

        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: receiver_id });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql['Q31'], { var1: receiver_id, var2: renter_id })
            let usersDetail = await connection.query(s2)

            let receiver_name = `${usersDetail.rows[0].first_name} ${usersDetail.rows[0].last_name}`
            let renter_name = `${usersDetail.rows[1].first_name} ${usersDetail.rows[1].last_name}`
            let receiver_email = usersDetail.rows[0].email
            let renter_email = usersDetail.rows[1].email
            let status = 'requested'
            let approval_otp = generateOtp()
            let days = await dateGap(end_date, start_date, pick_up_time, drop_off_time, unit)
            if (typeof days === 'string') {
                return res.json({
                    success: false,
                    status: 400,
                    message: days
                });
            }
            let total_price = Number(deposit_price) + (Number(days) * Number(rental_price))

            let s3 = dbScript(db_sql['Q30'], { var1: item_id, var2: item_name, var3: description, var4: category_name, var5: deposit_price, var6: rental_price, var7: total_price, var8: renter_id, var9: receiver_id, var10: renter_name, var11: renter_email, var12: receiver_name, var13: receiver_email, var14: start_date, var15: end_date, var16: status, var17: approval_otp, var18: pick_up_time, var19: drop_off_time, var20: unit, var21: image })

            let insertAllData = await connection.query(s3)
            if (insertAllData.rowCount > 0) {
                // await notificationsOperations({ msg: 1.1, product_provider: renter_id, item_name: item_name }, receiver_id)
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 201,
                    message: "Item requested for rent"
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

module.exports.requestedItemsList = async (req, res) => {
    try {
        let userId = req.user.id
        let { status } = req.query
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q32"], { var1: userId, var2: status });
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

module.exports.approveOrRejectRequest = async (req, res) => {
    try {
        let userId = req.user.id;
        let { status, rentalId, receiver_name, receiver_email, renter_name, renter_email, item_name, item_description, deposit_price, rental_price, total_price } = req.body

        let itemDetails = {
            receiver_name, receiver_email, item_name, item_description, deposit_price, rental_price, total_price, renter_name, renter_email,
        }
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let otp = generateOtp();
            let s2 = dbScript(db_sql["Q33"], { var1: status, var2: otp, var3: rentalId });
            let approveOrReject = await connection.query(s2);
            if (approveOrReject.rowCount > 0) {
                // send email to the requester with OTP for verification
                if (status == "approved") {
                    await genericMail(receiver_email, otp, receiver_name, "", "approved", itemDetails)
                }
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: `request ${status} successfully.`
                });
            } else {
                await connection.query("ROLLBACK")
                res.json({
                    success: false,
                    status: 400,
                    message: "User not found"
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

module.exports.deliverProduct = async (req, res) => {
    try {
        let userId = req.user.id;
        let { otp, rentalId } = req.body
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q35"], { var1: rentalId, var2: "approved" });
            let findRentalDetails = await connection.query(s2);
            if (otp == findRentalDetails.rows[0].approval_otp) {
                let s3 = dbScript(db_sql["Q34"], { var1: "delivered", var2: null, var3: rentalId });
                let updateStatus = await connection.query(s3);
                if (updateStatus.rowCount > 0) {
                    await connection.query("COMMIT")
                    res.json({
                        success: true,
                        status: 200,
                        message: "Status Approved successfully."
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
                    message: "Entered Incorrect OTP"
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

module.exports.editItemAvailability = async (req, res) => {
    try {
        let userId = req.user.id;
        let { itemId, status } = req.query
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q36"], { var1: status, var2: itemId });
            let updateAvailability = await connection.query(s2);
            if (updateAvailability.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: "Status updated successfully."
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

module.exports.searchItem = async (req, res) => {
    try {
        let { queryString, min_rating, max_rating, min_price, max_price } = req.query
        let s1 = dbScript(db_sql["Q37"], { var1: queryString, var2: min_rating, var3: max_rating, var4: min_price, var5: max_price });
        let searchItem = await connection.query(s1);
        if (searchItem.rowCount > 0) {
            res.json({
                success: true,
                status: 200,
                message: "Item Lists.",
                data: searchItem.rows
            });
        } else {
            res.json({
                success: false,
                status: 200,
                message: "Empty Item List.",
                data: []
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

module.exports.searchItemByCategory = async (req, res) => {
    try {
        let { category_name, min_rating, max_rating, min_price, max_price } = req.query
        let s1 = dbScript(db_sql["Q38"], { var1: category_name, var2: min_rating, var3: max_rating, var4: min_price, var5: max_price });
        let searchItem = await connection.query(s1);
        if (searchItem.rowCount > 0) {
            res.json({
                success: true,
                status: 200,
                message: "Item Lists.",
                data: searchItem.rows
            });
        } else {
            res.json({
                success: false,
                status: 200,
                message: "Empty Item List.",
                data: []
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

module.exports.categoryListsForUser = async (req, res) => {
    try {
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
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            message: `Error Occurred ${error.message}`,
        });
    }
}



