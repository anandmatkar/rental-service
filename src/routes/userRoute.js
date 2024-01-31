const express = require("express");
const controller = require("../controllers/indexController");
const { uploadProfilePic, uploadReview, uploadItem } = require("../utils/uploadFile");
const { verifyTokenFn } = require("../utils/jwt");
const { sessionDetails } = require("../utils/middleware");
const router = express.Router()


/**==================================================Auth Section============================================ */

router.post('/createUser', controller.userController.createUser)
router.post('/verifyUser', controller.userController.verifyUser)
router.put('/verifyUserWithLink', controller.userController.verifyUserWithLink)
router.post('/loginUser', controller.userController.loginUser)
router.post('/uploadAvatar', uploadProfilePic.single('avatar'), controller.userController.uploadAvatar)
router.get('/showProfile', verifyTokenFn, controller.userController.showProfile)
router.put('/deleteUser', verifyTokenFn, controller.userController.deleteUser)
router.put('/editUser', verifyTokenFn, controller.userController.editUser)
router.put('/changePassword', verifyTokenFn, controller.userController.changePassword)
router.put('/forgetPassword', controller.userController.forgetPassword)
router.put('/resetPassword', controller.userController.resetPassword)
router.get('/userData', verifyTokenFn, controller.userController.userData)
router.get('/userList', verifyTokenFn, controller.userController.userList)

/**==================================================Items Section============================================ */

router.post('/addItem', verifyTokenFn, controller.itemController.addItem)
router.post('/uploadItemImages', verifyTokenFn, uploadItem.array('images'), controller.itemController.uploadItemImages)
router.get('/allItems', sessionDetails, controller.itemController.allItems)
router.get('/ownUploadedItems', verifyTokenFn, controller.itemController.ownUploadedItems)
router.get('/itemDetails', controller.itemController.itemDetails)
router.put('/editItem', verifyTokenFn, controller.itemController.editItem)
router.put('/requestItemForRent', verifyTokenFn, controller.itemController.requestItemForRent)
router.get('/requestedItemsList', verifyTokenFn, controller.itemController.requestedItemsList)
router.get('/requestedItemDetails', verifyTokenFn, controller.itemController.requestedItemDetails)
router.put('/approveOrRejectRequest', verifyTokenFn, controller.itemController.approveOrRejectRequest)
router.put('/deliverProduct', verifyTokenFn, controller.itemController.deliverProduct)
router.put('/editItemAvailability', verifyTokenFn, controller.itemController.editItemAvailability)
router.get('/searchItem', sessionDetails, controller.itemController.searchItem)
router.get('/searchItemByCategory', controller.itemController.searchItemByCategory)
router.get('/categoryListsForUser', controller.itemController.categoryListsForUser)
router.put('/deleteItem', verifyTokenFn, controller.itemController.deleteItem)

/**==================================================Review Section============================================ */

router.post('/addReview', verifyTokenFn, controller.reviewController.addReview)
router.post('/uploadReviewImages', verifyTokenFn, uploadReview.array('images'), controller.reviewController.uploadReviewImages)
router.get('/reviewPerProduct', controller.reviewController.reviewPerProduct)
router.put('/editReview', verifyTokenFn, controller.reviewController.editReview)
router.put('/deleteReview', verifyTokenFn, controller.reviewController.deleteReview)
router.get('/reviewListPerUser', verifyTokenFn, controller.reviewController.reviewListPerUser)
router.get('/checkForReviewAdd', controller.reviewController.checkForReviewAdd)

/**==================================================Message Section============================================ */

router.post('/addMessage', verifyTokenFn, controller.messageController.addMessage)
router.get('/getMessage', verifyTokenFn, controller.messageController.getMessage)
router.get('/chatList', verifyTokenFn, controller.messageController.chatList)

/**==================================================Notification Section============================================ */

router.get('/notificationLists', verifyTokenFn, controller.notificationController.notificationLists)
router.put('/readAllNOtifications', verifyTokenFn, controller.notificationController.readAllNOtifications)
router.put('/readNotification', verifyTokenFn, controller.notificationController.readNotification)

/* ============================================== Feature Products Routes ======================================== */
router.put('/requestToFeature', verifyTokenFn, controller.featureItemsController.requestToFeature)
router.get('/featureProductList', controller.featureItemsController.featureProductList)
router.get('/checkForFeatureRequest', controller.featureItemsController.checkForFeatureRequest)


router.get('/location', controller.locationController.location)
router.get('/getLocationUsLandL', controller.locationController.getLocationUsLandL)
router.get('/categorizeDates', controller.itemController.categorizeDates)

module.exports = router;
