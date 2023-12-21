const express = require("express");
const controller = require("../controllers/indexController");
const { uploadProfilePic } = require("../utils/uploadFile");
const { verifyTokenFn } = require("../utils/jwt");
const router = express.Router()

/**==================================================Auth Section============================================ */

router.post('/createUser', controller.userController.createUser)
router.post('/verifyUser', controller.userController.verifyUser)
router.post('/loginUser', controller.userController.loginUser)
router.post('/uploadAvatar', uploadProfilePic.single('avatar'), controller.userController.uploadAvatar)
router.get('/showProfile', verifyTokenFn, controller.userController.showProfile)
router.put('/deleteUser', verifyTokenFn, controller.userController.deleteUser)
router.put('/editUser', verifyTokenFn, controller.userController.editUser)
router.put('/changePassword', verifyTokenFn, controller.userController.changePassword)
router.put('/forgetPassword', controller.userController.forgetPassword)
router.put('/resetPassword', controller.userController.resetPassword)

/**==================================================Items Section============================================ */

router.post('/addItem', verifyTokenFn, controller.itemController.addItem)
router.get('/allItems', controller.itemController.allItems)
router.get('/ownUploadedItems', verifyTokenFn, controller.itemController.ownUploadedItems)
router.get('/itemDetails', controller.itemController.itemDetails)
router.put('/editItem', verifyTokenFn, controller.itemController.editItem)

module.exports = router;
