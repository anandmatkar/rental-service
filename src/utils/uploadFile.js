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

const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/reviewImages')
    },
    filename: function (req, file, cb) {

        const ext = file.mimetype.split('/')[1];

        const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';

        const fileName = `${Date.now()}_${fileType}.${ext}`;
        cb(null, fileName);
    }
});

const uploadReview = multer({
    storage: storage2
});


const storage3 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/itemImages')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];

        const fileName = `${Date.now()}.${ext}`
        cb(null, fileName)
    }
})
const uploadItem = multer({
    storage: storage3
})

module.exports = {
    uploadProfilePic,
    uploadReview,
    uploadItem
}