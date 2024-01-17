const axios = require('axios');

const apiKey = '0d3b1c3450952a8ea18abb70bb9e563e';
module.exports.location = async (req, res) => {
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    axios.get('/', `http://api.ipstack.com/${userIP}?access_key=${apiKey}`)
        .then(response => {
            console.log(response, "111111");
            const location = response.data.location;
            console.log(`City: ${location.city}, Region: ${location.region_name}, Country: ${location.country_name}`);
        })
        .catch(error => {
            console.error(`Error fetching location: ${error}`);
        });

}