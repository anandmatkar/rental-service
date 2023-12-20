const userController = require('./userController')
const superAdminController = require("./superAdminController")
const itemController = require('./itemController')

const controller = {
    userController,
    superAdminController,
    itemController
}

module.exports = controller