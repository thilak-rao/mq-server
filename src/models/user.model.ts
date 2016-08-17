import * as Joi from "joi";

export const createUserModel = Joi.object().keys({
	firstName: Joi.string().required(),
	lastName : Joi.string().required(),
	email    : Joi.string().email().required(),
	password : Joi.string().regex(/.{8,30}$/).required(),
	userRole : Joi.string(),
	lastLogin: Joi.string(),
	isActive : Joi.bool()
});

export const authenticationModel = Joi.object().keys({
	email    : Joi.string().email().required(),
	password : Joi.string().regex(/.{8,30}$/).required()
});

export const deleteUserModel = Joi.object().keys({
	email    : Joi.string().email().required(),
	password : Joi.string().regex(/.{8,30}$/).required()
});