const axios = require('axios');
const IP = require('ip')

const apiKey = '0d3b1c3450952a8ea18abb70bb9e563e';
// module.exports.location = async (req, res) => {
//     try {
//         let userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//         userIP = "116.75.243.33";

//         const response = await axios.get(`http://api.ipstack.com/${userIP}?access_key=${apiKey}`);
//         const location = response.data;

//         return location;
//     } catch (error) {
//         console.error(`Error fetching location: ${error}`);
//         throw error; // Re-throw the error so that the calling function can catch it if needed
//     }

// }


module.exports.location = async (req, res) => {
    try {
        let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // ipAddress = "106.194.146.235"
        const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
        const locationData = response.data;
        return locationData
    } catch (error) {
        console.error(`Error fetching location data for IP address ${ipAddress}:`, error.message);
    }

}