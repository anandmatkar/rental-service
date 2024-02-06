const connection = require("../config/database");
const { dbScript, db_sql } = require("../utils/db_script");
const { mysql_real_escape_string } = require("../utils/helper");
const { messageValidation } = require("../utils/validation");

module.exports.addMessage = async (req, res) => {
    try {
        let userId = req.user.id
        let { from, to, message } = req.body
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {

            let errors = await messageValidation.addMessageValidation(req, res)
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0].msg;
                return res.json({ status: 422, message: firstError, success: false });
            }

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
                    status: 200,
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

module.exports.chatList = async (req, res) => {
    try {
        let { id } = req.user;
        let s1 = dbScript(db_sql["Q5"], { var1: id });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q71"], { var1: id });
            let chatList = await connection.query(s2);
            console.log(chatList.rows, "11111111111111");
            if (chatList.rowCount > 0) {

                const loggedInUserId = "d23818ab-af1f-405b-9ae9-4545ad5e4400";
                const userInfo = [];

                chatList.rows.forEach((message) => {
                    const otherUserId = message.sender_id === loggedInUserId ? message.receiver_id : message.sender_id;

                    if (otherUserId !== loggedInUserId) {
                        const conversation = {
                            name: otherUserId === message.sender_id ?
                                `${message.sender_first_name} ${message.sender_last_name}` :
                                `${message.receiver_first_name} ${message.receiver_last_name}`,
                            avatar: otherUserId === message.sender_id ?
                                message.sender_avatar :
                                message.receiver_avatar,
                            latestMessage: {
                                content: message.message_content,
                                timestamp: message.timestamp,
                                is_read: message.is_read,
                                sender_id: message.sender_id,
                                receiver_id: message.receiver_id,
                            },
                        };

                        const existingUserIndex = userInfo.findIndex(user => user.id === otherUserId);

                        if (existingUserIndex !== -1) {
                            // Check if the current message's timestamp is later than the existing latestMessage's timestamp
                            if (new Date(message.timestamp) > new Date(userInfo[existingUserIndex].latestMessage.timestamp)) {
                                userInfo[existingUserIndex].latestMessage = conversation.latestMessage;
                            }
                        } else {
                            userInfo.push({
                                id: otherUserId,
                                ...conversation,
                            });
                        }
                    }
                });

                res.json({
                    status: 200,
                    success: true,
                    message: "Chat List",
                    data: userInfo,
                });
            } else {
                res.json({
                    status: 200,
                    success: false,
                    message: "Empty Chat List",
                    data: [],
                });
            }
        } else {
            res.json({
                success: false,
                status: 400,
                message: "User not found",
            });
        }
    } catch (error) {
        res.json({
            success: false,
            status: 500,
            message: error.message,
        });
    }
};

module.exports.readChat = async (req, res) => {
    try {
        let userId = req.user.id
        let { sender_id } = req.query
        await connection.query("BEGIN");
        let s1 = dbScript(db_sql["Q5"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            let s2 = dbScript(db_sql["Q72"], { var1: sender_id, var2: userId });
            let readChat = await connection.query(s2);
            if (readChat.rowCount > 0) {
                await connection.query("COMMIT");
                res.json({
                    success: true,
                    status: 200,
                    message: "Message Read."
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

