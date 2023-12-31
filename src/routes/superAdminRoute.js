const express = require("express");
const controller = require("../controllers/indexController");
const { verifyAdmin } = require("../utils/jwt");
const router = express.Router()

/*=====================================================Admin Auth Route========================================== */

router.post('/login', controller.superAdminController.login)
router.get('/showProfile', verifyAdmin, controller.superAdminController.showProfile)
router.put('/changePassword', verifyAdmin, controller.superAdminController.changePassword)
router.put('/forgetPassword', controller.superAdminController.forgetPassword)
router.put('/resetPassword', controller.superAdminController.resetPassword)


/*=====================================================User Route========================================== */
router.get('/userList', verifyAdmin, controller.superAdminController.userList)
router.get('/userDetails', verifyAdmin, controller.superAdminController.userDetails)
router.put('/deactivateUser', verifyAdmin, controller.superAdminController.deactivateUser)

/*=====================================================Category Route========================================== */
router.post('/addCategory', verifyAdmin, controller.superAdminController.addCategory)
router.get('/categoryLists', verifyAdmin, controller.superAdminController.categoryLists)
router.get('/categoryDetails', verifyAdmin, controller.superAdminController.categoryDetails)
router.put('/deleteCategory', verifyAdmin, controller.superAdminController.deleteCategory)

module.exports = router;