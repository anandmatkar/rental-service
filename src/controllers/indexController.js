const userController = require('./userController')
const superAdminController = require("./superAdminController")
const itemController = require('./itemController')
const reviewController = require("./reviewController")
const messageController = require("./messageController")

const controller = {
    userController,
    superAdminController,
    reviewController,
    itemController,
    messageController,
}

module.exports = controller