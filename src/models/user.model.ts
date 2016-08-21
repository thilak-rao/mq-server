import * as Joi from "joi";

export const createUserModel = Joi.object().keys({
	firstName: Joi.string().required(),
	lastName : Joi.string().required(),
	email    : Joi.string().email().required(),
	password : Joi.string().regex(/.{8,30}$/).required(),
});

export const authenticationModel = Joi.object().keys({
	email    : Joi.string().email().required(),
	password : Joi.string().regex(/.{8,30}$/).required()
});

export const deleteUserModel = Joi.object().keys({
	email    : Joi.string().email().required(),
	password : Joi.string().regex(/.{8,30}$/).required()
});

export const updateUserModel = Joi.object().keys({
	firstName  : Joi.string(),
	lastName   : Joi.string(),
	email      : Joi.string().email(),
	newPassword: Joi.string().regex(/.{8,30}$/),
	oldPassword: Joi.string().regex(/.{8,30}$/)
});