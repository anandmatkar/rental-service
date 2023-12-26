const userController = require('./userController')
const superAdminController = require("./superAdminController")
const itemController = require('./itemController')
const reviewController = require("./reviewController")

const controller = {
    userController,
    superAdminController,
    reviewController,
    itemController
}

module.exports = controller