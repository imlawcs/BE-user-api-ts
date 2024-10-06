import Joi from 'joi';

const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .trim()
        .required(),
    password: Joi.string()
        .min(6)
        .required(),
    repeatPassword: Joi.ref('password'),
    fullname: Joi.string()
        .min(3)
        .max(100)
        .required(),
    role: Joi.string()
        .valid('admin', 'user')
        .trim()
        .required(),
})
.with('password', 'repeatPassword');

const loginSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .min(6)
        .required()
});

export {
    registerSchema,
    loginSchema
};
