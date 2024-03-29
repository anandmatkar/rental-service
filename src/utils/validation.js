const { query, body, validationResult } = require('express-validator');
const validator = require('validator');

const isValidDate = (value) => {
    const dateFormat = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

    if (!dateFormat.test(value)) {
        throw new Error('Invalid date format. Must be in dd-mm-yyyy format');
    }
    return true;
};

const userValidation = {

    createUserValidation: async (req, res) => {
        const validationRules = [
            body('first_name')
                .trim() // Remove leading/trailing spaces
                .isLength({ min: 1 })
                .escape()
                .withMessage('First name is required'),
            body('last_name')
                .trim() // Remove leading/trailing spaces
                .isLength({ min: 1 })
                .withMessage('Last name is required'),
            body('email').isEmail().withMessage('Invalid email address'),
            body('password')
                .trim() // Remove leading/trailing spaces
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long'),
            body('phone')
                .trim() // Remove leading/trailing spaces
                .isMobilePhone()
                .withMessage('Invalid phone number'),
        ];

        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    loginUserValidation: async (req, res) => {
        const validationRules = [
            body('email').trim().isLength({ min: 1 }).withMessage('Email is required'),
            body('password').trim().isLength({ min: 1 }).withMessage('Password is required'),
            body('email').trim().isEmail().withMessage('Invalid email address'),
            body('password').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    editUserValidation: async (req, res) => {
        const validationRules = [
            body('first_name').trim().isLength({ min: 1 }).withMessage('First name is required'),
            body('last_name').trim().isLength({ min: 1 }).withMessage('Last name is required'),
            body('email').trim().isEmail().withMessage('Invalid email address'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    changePasswordValidation: async (req, res) => {
        const validationRules = [
            body('currentPassword').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    forgetPasswordValidation: async (req, res) => {
        const validationRules = [
            body('email').trim().isLength({ min: 1 }).withMessage('Email is required'),
            body('email').trim().isEmail().withMessage('Invalid email address'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    resetPasswordValidation: async (req, res) => {
        const validationRules = [
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    resetPasswordWithOtpValidation: async (req, res) => {
        const validationRules = [
            body('email').trim().isLength({ min: 1 }).withMessage('Email is required'),
            body('email').trim().isEmail().withMessage('Invalid email address'),
            body('otp').trim().isLength({ min: 6 }).withMessage('Please enter correct 6 digit OTP'),
            body('password').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },



}

const itemValidation = {

    addItemValidation: async (req, res) => {
        const validationRules = [
            body('item_name').trim().isLength({ min: 1 }).withMessage('Item name is required'),
            body('item_description').trim().isLength({ min: 1 }).withMessage('Item description is required'),
            body('deposit_price')
                .trim().isLength({ min: 1 }).withMessage('Please Enter a deposit price')
                .custom(value => {
                    if (!validator.isNumeric(value)) {
                        throw new Error('Deposit price must be a number');
                    }
                    return true;
                }),
            body('rental_price')
                .trim().isLength({ min: 1 }).withMessage('Please Enter a rental price')
                .custom(value => {
                    if (!validator.isNumeric(value)) {
                        throw new Error('Rental price must be a number');
                    }
                    return true;
                }),
            body('unit')
                .trim().isIn(['hourly', 'daily', 'monthly', 'yearly']).withMessage('Invalid unit. Must be hourly, daily, monthly, or yearly'),
            body('category_id').isUUID(4).withMessage('Invalid Category Id'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    requestItemForRentValidation: async (req, res) => {
        const validationRules = [
            body('item_name').trim().isLength({ min: 1 }).withMessage('Item name is required'),
            body('description').trim().isLength({ min: 1 }).withMessage('Item description is required'),
            body('deposit_price')
                .trim().isLength({ min: 1 }).withMessage('Please Enter a deposit price')
                .custom(value => {
                    if (!validator.isNumeric(value)) {
                        throw new Error('Deposit price must be a number');
                    }
                    return true;
                }),
            body('rental_price')
                .trim().isLength({ min: 1 }).withMessage('Please Enter a rental price')
                .custom(value => {
                    if (!validator.isNumeric(value)) {
                        throw new Error('Rental price must be a number');
                    }
                    return true;
                }),
            body('unit')
                .trim().isIn(['hourly', 'daily', 'monthly', 'yearly']).withMessage('Invalid unit. Must be hourly, daily, monthly, or yearly'),
            body('renter_id')
                .isUUID(4).withMessage('Invalid User(Provider) Id'),
            body('item_id')
                .isUUID(4).withMessage('Invalid Item Id'),
            body('start_date')
                .custom(isValidDate).withMessage('Invalid start date. Must be in dd-mm-yyyy format'),
            body('end_date')
                .custom(isValidDate).withMessage('Invalid end date. Must be in dd-mm-yyyy format'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    requestItemListValidation: async (req, res) => {
        const validationRules = [
            query('status')
                .trim().isIn(['requested', 'approved', 'returned', 'rejected', 'delivered']).withMessage('Invalid status'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    requestItemDetailsValidation: async (req, res) => {
        const validationRules = [
            // query('status')
            //     .isIn(['requested', 'approved', 'returned', 'rejected', 'delivered']).withMessage('Invalid status'),
            query('request_id')
                .isUUID(4).withMessage('Invalid Request Id'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    deliverItemValidation: async (req, res) => {
        const validationRules = [
            body('otp').trim().isLength({ min: 6 }).withMessage('Please enter correct 6 digit OTP'),
            body('rentalId')
                .isUUID(4).withMessage('Invalid rental Id'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    editAvailabilityValidation: async (req, res) => {
        const validationRules = [
            query('itemId').isUUID(4).withMessage('Invalid Item Id'),
            query('user_id').isUUID(4).withMessage('Invalid User Id'),
            query('status').isIn([true, false]).withMessage('Invalid status'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    deleteItemValidation: async (req, res) => {
        const validationRules = [
            query('image_id').isUUID(4).withMessage('Invalid image Id'),
            query('user_id').isUUID(4).withMessage('Invalid User Id'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },

    editUploadItemImagesValidation: async (req, res) => {
        const validationRules = [
            query('item_id').isUUID(4).withMessage('Invalid Item Id'),
            query('user_id').isUUID(4).withMessage('Invalid User Id'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },
}

const featureValidation = {
    requestTOFeatureValidation: async (req, res) => {
        const validationRules = [
            query('item_id')
                .isUUID(4).withMessage('Invalid Item Id'),
            query('start_date')
                .custom(isValidDate).withMessage('Invalid start date. Must be in dd-mm-yyyy format'),
            query('end_date')
                .custom(isValidDate).withMessage('Invalid end date. Must be in dd-mm-yyyy format'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },
}

const messageValidation = {

    addMessageValidation: async (req, res) => {
        const validationRules = [
            body('message')
                .trim().isLength({ min: 1 }).withMessage('Please Enter Message'),
            body('from')
                .isUUID(4).withMessage('Invalid User Id'),
            body('to')
                .isUUID(4).withMessage('Invalid User Id'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);
    }
}

const reviewValidation = {
    addReviewValidation: async (req, res) => {
        const validationRules = [
            body('rating')
                .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        ];
        await Promise.all(validationRules.map(validationRule => validationRule.run(req)));

        return errors = validationResult(req);

    },
}

module.exports = { userValidation, itemValidation, featureValidation, messageValidation, reviewValidation }



