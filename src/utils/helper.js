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
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.dateGap = async (endDateStr, startDateStr) => {
    // Assuming your date format is "DD-MM-YYYY"
    startDateStr = "22-12-2023";
    endDateStr = "25-12-2023";

    // Parse the date strings to create Date objects
    let startDate = new Date(startDateStr.split("-").reverse().join("-"));
    let endDate = new Date(endDateStr.split("-").reverse().join("-"));

    // Calculate the time difference in milliseconds
    let timeDifference = endDate.getTime() - startDate.getTime();

    // Convert the time difference to days
    let daysGap = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysGap

}