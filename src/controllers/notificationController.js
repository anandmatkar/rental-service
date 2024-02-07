const connection = require('../config/database');
const { dbScript, db_sql } = require('../utils/db_script');

module.exports.notificationLists = async (req, res) => {
    try {
        let userId = req.user.id;

        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);

        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q52"], { var1: userId, var2: false });
            let notifications = await connection.query(s2);

            if (notifications.rowCount > 0) {
                // Emitting a socket event with the notification data
                io.to(req.user.id).emit('new-notification', notifications.rows);

                res.json({
                    success: true,
                    status: 200,
                    message: "Notification",
                    data: notifications.rows
                });
            } else {
                res.json({
                    success: false,
                    status: 200,
                    message: "Empty Notification List",
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


module.exports.readAllNOtifications = async (req, res) => {
    try {
        let userId = req.user.id
        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q53"], { var1: true, var2: userId });
            let updateNotification = await connection.query(s2);
            if (updateNotification.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: "All Notification Read Successfully",
                    data: updateNotification.rows
                });
            } else {
                await connection.query("ROLLBACk")
                res.json({
                    success: false,
                    status: 400,
                    message: "Something went wrong",
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
        await connection.query("ROLLBACK")
        res.json({
            success: false,
            status: 500,
            message: error.message
        });
    }
}

module.exports.readNotification = async (req, res) => {
    try {
        let userId = req.user.id
        let { notificationId } = req.query
        await connection.query("BEGIN")
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q54"], { var1: true, var2: userId, var3: notificationId });
            let updateNotification = await connection.query(s2);
            if (updateNotification.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 200,
                    message: "Notification Read Successfully",
                    data: updateNotification.rows
                });
            } else {
                await connection.query("ROLLBACk")
                res.json({
                    success: false,
                    status: 400,
                    message: "Something went wrong",
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
        await connection.query("ROLLBACK")
        res.json({
            success: false,
            status: 500,
            message: error.message
        });
    }
}