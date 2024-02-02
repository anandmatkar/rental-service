// Import Joi
const Joi = require("joi");

const disposableEmailDomains = ['yopmail.com', 'yopmail.fr', 'yopmail.net', 'yopmail.org', 'yopmail.info'];

const isDisposableEmailDomain = domain => {
    return disposableEmailDomains.includes(domain);
};

const emailDomainValidation = Joi.string().email().domain(false).custom((value, helper) => {
    const domain = value.split("@")[1];
    if (isDisposableEmailDomain(domain)) {
        return helper.message('Disposable email addresses are not allowed');
    }
    return true;
});

const userValidation = data => {
    const schema = Joi.object({
        email: emailDomainValidation.required(),
        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{8,32}$"))
            .required()
    });
    console.log(schema.validate(data), "11111111111");
    return schema.validate(data);
};

module.exports = userValidation;