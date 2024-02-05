const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const { generateOtp, dateGap, mysql_real_escape_string, notificationsOperations, capitalizeEachWord } = require("../utils/helper");
const { genericMail } = require("../utils/sendMail");
const { itemValidation } = require("../utils/validation");
const { location, getLocationUsLandL } = require("./locationController");


module.exports.addItem = async (req, res) => {
    try {
        let { id } = req.user;
        let { item_name, item_description, deposit_price, rental_price, item_images, category_id, category_name, unit } = req.body;
        await connection.query("BEGIN");

        let s1 = dbScript(db_sql["Q5"], { var1: id });
        let findUser = await connection.query(s1);

        if (findUser.rowCount > 0) {

            let errors = await itemValidation.addItemValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }
            let s4 = dbScript(db_sql["Q24"], { var1: category_id, var2: id, var3: mysql_real_escape_string(capitalizeEachWord(item_name)), var4: mysql_real_escape_string(capitalizeEachWord(item_description)), var5: Number(deposit_price), var6: Number(rental_price), var7: true, var8: category_name ? category_name : addCategory.rows[0].category_name, var9: item_images[0].path, var10: unit });
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

module.exports.editUploadItemImages = async (req, res) => {
    try {
        let { id } = req.user;
        let { item_id, user_id } = req.query
        await connection.query("BEGIN");

        let s1 = dbScript(db_sql["Q5"], { var1: id });
        let findUser = await connection.query(s1);

        if (findUser.rowCount > 0) {
            let files = req.files;
            let insertImages;
            for (const file of files) {
                let path = `${process.env.ITEM_ATTACHEMENTS}/${file.filename}`;
                let s2 = dbScript(db_sql["Q50"], { var1: user_id, var2: item_id, var3: path });
                insertImages = await connection.query(s2);
            }
            if (insertImages.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    status: 201,
                    success: true,
                    message: "Files Uploaded successfully!"
                });
            } else {
                await connection.query("ROLLBACK")
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
        let { lat, lon } = req.cookies

        if (!lat || !lon) {
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
        } else {
            let fullAddress = await getLocationUsLandL(req, res)
            if (fullAddress == null) {
                let s1 = dbScript(db_sql["Q25"], { var1: 'Indore' });
                let findItems = await connection.query(s1);
                if (findItems.rowCount > 0) {
                    findItems.rows.forEach(item => {
                        const roundedAverageRating = Math.round(parseFloat(item.average_rating) * 2) / 2;
                        item.average_rating = roundedAverageRating.toString();
                    });
                    return res.json({
                        status: 200,
                        success: true,
                        message: "Items List",
                        data: findItems.rows
                    });
                } else {
                    return res.json({
                        status: 200,
                        success: false,
                        message: "Empty Item lists",
                        data: []
                    });
                }
            } else {
                let s1 = dbScript(db_sql["Q69"], { var1: fullAddress.fullAddress, var2: fullAddress.city, var3: fullAddress.state, var4: fullAddress.country ? fullAddress.country : "India" });
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
                        message: "No Items Found On Your Location",
                        data: []
                    });
                }
            }
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

            let errors = await itemValidation.addItemValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }

            let s2 = dbScript(db_sql["Q27"], { var1: mysql_real_escape_string(capitalizeEachWord(item_name)), var2: mysql_real_escape_string(capitalizeEachWord(item_description)), var3: deposit_price, var4: rental_price, var5: category_name, var6: category_id, var7: unit, var8: item_id });
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

            let errors = await itemValidation.requestItemForRentValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }

            let s2 = dbScript(db_sql["Q41"], { var1: renter_id, var2: item_id });
            let findItem = await connection.query(s2);
            if (findItem.rowCount > 0) {
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
                    message: "Item not found"
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

            let errors = await itemValidation.requestItemListValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }

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

