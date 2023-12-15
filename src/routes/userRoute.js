const express = require("express");
const controller = require("../controllers/indexController");
const { uploadProfilePic } = require("../utils/uploadFile");
const { verifyTokenFn } = require("../utils/jwt");
const router = express.Router()

router.post('/createUser', controller.userController.createUser)
router.post('/verifyUser', controller.userController.verifyUser)
router.post('/loginUser', controller.userController.loginUser)
router.post('/uploadAvatar', uploadProfilePic.single('avatar'), controller.userController.uploadAvatar)
router.get('/showProfile', verifyTokenFn, controller.userController.showProfile)
router.put('/deleteUser', verifyTokenFn, controller.userController.deleteUser)

module.exports = router;
