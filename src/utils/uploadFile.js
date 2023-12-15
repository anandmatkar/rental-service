const multer = require('multer')
const path = require('path')

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profilePic')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];

        const fileName = `${Date.now()}.${ext}`
        cb(null, fileName)
    }
})
const uploadProfilePic = multer({
    storage: storage1
})

module.exports = {
    uploadProfilePic
}