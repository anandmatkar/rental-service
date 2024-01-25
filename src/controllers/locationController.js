const axios = require('axios');
const IP = require('ip');
const { extractAddressInfo, isValidCoordinates } = require('../utils/helper');
const session = require('express-session');

const apiKey = '0d3b1c3450952a8ea18abb70bb9e563e';

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

// module.exports.getLocationUsLandL = async (req, res) => {
//     try {
//         console.log(req.cookies, "cookies");

//         const { lat, lon } = req.cookies;

//         if (!lat || !lon) {
//             return null
//         }
//         let googleApiKey = process.env.GOOGLE_API_KEY
//         const response = await axios.get(
//             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}`
//         );
//         const result = response.data.results[0];
//         if (result) {
//             const address = result.formatted_address;
//             let extractedAddress = extractAddressInfo(address)
//             return extractedAddress
//         } else {
//             return null
//         }
//     } catch (error) {
//         console.log(error, "errorrrrrrrr");
//     }
// }

module.exports.getLocationUsLandL = async (req, res) => {
    try {
        console.log(req.cookies, "cookies");

        const { lat, lon } = req.cookies;

        if (!lat || !lon) {
            return null;
        }

        let googleApiKey = process.env.GOOGLE_API_KEY;
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}`
        );

        const result = response.data.results[0];

        if (result) {
            const address = result.formatted_address;
            let extractedAddress = extractAddressInfo(address);
            return extractedAddress;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error.response.data.error_message, "11111111111");
        if (
            error.response &&
            error.response.data &&
            error.response.data.error_message === "Invalid request. Invalid 'latlng' parameter."
        ) {
            res.clearCookie('lat');
            res.clearCookie('lon');
            console.log("Removed lat and lon cookies");
        }

        return null;
    }
};