module.exports.requestedItemDetails = async (req, res) => {
    try {
        let userId = req.user.id
        let { request_id, status } = req.query
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {

            let errors = await itemValidation.requestItemDetailsValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }

            let s2 = dbScript(db_sql["Q61"], { var1: userId, var2: request_id, var3: status });
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
                    status: 200,
                    message: "Empty Item Details",
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
                    genericMail(receiver_email, otp, receiver_name, "", "approved", itemDetails)
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
        let { otp, rentalId, renter_id } = req.body
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {

            let errors = await itemValidation.deliverItemValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }

            if (userId !== renter_id) {
                return res.json({
                    status: 403,
                    success: false,
                    message: 'Unauthorized'
                })
            }

            let s2 = dbScript(db_sql["Q35"], { var1: rentalId, var2: "approved", var3: renter_id });
            let findRentalDetails = await connection.query(s2);
            if (findRentalDetails.rowCount > 0) {
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
                    message: "Item not found"
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
        let { itemId, status, user_id } = req.query
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {

            let errors = await itemValidation.editAvailabilityValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }
            if (userId !== user_id) {
                return res.json({
                    status: 403,
                    success: false,
                    message: 'Unauthorized'
                })
            }

            let s2 = dbScript(db_sql["Q36"], { var1: status, var2: itemId, var3: user_id });
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
        let { lat, lon } = req.cookies
        let { queryString } = req.query
        if (!lat || !lon) {
            let s1 = dbScript(db_sql["Q37"], { var1: queryString });
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
        } else {
            let fullAddress = await getLocationUsLandL(req, res)
            if (fullAddress == null) {
                let s1 = dbScript(db_sql["Q37"], { var1: queryString });
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
            } else {
                let s1 = dbScript(db_sql["Q70"], { var1: queryString, var2: fullAddress.fullAddress, var3: fullAddress.city, var4: fullAddress.state, var5: fullAddress.country });
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
            }
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
        let { category_name } = req.query
        let s1 = dbScript(db_sql["Q38"], { var1: category_name });
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

module.exports.deleteItem = async (req, res) => {
    try {
        let userId = req.user.id;
        let { itemId } = req.query
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let _dt = new Date().toISOString();
            let s1 = dbScript(db_sql["Q64"], { var1: _dt, var2: itemId, var3: userId });
            let deleteItem = await connection.query(s1);
            if (deleteItem.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: false,
                    status: 200,
                    message: "Item Deleted successfully."
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
        await connection.query("ROLLBACK")
        res.json({
            status: 500,
            success: false,
            message: `Error Occurred ${error.message}`,
        });
    }
}

module.exports.categorizeDates = async (req, res) => {
    try {
        let { itemId } = req.query;
        const unavailableDates = [];

        // let s1 = dbScript(db_sql["Q68"], { var1: itemId, var2: "approved" });
        // let findDates = await connection.query(s1);
        let data = [
            {
                id: '9f3a48ef-cf88-407f-9a35-63ec6f67e63f',
                items_id: '25f3e2e5-18e5-44db-b17b-d17201d4441e',
                item_name: 'Embroidered Semi Stitched Lehenga Choli ',
                item_description: 'Embroidered Semi Stitched Lehenga Choli  (Black)',
                category_name: 'fashion_accessories',
                deposit_price: '12000',
                rental_price: '1200',
                total_price: '13200',
                renter_id: 'a8ae772f-0d31-4db8-870f-6d5c5308244b',
                receiver_id: '8a6adf88-2521-4f12-be49-d3ab930fb4c4',
                renter_name: 'pragati gupta',
                renter_email: 'pragatiwd@yopmail.com',
                receiver_name: 'yash kumar tiwari',
                receiver_email: 'yashk@yopmail.com',
                start_date: '2024-11-01 00:00:00',
                end_date: '2024-11-01 00:00:00',
                rental_fees: null,
                status: 'approved',
                approval_otp: '878897',
                created_at: "2024-01 - 11T11: 36:02.041Z",
                updated_at: "2024-01 - 11T11: 36:02.041Z",
                deleted_at: null,
                unit: 'hourly',
                pickup_time: '17:5                                              ',
                drop_time: '18:5',
                image: 'http://13.55.200.226/uploads/itemImages/1704711315455.webp'
            },
            {
                id: '6541f970-29f6-47c2-9944-a655a764b667',
                items_id: '25f3e2e5-18e5-44db-b17b-d17201d4441e',
                item_name: 'Embroidered Semi Stitched Lehenga Choli ',
                item_description: 'Embroidered Semi Stitched Lehenga Choli  (Black)',
                category_name: 'fashion_accessories',
                deposit_price: '12000',
                rental_price: '1200',
                total_price: '254400',
                renter_id: 'a8ae772f-0d31-4db8-870f-6d5c5308244b',
                receiver_id: 'ac5a3b37-a41a-4d15-b6e5-73e79b86e1cb',
                renter_name: 'pragati gupta',
                renter_email: 'pragatiwd@yopmail.com',
                receiver_name: 'Prachi Chhapariya',
                receiver_email: 'prachi001@yopmail.com',
                start_date: '09-01-2024',
                end_date: '18-01-2024',
                rental_fees: null,
                status: 'approved',
                approval_otp: '498617',
                created_at: "2024-01 - 15T07:00: 31.648Z",
                updated_at: "2024-01 - 15T07:00: 31.648Z",
                deleted_at: null,
                unit: 'hourly',
                pickup_time: '18:4                                              ',
                drop_time: '4:36',
                image: 'http://13.55.200.226/uploads/itemImages/1704711315455.webp'
            },
            {
                id: 'b97e51d3-b3b4-4d1a-a4c1-e6b6b75aa538',
                items_id: '25f3e2e5-18e5-44db-b17b-d17201d4441e',
                item_name: 'Embroidered Semi Stitched Lehenga Choli ',
                item_description: 'Embroidered Semi Stitched Lehenga Choli  (Black)',
                category_name: 'fashion_accessories',
                deposit_price: '12000',
                rental_price: '1200',
                total_price: '13200',
                renter_id: 'a8ae772f-0d31-4db8-870f-6d5c5308244b',
                receiver_id: '8a6adf88-2521-4f12-be49-d3ab930fb4c4',
                renter_name: 'pragati gupta',
                renter_email: 'pragatiwd@yopmail.com',
                receiver_name: 'yash kumar tiwari',
                receiver_email: 'yashk@yopmail.com',
                start_date: '2024-11-01 00:00:00',
                end_date: '2024-11-01 00:00:00',
                rental_fees: null,
                status: 'approved',
                approval_otp: '816138',
                created_at: "2024-01 - 11T11: 26: 24.100Z",
                updated_at: "2024-01 - 11T11: 26: 24.100Z",
                deleted_at: null,
                unit: 'hourly',
                pickup_time: '16:56                                             ',
                drop_time: '17:56',
                image: 'http://13.55.200.226/uploads/itemImages/1704711315455.webp'
            },
            {
                id: 'ae1aace2-d8e0-4d4a-bcec-da88f6437731',
                items_id: '25f3e2e5-18e5-44db-b17b-d17201d4441e',
                item_name: 'Embroidered Semi Stitched Lehenga Choli ',
                item_description: 'Embroidered Semi Stitched Lehenga Choli  (Black)',
                category_name: 'fashion_accessories',
                deposit_price: '12000',
                rental_price: '1200',
                total_price: '13200',
                renter_id: 'a8ae772f-0d31-4db8-870f-6d5c5308244b',
                receiver_id: '8a6adf88-2521-4f12-be49-d3ab930fb4c4',
                renter_name: 'pragati gupta',
                renter_email: 'pragatiwd@yopmail.com',
                receiver_name: 'yash kumar tiwari',
                receiver_email: 'yashk@yopmail.com',
                start_date: '2024-12-01 00:00:00',
                end_date: '2024-12-01 00:00:00',
                rental_fees: null,
                status: 'approved',
                approval_otp: '368048',
                created_at: "2024-01 - 11T11: 27: 59.591Z",
                updated_at: "2024-01 - 11T11: 27: 59.591Z",
                deleted_at: null,
                unit: 'hourly',
                pickup_time: '16:57                                             ',
                drop_time: '17:57',
                image: 'http://13.55.200.226/uploads/itemImages/1704711315455.webp'
            },
            {
                id: '0fd27159-b181-4a28-9186-026d36d0cbac',
                items_id: '25f3e2e5-18e5-44db-b17b-d17201d4441e',
                item_name: 'Embroidered Semi Stitched Lehenga Choli ',
                item_description: 'Embroidered Semi Stitched Lehenga Choli  (Black)',
                category_name: 'fashion_accessories',
                deposit_price: '12000',
                rental_price: '1200',
                total_price: '13200',
                renter_id: 'a8ae772f-0d31-4db8-870f-6d5c5308244b',
                receiver_id: '2b82757c-72b1-419b-bc74-708961c0bb01',
                renter_name: 'pragati gupta',
                renter_email: 'pragatiwd@yopmail.com',
                receiver_name: 'anand matkar',
                receiver_email: 'anand@yopmail.com',
                start_date: '17-01-2024',
                end_date: '17-01-2024',
                rental_fees: null,
                status: 'approved',
                approval_otp: '235245',
                created_at: "2024-01 - 16T07: 47: 41.034Z",
                updated_at: "2024-01 - 16T07: 47: 41.034Z",
                deleted_at: null,
                unit: 'hourly',
                pickup_time: '13:17                                             ',
                drop_time: '14:18',
                image: 'http://13.55.200.226/uploads/itemImages/1704711315455.webp'
            },
            {
                id: '29ad8eeb-1b49-413f-a67e-2a1d021f58c0',
                items_id: '25f3e2e5-18e5-44db-b17b-d17201d4441e',
                item_name: 'Embroidered Semi Stitched Lehenga Choli ',
                item_description: 'Embroidered Semi Stitched Lehenga Choli  (Black)',
                category_name: 'fashion_accessories',
                deposit_price: '12000',
                rental_price: '1200',
                total_price: '184800',
                renter_id: 'a8ae772f-0d31-4db8-870f-6d5c5308244b',
                receiver_id: '2b82757c-72b1-419b-bc74-708961c0bb01',
                renter_name: 'pragati gupta',
                renter_email: 'pragatiwd@yopmail.com',
                receiver_name: 'anand matkar',
                receiver_email: 'anand@yopmail.com',
                start_date: '25-01-2024',
                end_date: '31-01-2024',
                rental_fees: null,
                status: 'approved',
                approval_otp: '719210',
                created_at: "2024-01 - 23T12: 15: 26.268Z",
                updated_at: "2024-01 - 23T12: 15: 26.268Z",
                deleted_at: null,
                unit: 'hourly',
                pickup_time: '17:45                                             ',
                drop_time: '17:45',
                image: 'http://13.55.200.226/uploads/itemImages/1704711315455.webp'
            }
        ]

        data.forEach(item => {
            const startDate = new Date(item.start_date);
            const endDate = new Date(item.end_date);

            if (item.status === 'approved') {
                // If the status is approved, consider the date as unavailable
                for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                    unavailableDates.push(date.toISOString().split('T')[0]);
                }
            }
        });

        res.json({
            data: {
                unavailableDates,
            },
        });
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            message: `Error Occurred ${error.message}`,
        });
    }
};

module.exports.deleteItemImage = async (req, res) => {
    try {
        let userId = req.user.id;
        let { image_id, user_id } = req.query
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {

            if (userId !== user_id) {
                return res.json({
                    status: 403,
                    success: false,
                    message: 'Unauthorized'
                })
            }

            let s1 = dbScript(db_sql["Q73"], { var1: image_id, var2: user_id });
            let deleteItemImage = await connection.query(s1);
            if (deleteItemImage.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: "Image Deleted successfully."
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
        await connection.query("ROLLBACK")
        res.json({
            status: 500,
            success: false,
            message: `Error Occurred ${error.message}`,
        });
    }
}






