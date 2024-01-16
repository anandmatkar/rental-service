const userController = require('./userController')
const superAdminController = require("./superAdminController")
const itemController = require('./itemController')
const reviewController = require("./reviewController")
const messageController = require("./messageController")
const notificationController = require('./notificationController')
const featureItemsController = require('./featureItemsController')

const controller = {
    userController,
    superAdminController,
    reviewController,
    itemController,
    messageController,
    notificationController,
    featureItemsController
}

module.exports = controller