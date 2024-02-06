const multer = require('multer')

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profilePic');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop(); // Get the file extension from the original name

        const fileName = `${Date.now()}_${file.originalname}`; // Concatenate date and original name
        cb(null, fileName);
    }
});

const uploadProfilePic = multer({
    storage: storage1
})

const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/reviewImages');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop(); // Get the file extension from the original name

        const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';

        const fileName = `${Date.now()}_${fileType}_${file.originalname}`; // Concatenate date, file type, and original name
        cb(null, fileName);
    }
});


const uploadReview = multer({
    storage: storage2
});


const storage3 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/itemImages');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop(); // Get the file extension from the original name

        const fileName = `${Date.now()}_${file.originalname}`; // Concatenate date and original name
        cb(null, fileName);
    }
});

const uploadItem = multer({
    storage: storage3
})

const storage4 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/catImages');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop(); // Get the file extension from the original name

        const fileName = `${Date.now()}_${file.originalname}`; // Concatenate date and original name
        cb(null, fileName);
    }
});

const uploadCatImage = multer({
    storage: storage4
})

module.exports = {
    uploadProfilePic,
    uploadReview,
    uploadItem,
    uploadCatImage
}