import Joi from 'joi';

// Schema cho đăng ký
const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .required(),
    fullname: Joi.string()
        .min(3)
        .max(100)
        .required()
});

// Schema cho đăng nhập
const loginSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .min(6)
        .required()
});

// Export các schema
export default {
    registerSchema,
    loginSchema
};
