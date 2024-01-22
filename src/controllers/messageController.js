const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const { mysql_real_escape_string } = require("../utils/helper");

module.exports.addMessage = async (req, res) => {
    try {
        let userId = req.user.id
        let { from, to, message } = req.body
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s1 = dbScript(db_sql["Q47"], { var1: mysql_real_escape_string(message), var2: from, var3: to });
            let sendMsg = await connection.query(s1);
            if (sendMsg.rowCount > 0) {
                await connection.query("COMMIT")
                res.json({
                    success: true,
                    status: 201,
                    message: "Message sent successfully"
                });
            } else {
                await connection.query("ROLLBACK");
                res.json({
                    success: false,
                    status: 400,
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
}

module.exports.getMessage = async (req, res) => {
    try {
        let userId = req.user.id;
        let { from, to } = req.query;
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s1 = dbScript(db_sql["Q48"], { var1: from, var2: to });
            let MsgList = await connection.query(s1);

            let s2 = dbScript(db_sql["Q28"], { var1: to });
            let userData = await connection.query(s2);

            if (MsgList.rowCount > 0) {
                // Iterate over the message list and add is_self property
                MsgList.rows = MsgList.rows.map(message => {
                    return {
                        ...message,
                        is_self: message.sender_id === userId
                    };
                });

                await connection.query("COMMIT");

                res.json({
                    success: true,
                    status: 200,
                    message: "Message List",
                    data: MsgList.rows,
                    userData: { first_name: userData.rows[0].first_name, last_name: userData.rows[0].last_name, avatar: userData.rows[0].avatar }
                });
            } else {
                res.json({
                    success: false,
                    status: 400,
                    message: "No message found",
                    data: [],
                    userData: { first_name: userData.rows[0].first_name, last_name: userData.rows[0].last_name, avatar: userData.rows[0].avatar }
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
};

module.exports.deleteMessage = async (req, res) => {
    try {
        let userId = req.user.id
        let { messageId } = req.query
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q49"], { var1: messageId });
            let deleteMessage = await connection.query(s2);
            if (deleteMessage.rowCount > 0) {

            } else {

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
