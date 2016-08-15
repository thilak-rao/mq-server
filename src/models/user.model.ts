import * as Joi from "joi";

export const createUserModel = Joi.object().keys({
	firstName: Joi.string().required(),
	lastName : Joi.string().required(),
	email    : Joi.string().email().required(),
	password : Joi.string().regex(/.{8,30}$/).required(),
	lastLogin: Joi.string(),
	isActive : Joi.bool()
});