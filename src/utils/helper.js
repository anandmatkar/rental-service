// const { io } = require("../..");
const connection = require("../config/database");
const { dbScript, db_sql } = require("./db_script");
const { notificationMsg } = require("./notificationEnum");

module.exports.mysql_real_escape_string = (str) => {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return " ";
            case "\r":
                return "\\r";
            case "\"":
                return "\"" + char;
            case "'":
                return "'" + char;
            case "\\":
                return "'" + char;
            case "%":
                return "\%"; // prepends a backslash to backslash, percent,
            // and double/single quotes
        }
    })
}

module.exports.generateOtp = () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.dateGap = async (endDateStr, startDateStr, startTime, endTime, unit) => {

    let startDate = new Date(startDateStr.split("-").reverse().join("-"));
    let endDate = new Date(endDateStr.split("-").reverse().join("-"));

    startDate.setHours(startTime.split(":")[0], startTime.split(":")[1], 0);
    endDate.setHours(endTime.split(":")[0], endTime.split(":")[1], 0);

    let timeDifference = endDate.getTime() - startDate.getTime();

    switch (unit) {
        case 'hourly':
            let hoursGap = Math.floor(timeDifference / (1000 * 60 * 60));
            return hoursGap > 0 ? hoursGap : 'Please select alteast one hour';
        case 'daily':
            let daysGap = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            return daysGap > 0 ? daysGap : 'Please select alteast one day';
        case 'monthly':
            let monthDiff = endDate.getMonth() - startDate.getMonth() + (12 * (endDate.getFullYear() - startDate.getFullYear()));
            if (endDate.getDate() < startDate.getDate()) {
                monthDiff--;
            }
            return monthDiff > 0 ? monthDiff : 'Please select alteast one month';
        case 'yearly':
            let yearDiff = endDate.getFullYear() - startDate.getFullYear();
            if (endDate.getMonth() < startDate.getMonth() || (endDate.getMonth() == startDate.getMonth() && endDate.getDate() < startDate.getDate())) {
                yearDiff--;
            }
            return yearDiff > 0 ? yearDiff : 'Please select alteast one year';
        default:
            throw new Error('Invalid unit. Please use "hourly", "daily", "monthly", or "yearly".');
    }
}

module.exports.notificationsOperations = async (nfData, userId) => {
    let s0 = dbScript(db_sql['Q5'], { var1: userId });
    let userName = await connection.query(s0);
    let msg = `${userName.rows[0].first_name} ${notificationMsg[nfData.msg]} ${nfData.item_name}`;
    let s1 = dbScript(db_sql['Q51'], { var1: nfData.product_provider, var2: msg });
    let insertNotification = await connection.query(s1);

    const recipientUserId = insertNotification.rows[0].user_id;
    const recipientSocket = global.onlineUsers.get(recipientUserId);

    if (recipientSocket) {
        // Emit a custom "notification" event to the recipient
        io.to(recipientSocket).emit("notification", {
            message: msg,
            // Add any additional data you want to send with the notification
        });
    }
};

module.exports.capitalizeEachWord = (str) => {
    let words = str.split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
}

module.exports.extractAddressInfo = (addressString) => {
    log
    const regex = /(.+),\s*([^,]+),\s*([^,]+)\s+(\d{6}),\s*([^,]+)\s*$/;
    const match = addressString.match(regex);

    if (match) {
        const fullAddress = match[1].trim();
        const city = match[2].trim();
        const state = match[3].trim();
        const postalCode = match[4].trim();
        const country = match[5].trim();
        return { fullAddress, city, state, postalCode, country };
    } else {
        return null;
    }
}






